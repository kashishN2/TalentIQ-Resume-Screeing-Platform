from pathlib import Path

import fitz

from app.utils.text_cleaner import TextCleaner


class PDFService:

    def extract_text(
        self,
        pdf_path: Path,
    ) -> str:

        try:
            document = fitz.open(pdf_path)

            text = ""

            for page in document:
                text += page.get_text()

            document.close()

        except Exception as exc:
            raise ValueError(
                f"Unable to read PDF: {exc}"
            )

        text = TextCleaner.clean(text)

        if not text.strip():
            raise ValueError(
                "No readable text found."
            )

        return text

    def extract_multiple(
        self,
        paths,
    ):

        result = {}

        for path in paths:

            try:
                text = self.extract_text(path)

                result[path] = text

            except Exception:
                result[path] = None

        return result

    def page_count(
        self,
        pdf_path: Path,
    ) -> int:

        try:
            document = fitz.open(pdf_path)

            pages = len(document)

            document.close()

            return pages

        except Exception as exc:
            raise ValueError(
                f"Unable to read PDF: {exc}"
            )