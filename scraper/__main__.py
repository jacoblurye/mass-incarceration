from .download import get_pdf_urls, download_pdfs
from .process import extract_pdf_data


def main():
    """Download PDF reports from the Massachusetts DOC and extract data from them."""
    pdf_urls = get_pdf_urls()
    pdf_paths = download_pdfs(pdf_urls)
    extract_pdf_data(pdf_paths)


if __name__ == "__main__":
    main()
