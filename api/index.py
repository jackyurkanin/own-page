from fastapi import FastAPI, Depends
from fastapi.responses import PlainTextResponse
from starlette.exceptions import HTTPException as StarletteHTTpException
from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv
import os

app = FastAPI()

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
    return PlainTextResponse(str(exc.details), status_code=exc.status_code)

@app.get("/api/py/hello")
def hello_fast_api():
    return {"message": "Hello from FastAPI"}


