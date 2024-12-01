import PyPDF2



class AudioBook:
    def __init__(self) -> None:
        self.isOn = True
        self.currentPage = None

        # set_api_key(API_KEY)
        # vcs = voices()
        # self.voice = vcs[-2]
        self.reading = True
        self.book = None

    def quit(self):
        self.isOn = False

    def read(self): 
        pageObj = self.book.pages[self.currentPage]  # ust to get current page
        pageText = pageObj.extract_text() # text from pdf of page

        # text to audio here
        

        return audio data here

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
        
    def open_book(self, book, bookmark=None):
        """_summary_
            action to call when a book is selected on the front end
        Args:
            book (_type_): the pdf object that the front end has recieved
            bookmark (_type_): number of last page in cookies or None if it does not exist
        """
        pdfFileObj = open(f'Books/{book}.pdf', 'rb') # maybe its already pdfFileObj and can skip this
        self.book = PyPDF2.PdfReader(pdfFileObj) # open book
        self.currentPage = bookmark if bookmark else self.get_first_page()
        
    def next_page(self):
        self.currentPage += 1

    def previous_page(self):
        self.currentPage -= 1