
from contextlib import asynccontextmanager
from fastapi import APIRouter, FastAPI, HTTPException
from pydantic import BaseModel

from app.services.msg_service import sendMessage, userLogin, messages
from app.services.scrapeMessage import get_full_conversation, initialize_browser

browser = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global browser
    b = await initialize_browser()
    browser = b
    yield
    
router = APIRouter(lifespan=lifespan)

class LoginRequest(BaseModel):
    email: str
    password: str

class SendMessageRequest(BaseModel):
    messageid: str
    message: str


@router.post("/login", tags=["Messages"])
async def get_user_login(request: LoginRequest):
    """Login to the website."""
    try:
        result = await userLogin(email=request.email, password=request.password, browser=browser)
        return result
    except HTTPException as http_err:
        raise http_err
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")

@router.get("/list", tags=["Messages"])
async def get_user_messages():
    """Get user messages."""
    try:
        return await messages(browser=browser)
    except HTTPException as http_err:
        raise http_err
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")

@router.post("/send", tags=["Messages"])
async def send_message(request: SendMessageRequest):
    """Send a message."""
    try:
        return await sendMessage(
            browser=browser,
            message_id=request.messageid,
            message=request.message
        )
    except HTTPException as http_err:
        raise http_err
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")

    
@router.get("/conversation/{messageid}", tags=["Messages"])
async def get_conversation(messageid: str):
    try:
        return await get_full_conversation(browser=browser, message_id=messageid)
    except HTTPException as http_err:
        raise http_err
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")