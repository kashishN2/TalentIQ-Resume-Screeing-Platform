import fitz
from app.utils.text_cleaner import (
    TextCleaner,
)
from pathlib import Path
class PDFService:

    def extract_text(
        self,
        pdf_path: Path,
    ) -> str:

        document = fitz.open(pdf_path)

        text = ""

        for page in document:

            text += page.get_text()

        document.close()

        return TextCleaner.clean(text)

        if not text.strip():
        
            raise ValueError(
                "No readable text found."
            )

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
        pdf_path,
    ):
    
        document = fitz.open(pdf_path)
    
        pages = len(document)
    
        document.close()
    
        return pages

    try:
    
        fitz.open(pdf_path)
    
    except Exception:
    
        raise ValueError(
            "Corrupted PDF."
        )