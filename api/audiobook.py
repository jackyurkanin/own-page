from PyPDF2 import PdfReader

class AudioBook:
    def __init__(self, pdfFileObj, page=None) -> None:
        self.currentPage = page if page else self.get_first_page()
        self.book = PdfReader(pdfFileObj)
        self.totalPages= len(self.book.pages)

    def read(self): 
        pageObj = self.book.pages[self.currentPage]  # ust to get current page
        pageText = pageObj.extract_text() # text from pdf of page
        return pageText

    def get_first_page(self): 
        diff = 0
        ind = 0
        while diff < 200:
            pageObj = self.book.pages[ind]  
            first  = len(pageObj.extract_text())
            pageObj = self.book.pages[ind+1]
            second = len(pageObj.extract_text())
            diff = second - first
            ind += 1
        return ind
        
    def next_page(self):
        self.currentPage += 1

    def previous_page(self):
        self.currentPage -= 1