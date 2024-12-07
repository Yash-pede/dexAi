from fastapi import Depends, HTTPException
from fastapi.responses import JSONResponse
from app.services.scrapeMessage import login, fetch_messages, send_message


async def userLogin(email: str, password: str, browser):
    """Perform login using the browser instance."""
    try:
        logged_in = await login(browser, email, password)
        if logged_in:
            return {"message": "Login successful"}
        else:
            raise HTTPException(status_code=401, detail="Login failed.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")


async def messages(browser):
    """Fetch messages using the browser instance."""
    try:
        fetched_messages = await fetch_messages(browser=browser)
        return {"messages": fetched_messages}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")

async def sendMessage(browser, message_id, message):
    try:
        await send_message(browser, message_id, message)
        return {"message": "Message sent successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}") 