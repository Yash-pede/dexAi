from fastapi import HTTPException
import requests
from bs4 import BeautifulSoup
from typing import List
from app.schema.job import JobResult
from typing import Tuple
import os


def extract_max_pages(soup: BeautifulSoup) -> int:
    """Extract the maximum page number from the pagination."""
    pagination_nav = soup.find("nav", attrs={"aria-label": "Pagination Navigation"})

    if not pagination_nav:
        return 1 


    pagination_list = pagination_nav.find("ul")
    if not pagination_list:
        return 1


    page_numbers = []
    for li in pagination_list.find_all("li"):
        link = li.find("a", attrs={"aria-label": True})
        if link:
            aria_label = link["aria-label"]
            if "Go to page" in aria_label:
                try:
                    page_number = int(aria_label.split()[-1])
                    page_numbers.append(page_number)
                except ValueError:
                    continue

    return max(page_numbers) if page_numbers else 1


def extract_job_cards(url: str, page: int) -> Tuple[List[JobResult], int]:
    """Extract job cards from the given URL and calculate max pages."""
    USERNAME = os.getenv("OXYLAB_USERNAME")
    PASSWORD = os.getenv("OXYLAB_PASSWORD")

    if not USERNAME or not PASSWORD:
        raise EnvironmentError("OXYLAB_USERNAME or OXYLAB_PASSWORD is not set in the environment variables.")


    # Define proxy dict.
    proxies = {
    'http': f'http://{USERNAME}:{PASSWORD}@unblock.oxylabs.io:60000',
    'https': f'https://{USERNAME}:{PASSWORD}@unblock.oxylabs.io:60000',
    }
    scrapeUrl = url + (f"?page={page}" if page > 1 else "")
    response = requests.request(
        'GET',
        scrapeUrl,
        verify=False,  # Ignore the SSL certificate
        proxies=proxies,
    )

    # Print result page to stdout
    print(response.url)
    print(response.status_code)

    # Save returned HTML to result.html file
    with open('result.html', 'w') as f:
        f.write(response.text)
        
    try:
        if response.status_code != 200:
            raise Exception(f"Failed to retrieve the page. Status code: {response.status_code}")

        soup = BeautifulSoup(response.text, "html.parser")
        with open('result.html', 'w') as f:
            f.write(response.text)
    
        max_pages = extract_max_pages(soup)

    
        job_data = []
        job_cards = soup.find_all("div", class_="mb-6 w-full rounded border border-gray-400 bg-white")

        for idx, card in enumerate(job_cards):
            job_info = {}

            title_div = card.find("div", class_="w-full space-y-2 px-4 pb-2 pt-4")
            info_div = card.find("div", class_="mb-4 w-full px-4")

            if title_div:
                company_title = title_div.find("h2")
                company_desc = title_div.find("span", class_="text-xs text-neutral-1000")
                company_size = title_div.find("span", class_="text-xs italic text-neutral-500")

                job_info["job_title"] = company_title.text.strip() if company_title else "N/A"
                job_info["company_description"] = company_desc.text.strip() if company_desc else "N/A"
                job_info["company_size"] = company_size.text.strip() if company_size else "N/A"

            if info_div:
                additional_details = []

                for child in info_div.children:
                    job_description = child.find("a")
                    job_type = job_description.next_sibling
                    job_details = child.find_all("span", class_="pl-1 text-xs")
                    job_time = child.find("span", class_="text-xs lowercase text-dark-a md:hidden")

                    detail = {
                        "job_description": job_description.text.strip() if job_description else "N/A",
                        "job_type": job_type.text.strip() if job_type else "N/A",
                        "job_details": [job_detail.text.strip() for job_detail in job_details],
                        "job_time": job_time.text.strip() if job_time else "N/A",
                        "job_link": job_description.get("href") if job_description else "N/A",
                    }

                    additional_details.append(detail)

                job_info["additional_details"] = additional_details

            job_data.append(job_info)

    
        pages_left = max_pages - page

        return job_data, pages_left

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=response.status_code, detail=f"Request error: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}")


def get_job_results(location: str, role: str, page: int) -> dict:
    """Return job results along with pages left based on location, role, and page."""
    if not location or not role:
        raise HTTPException(status_code=400, detail="Location and role are required")

    url = f"https://wellfound.com/role/{"l" if location != 'Remote' else "r"}/{role}/{location if location != 'Remote' else ''}"
    job_data, pages_left = extract_job_cards(url, page)

    return {
        "data": job_data,
        "pages_left": pages_left
    }

def get_job_locations() -> List[str]:
    """Return a list of mock job locations."""
    locations = [
        "New-York",
        "San-Francisco",
        "Los-Angeles",
        "India",
        "Remote",
        "Austin",
        "Seattle",
        "Boston",
        "Chicago",
        "Denver",
        "district-of-columbia",
    ]

    locatinon_data = [
        {"value": location, "label": location.replace("-", " ")}
        for location in locations
    ]
    return locatinon_data


def get_job_roles() -> List[str]:
    """Return a list of mock job roles."""
    roles = [
        "Software-Engineer",
        "Engineering-Manager",
        "Artificial-Intelligence-Engineer",
        "Machine-Learning-Engineer",
        "Product-Manager",
        "Backend-Engineer",
        "Mobile-Engineer",
        "Product-Designer",
        "Frontend-Engineer",
        "Full-Stack-Engineer",
        "Data-Scientist",
        "Designer",
        "Software-Architect",
        "Devops-Engineer",
    ]

    roles_data = [{"value": role, "label": role.replace("-", " ")} for role in roles]
    return roles_data

