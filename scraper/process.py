import os
import math
from datetime import datetime
from multiprocessing.pool import ThreadPool
from typing import List, Union

import pandas as pd
from tabula import read_pdf_with_template

from .constants import TABULA_TEMPLATE_PATH, DATA_DIR, NUM_THREADS

prisons = {"maximum": [""], "medium": [], "minimum": [], "minimum/pre-release": []}


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


state_columns = [
    "facility",
    "operational_capacity",
    "inmates_in_general_population_beds",
    "percent_occupied",
    "inmates_in_support_beds",
    "total_occupancy",
]


def process_state_df(df: pd.DataFrame) -> pd.DataFrame:
    # Drop rows and columns that we want to exclude
    df = df.dropna(how="all")
    df = df.apply(left_fill_row, axis=1)
    df = df[~df[df.columns[0]].str.startswith("SUB-TOTAL")]
    df = df[df.isnull().sum(axis=1) < 4]
    df = df.dropna(how="all", axis=1)

    df.columns = state_columns

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


def process_state_df_part(df: pd.DataFrame) -> pd.DataFrame:
    first_row = pd.DataFrame({c: [c] for c in df.columns})
    df = pd.concat([first_row, df])

    df.columns = state_columns[: df.shape[1]]
    df["inmates_in_support_beds"] = 0
    df["total_facility_occupancy"] = df.inmates_in_general_population_beds

    return process_state_df(df)


county_columns = [
    "facility",
    "operational_capacity",
    "hoc_population",
    "county_population",
    "total_occupancy",
    "percent_occupied",
]

# Special case - Ash Street sometimes missing line in table
def process_county_df(df: pd.DataFrame, data_dir: str = DATA_DIR) -> pd.DataFrame:
    df = df[df[df.columns[2]] != "HOC"]

    df.columns = county_columns

    new_rows = []
    current_county = None
    for _, row in df.iterrows():
        if row.facility == "Ash Street" and isinstance(row.operational_capacity, str):
            county_population = row.hoc_population
            row.hoc_population = row.operational_capacity.split("\r")[0][3:]
            row.county_population, row.total_occupancy, row.percent_occupied = (
                county_population,
                row.county_population,
                row.total_occupancy,
            )
            row.operational_capacity = 206
        if pd.isnull(row.operational_capacity):
            current_county = row.facility
        elif (
            row.facility.isupper() and row.facility.isalnum() and row.facility != "WIT"
        ):
            new_rows.append(row)
        else:
            row.facility = f"{current_county} ({row.facility})"
            new_rows.append(row)

    df = pd.DataFrame(new_rows)

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

    is_state_df = lambda df: "OPERATIONAL\rCAPACITY 1" in df.columns
    is_state_df_part = lambda df: "BOSTON PRE-RELEASE" in df.columns
    is_county_df = lambda df: "COUNTY\rFACILITIES" in df.columns
    is_report_date = lambda df: df.shape[1] == 1 and df.columns[0].startswith("DATE :")

    def process_pdf(pdf):
        print(pdf)
        dfs = read_pdf_with_template(pdf, tabula_template_path)
        report = {}
        state_df_part = None
        for df in dfs:
            if is_county_df(df):
                report["county_df"] = process_county_df(df)
            elif is_state_df(df):
                report["state_df"] = process_state_df(df)
            elif is_state_df_part(df):
                state_df_part = process_state_df_part(df)
            elif is_report_date(df):
                report["report_date"] = process_report_date(df)

        if state_df_part is not None:
            report["state_df"] = report["state_df"].append(state_df_part)

        for expected_key in ["county_df", "state_df", "report_date"]:
            assert expected_key in report, f"Couldn't extract {expected_key} from {pdf}"

        report["county_df"]["report_date"] = report["report_date"]
        report["state_df"]["report_date"] = report["report_date"]

        return report

    with ThreadPool(NUM_THREADS) as pool:
        reports = pool.map(process_pdf, pdf_paths)

    # Join all DFs with an additional date column
    county_dfs = []
    state_dfs = []
    for report in reports:
        county_dfs.append(report["county_df"])
        state_dfs.append(report["state_df"])

    state_df = pd.concat(state_dfs)
    county_df = pd.concat(county_dfs)

    state_df.to_csv(os.path.join(target_dir, "state_facilities.csv"), index=False)
    county_df.to_csv(os.path.join(target_dir, "county_facilities.csv"), index=False)
