# Mass. Incarceration
![Refresh Data and Rebuild Site](https://github.com/jacoblurye/ma-incarceration/workflows/Refresh%20Data%20and%20Rebuild%20Site/badge.svg)

Monitoring Massachusetts' progress towards reducing its incarcerated population.

## About the Data

The Massachusetts Department of Correction (DOC) releases [weekly reports](https://www.mass.gov/lists/weekly-inmate-count-2020) with counts of incarcerated people housed in its facilities. The reports are PDF files, not spreadsheets or CSVs, which makes data analysis difficult. 

With the magic of [`tabula-py`](https://tabula-py.readthedocs.io), though, we can extract data from these PDFs into CSVs for easier analysis and visualization. In this repository:
- [**`pdfs/`**](https://github.com/jacoblurye/ma-incarceration/tree/master/pdfs) contains the original Massachusetts DOC reports.
- [**`data/`**](https://github.com/jacoblurye/ma-incarceration/tree/master/data) contains the extracted CSV data, grouped by DOC (`doc_facilities.csv`) and county (`county_facilities.csv`).

**Notes:** Not all the data in the reports is currently extracted (in particular, gender breakdowns or facility security-levels), and the reports themselves are missing some crucial information, like racial demographic data and charge classifications.

## Good Links

- ACLU of Massachusetts' online tracker for daily release and COVID-19 testing data across the MA prison system: [link](https://data.aclum.org/sjc-12926-tracker/)
- An open letter from Massachusetts doctors to the governor's office: [link](https://docs.google.com/document/d/e/2PACX-1vSgJLDEGEPaQ4fHNSCKMwp5aC3omfFRDu463FE96F2JBynN84ZJva3JTjpsM69CqwtAp0Dhmhetvatc/pub)
- Families for Justice as Healing's Week of Action, with steps MA residents can take to push for decarceration: [link](https://tinyurl.com/maweekofaction)
- Prisoners' Legal Services of Massachusetts' COVID-19 news and information page: [link](https://www.plsma.org/covid-19-in-ma-prisons-and-jails/)
- Vera Institute of Justice's articles on the criminal justice system's COVID-19 response across the US: [link](https://www.vera.org/blog/covid-19-1)
