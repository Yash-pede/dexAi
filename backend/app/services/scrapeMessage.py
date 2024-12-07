from bs4 import BeautifulSoup
import nodriver as uc
import time
from curl_cffi import requests

messages_info = []


async def initialize_browser(headless=False):
    browser = await uc.start(headless=headless)
    try:
        try:
            await browser.cookies.load()
            print("Cookies loaded successfully.")
        except Exception as e:
            print(f"Failed to load cookies: {e}")
    except Exception as e:
        print(f"Error initializing browser: {e}")
    return browser


def cookieHelper(cookies, session: requests.Session):
    for cookie in cookies:
        session.cookies.set(cookie.name, cookie.value)
    return session


async def login(browser: uc.Browser, email=None, password=None):
    print("Logging in...")
    try:
        tab = await browser.get("https://wellfound.com/login")
        time.sleep(3)
        page_url = await tab.evaluate("window.location.href")
        if page_url != "https://wellfound.com/login":
            raise Exception("Already Logged In")

        email_input = await tab.find("input[name='user[email]']")
        password_input = await tab.find("input[name='user[password]']")
        login_btn = await tab.find("input[type='submit'][value='Log in']")

        await email_input.send_keys(email)
        await password_input.send_keys(password)
        await login_btn.click()
        time.sleep(5)

        current_url = await tab.evaluate("window.location.href")
        if "login" in current_url:
            raise Exception("Login failed")
        else:
            print("Login successful")
            browser.cookies.save()

            return True
    except Exception as e:
        print(f"Error during login: {e}")
        return False


async def fetch_messages(browser: uc.Browser):
    global messages_info
    try:
        tab = await browser.get("https://wellfound.com/jobs/messages")
        time.sleep(5)
        await tab.select("body")

        message_items = await tab.find("div[data-test='MessagesList']")
        print(f"Found {message_items.child_node_count - 1} messages.")

        for item in message_items.children[:-1]:
            try:

                item_html = await item.get_html()
                soup = BeautifulSoup(item_html, "html.parser")

                image_url = soup.find("img")["src"]
                company_name = soup.find("h3", class_="styles_startupName__RdpFG").text
                sender_name = soup.find("span", class_="styles_sender__OXIee").text
                date = soup.find("span", class_="styles_date__oHT46")["title"]
                message_text = soup.find(
                    "span", class_="styles_messageText__Xqdns"
                ).text
                message_link = soup.find("a")["href"]

                messages_info.append(
                    {
                        "img_url": image_url,
                        "company_name": company_name,
                        "sender_name": sender_name,
                        "date": date,
                        "message_text": message_text,
                        "message_link": "https://wellfound.com" + message_link,
                    }
                )

                return messages_info

            except Exception as e:
                print(f"Error extracting data for a message item: {e}")

        print("Messages written to msg.txt successfully.")
    except Exception as e:
        print(f"Error during message fetching: {e}")


async def send_message(browser: uc.Browser, message_id, message):
    try:
        tab = await browser.get("https://wellfound.com/jobs/messages/" + message_id)
        time.sleep(5)
        await tab.select("body")

        message_input = await tab.find("textarea[name='body']")
        send_btn = await tab.find("button[type='submit'][data-test='Button']")

        await message_input.send_keys(message)
        time.sleep(3)
        await send_btn.click()
        print("Message sent successfully.")
        return True

    except Exception as e:
        print(f"Error sending message: {e}")
        return False


async def get_full_conversation(browser, message_id):
    try:
        tab = await browser.get(f"https://wellfound.com/jobs/messages/{message_id}")
        time.sleep(5)
        await tab.select("body")

        conv_div = await tab.find("div[data-test='ConversationDetail-Messages']")

        conversation = []
        message_components = list(conv_div.children[1:])

        for idx, item in enumerate(message_components):
            item_html = await item.get_html()

            soup = BeautifulSoup(item_html, "html.parser")

            sender_info = soup.find("a", class_="styles_profileLink__0x5uH")
            sender_avatar = soup.find("img", class_="rounded-full")

            current_sender_name = "Unknown Sender"
            current_sender_avatar = None

            if sender_info:
                current_sender_name = sender_info.text.strip()
            if sender_avatar:
                current_sender_avatar = sender_avatar.get("src")

            if not sender_info and idx < len(message_components) - 1:
                for forward_idx in range(idx + 1, len(message_components)):
                    forward_html = await message_components[forward_idx].get_html()
                    forward_soup = BeautifulSoup(forward_html, "html.parser")
                    forward_sender = forward_soup.find(
                        "a", class_="styles_profileLink__0x5uH"
                    )
                    forward_avatar = forward_soup.find("img", class_="rounded-full")

                    if forward_sender:
                        current_sender_name = forward_sender.text.strip()
                        current_sender_avatar = (
                            forward_avatar.get("src") if forward_avatar else None
                        )
                        break

            message_body = soup.find("div", class_="styles_body__iG8VI")
            message_text = message_body.get_text(strip=True) if message_body else ""

            timestamp = soup.find("span", class_="text-gray-700")
            message_time = timestamp.text.strip() if timestamp else "Unknown Time"

            message_dict = {
                "sender": current_sender_name,
                "avatar": current_sender_avatar,
                "message": message_text,
                "timestamp": message_time,
            }

            conversation.append(message_dict)

        company_div = await tab.find("div[class='styles_component__uPwbD']")
        company_html = await company_div.get_html()
        company_soup = BeautifulSoup(company_html, "html.parser")

        company_name = company_soup.find("h3", class_="styles-module_component__3ZI84")
        company_name = company_name.text.strip() if company_name else "Unknown Company"

        company_description = company_soup.find("span", class_="text-sm")
        company_description = (
            company_description.text.strip()
            if company_description
            else "No description available."
        )

        company_logo = company_soup.find("img", class_="rounded-md")
        company_logo_url = company_logo.get("src") if company_logo else None

        company_info = {
            "name": company_name,
            "description": company_description,
            "logo": company_logo_url,
        }

        return {
            "conversation_id": message_id,
            "messages": conversation,
            "company_info": company_info,
        }

    except Exception as e:
        print(f"Error fetching conversation: {e}")
        return {"error": str(e)}
