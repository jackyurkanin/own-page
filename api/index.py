from typing import Iterator
from fastapi import FastAPI, Depends, Form, Request
from fastapi.responses import PlainTextResponse, StreamingResponse
from starlette.exceptions import HTTPException as StarletteHTTpException
from fastapi.middleware.cors import CORSMiddleware
from api.audiobook import AudioBook
from dotenv import load_dotenv
import os

load_dotenv()

# Access the variable
EL_API_KEY = os.getenv("ELEVEN_LABS_API_KEY")

app = FastAPI()

from elevenlabs import ElevenLabs

client = ElevenLabs(
  api_key=EL_API_KEY,
)

origins = [
    "https://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(StarletteHTTpException)
async def http_exception_handler(request, exc):
    print(f"{repr(exc)}")
    return PlainTextResponse(str(exc.detail), status_code=exc.status_code)

@app.post("/api/py/hello")
async def hello_fast_api(request: Request):
    data = await request.json()
    line = f"Hello from FastAPI {data['text']}"
    return line

@app.post('/api/py/get-audiobook')
def get_audiobook(
    pdfFileObj: str = Form(...),
    savedPage: int = Form(...),
):
    audiobook = AudioBook(pdfFileObj, savedPage)
    page_text = audiobook.read()
    return {'currentPage': audiobook.currentPage, 'totalPages': audiobook.totalPages, 'text': page_text}

@app.post('/api/py/get-audio', response_class=StreamingResponse)
def get_audio(page_text):
    audio_stream = client.generate(
        voice="Bill",
        model="eleven_turbo_v2_5",
        text=page_text,
    )
    return StreamingResponse(audio_stream, media_type="audio/mpeg")

@app.post('/api/py/change-page')
def get_audio(
    pdfFileObj: str = Form(...),
    page: int = Form(...),
    func: str = Form(...),
):
    audiobook = AudioBook(pdfFileObj, page)

    if func == "back":
        audiobook.previous_page()
    elif func == "next":
        audiobook.next_page()
    else:
        raise StarletteHTTpException(status_code=500, detail=f"Not a valid function ${func}")
    content = audiobook.read()
    return {'page': audiobook.currentPage, 'text': content}


