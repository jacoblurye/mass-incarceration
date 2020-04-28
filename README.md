# ma-incarceration

Monitoring Massachusetts' progress towards reducing its incarcerated population during the COVID-19 pandemic.

## About the Data

The Massachusetts Department of Correction (DOC) releases [weekly reports](https://www.mass.gov/lists/weekly-inmate-count-2020) with counts of incarcerated people housed in its prison facilities. The reports are PDF files, not spreadsheets or CSVs, which makes data analysis difficult. 

With the magic of [`tabula-py`](https://tabula-py.readthedocs.io), though, we can extract data from these PDFs into CSVs for easier analysis and visualization. In this repository:
- [**`pdfs/`**](https://github.com/jacoblurye/ma-incarceration/tree/master/pdfs) contains the original PDF reports from mass.gov that have been processed.
- [**`data/`**](https://github.com/jacoblurye/ma-incarceration/tree/master/data) contains the extracted CSV data, grouped by state (`prisons.csv`) and county (`jails.csv`).

**Notes:** Not all the data in the reports is currently extracted (in particular, county-level gender breakdowns), and the reports themselves are missing some crucial information like demographic data, offense classifications, and what portion of the population is pre-trial vs. sentenced.

## Take Action

[TODO]