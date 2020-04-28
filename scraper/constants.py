import os

SLEEP_FOR = 0.5

THIS_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.join(THIS_DIR, "..")
TABULA_TEMPLATE_PATH = os.path.join(BASE_DIR, "weekly-report.tabula-template.json")
PDF_DIR = os.path.join(BASE_DIR, "pdfs")
DATA_DIR = os.path.join(BASE_DIR, "data")

PDF_LIST_URL = "https://www.mass.gov/lists/weekly-inmate-count-2020"
