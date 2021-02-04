import os
from multiprocessing import cpu_count

SLEEP_FOR = 0.5
NUM_THREADS = cpu_count() * 2 + 1

THIS_DIR = os.path.dirname(os.path.abspath(__file__))
SCRAPER_DIR = os.path.join(THIS_DIR, "..")
TABULA_TEMPLATE_PATH = os.path.join(SCRAPER_DIR, "weekly-report.tabula-template.json")
BASE_DIR = os.path.join(SCRAPER_DIR, "..")
PDF_DIR = os.path.join(BASE_DIR, "pdfs")
DATA_DIR = os.path.join(BASE_DIR, "data")

PDF_LIST_URLS = [
    "https://www.mass.gov/lists/weekly-inmate-count-2020",
    "https://www.mass.gov/lists/weekly-inmate-count-2021",
]
