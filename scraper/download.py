import os
from time import sleep
from typing import List

import requests
from bs4 import BeautifulSoup as bs

from .constants import PDF_DIR, PDF_LIST_URL, SLEEP_FOR


def get_pdf_urls(pdf_list_url: str = PDF_LIST_URL) -> List[str]:
    """
    Extract the list of download URLs for the Massachusetts DOC's PDF 
    reports.
    """
    html = requests.get(pdf_list_url).content
    soup = bs(html, "lxml")
    a_tags = soup.find_all("a", {"class": "ma__download-link__file-link"})
    urls = [a.attrs["href"] for a in a_tags]
    return urls


def _pdf_url_to_filename(url: str) -> str:
    """
    Convert a PDF URL like 'https://www.mass.gov/doc/weekly-inmate-count-4202020/download'
    into a filename like 'weekly-inmate-count-4202020.pdf'
    """
    name_part = url[25:-9]
    return f"{name_part}.pdf"


def download_pdfs(
    pdf_urls: List[str], target_dir: str = PDF_DIR, overwrite: bool = True
) -> List[str]:
    """
    Download PDFs from the given URL list and save them to `target_dir`. If the
    file for a PDF URL appears to already exist, only overwrite it if `overwrite` is True.
    Return the list of local file paths where the PDFs are saved.
    """
    file_paths = []
    for url in pdf_urls:
        file_name = _pdf_url_to_filename(url)
        file_path = os.path.join(target_dir, file_name)
        file_paths.append(file_path)

        if os.path.isfile(file_path):
            continue

        pdf = requests.get(url).content
        with open(file_path, "wb") as f:
            f.write(pdf)

        sleep(SLEEP_FOR)

    return file_paths
