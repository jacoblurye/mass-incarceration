import os
import math
from datetime import datetime
from multiprocessing.pool import ThreadPool
from typing import List, Union

import pandas as pd
from tabula import read_pdf_with_template

from .constants import TABULA_TEMPLATE_PATH, DATA_DIR, NUM_THREADS

def is_empty(v) -> bool:
    return v == None or v == "" or (isinstance(v, float) and math.isnan(v))


def left_fill_row(row):
    columns = row.keys()
    back_pop = 0
    for i, value in enumerate(row):
        if is_empty(value):
            back_pop += 1
        elif back_pop:
            this_column = columns[i]
            target_column = columns[i - back_pop]
            row[target_column] = value
            row[this_column] = None
    return row


def clean_number(v) -> Union[int, float]:
    if isinstance(v, str):
        for char in [" ", ",", "%"]:
            v = v.replace(char, "")

    if v == "-":
        return 0

    try:
        v = float(v)
    except:
        v = math.nan

    return v


doc_columns = [
    "facility",
    "operational_capacity",
    "inmates_in_general_population_beds",
    "percent_occupied",
    "inmates_in_support_beds",
    "total_occupancy",
]


def process_doc_df(df: pd.DataFrame) -> pd.DataFrame:
    # Drop rows and columns that we want to exclude
    df = df.dropna(how="all")
    df = df.apply(left_fill_row, axis=1)
    df = df[~df[df.columns[0]].str.startswith("SUB-TOTAL")]
    df = df[df.isnull().sum(axis=1) < 4]
    df = df.dropna(how="all", axis=1)

    df.columns = doc_columns

    # Clean up columns for which we expect number values
    for col in df.columns[1:]:
        df[col] = df[col].apply(clean_number)

    # Special case where there are two MCI CEDAR JUNCTION @ WALPOLE facilities
    seen_first_cedar_junction = False
    for i, row in df.iterrows():
        if row.facility == "MCI CEDAR JUNCTION @ WALPOLE":
            if seen_first_cedar_junction:
                row.facility = f"{row.facility} (Medium)"
            else:
                seen_first_cedar_junction = True
                row.facility = f"{row.facility} (Maximum)"
            df.loc[i] = row

    return df


def process_doc_df_part(df: pd.DataFrame) -> pd.DataFrame:
    first_row = pd.DataFrame({c: [c] for c in df.columns})
    df = pd.concat([first_row, df])

    df.columns = doc_columns[: df.shape[1]]
    df["inmates_in_support_beds"] = 0
    df["total_facility_occupancy"] = df.inmates_in_general_population_beds

    return process_doc_df(df)


county_columns = [
    "facility",
    "operational_capacity",
    "hoc_population",
    "jail_population",
    "total_occupancy",
    "percent_occupied",
]

# Special case - Ash Street sometimes missing line in table
def process_county_df(df: pd.DataFrame, data_dir: str = DATA_DIR) -> pd.DataFrame:
    df = df[df[df.columns[2]] != "HOC"]

    df.columns = county_columns

    new_rows = []
    current_county = None
    ash_street_bug = False
    for _, row in df.iterrows():
        if row.facility == "Ash Street" and isinstance(row.operational_capacity, str):
            jail_population = row.hoc_population
            row.hoc_population = row.operational_capacity.split("\r")[0][3:]
            row.jail_population, row.total_occupancy, row.percent_occupied = (
                jail_population,
                row.jail_population,
                row.total_occupancy,
            )
            row.operational_capacity = 206
            ash_street_bug = True
        elif row.facility == 'Dartmouth' and ash_street_bug:
            row.jail_population, row.total_occupancy, row.percent_occupied = (row.hoc_population, row.jail_population, row.total_occupancy)
            row.hoc_population = float(row.total_occupancy) - float(row.jail_population)
        elif row.facility == 'SUFFOLK' and not pd.isnull(row.operational_capacity):
            current_county = row.facility
            row.facility = "SUFFOLK (Nashua Street)"
            new_rows.append(row)
            continue
        
        if row.facility.isupper() and row.facility.isalnum() and row.facility != "WIT":
            if pd.isnull(row.operational_capacity):
                current_county = row.facility
            else:
                new_rows.append(row)
        elif not pd.isnull(row.operational_capacity):
            row.facility = f"{current_county} ({row.facility})"
            new_rows.append(row)
        else:
            assert row.facility == "Nashua Street"

    df = pd.DataFrame(new_rows)
    
    # Drop some more rows
    df = df[df.facility != 'TOTAL']

    # Clean up columns for which we expect number values
    for col in df.columns[1:]:
        df[col] = df[col].apply(clean_number)

    return df


def process_report_date(df: pd.DataFrame) -> datetime:
    date_string = df.columns[0].split(": ")[1]
    dt = datetime.strptime(date_string, "%B %d, %Y")
    return dt


def extract_pdf_data(
    pdf_paths: List[str],
    tabula_template_path: str = TABULA_TEMPLATE_PATH,
    target_dir: str = DATA_DIR,
):
    if not os.path.exists(target_dir):
        os.mkdir(target_dir)

    is_doc_df = lambda df: "OPERATIONAL\rCAPACITY 1" in df.columns
    is_doc_df_part = lambda df: "BOSTON PRE-RELEASE" in df.columns
    is_county_df = lambda df: "COUNTY\rFACILITIES" in df.columns
    is_report_date = lambda df: df.shape[1] == 1 and df.columns[0].startswith("DATE :")

    def process_pdf(pdf):
        print(pdf)
        dfs = read_pdf_with_template(pdf, tabula_template_path)
        report = {}
        doc_df_part = None
        for df in dfs:
            if is_county_df(df):
                report["county_df"] = process_county_df(df)
            elif is_doc_df(df):
                report["doc_df"] = process_doc_df(df)
            elif is_doc_df_part(df):
                doc_df_part = process_doc_df_part(df)
            elif is_report_date(df):
                report["report_date"] = process_report_date(df)

        if doc_df_part is not None:
            report["doc_df"] = report["doc_df"].append(doc_df_part)

        for expected_key in ["county_df", "doc_df", "report_date"]:
            assert expected_key in report, f"Couldn't extract {expected_key} from {pdf}"

        report["county_df"]["report_date"] = report["report_date"]
        report["doc_df"]["report_date"] = report["report_date"]

        return report

    with ThreadPool(NUM_THREADS) as pool:
        reports = pool.map(process_pdf, pdf_paths)

    # Join all DFs with an additional date column
    county_dfs = []
    doc_dfs = []
    for report in reports:
        county_dfs.append(report["county_df"])
        doc_dfs.append(report["doc_df"])

    doc_df = pd.concat(doc_dfs)
    county_df = pd.concat(county_dfs)

    doc_df.to_csv(os.path.join(target_dir, "doc_facilities.csv"), index=False)
    county_df.to_csv(os.path.join(target_dir, "county_facilities.csv"), index=False)

if __name__ == "__main__":
    extract_pdf_data(["/Users/jlurye/code/sandbox/ma-incarceration/scraper/scraper/../../pdfs/weekly-inmate-count-232020.pdf"])