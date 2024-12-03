import requests
from bs4 import BeautifulSoup
import json


url = "https://wellfound.com/role/l/product-manager/india"

def extract_job_cards(url):
    response = requests.get(url)

    if response.status_code != 200:
        print(f"Failed to retrieve the page. Status code: {response.status_code}")
        return

    soup = BeautifulSoup(response.text, "html.parser")

    job_data = []

    job_cards = soup.find_all(
        "div", class_="mb-6 w-full rounded border border-gray-400 bg-white"
    )

    for idx, card in enumerate(job_cards):
        job_info = {}

        title_div = card.find("div", class_="w-full space-y-2 px-4 pb-2 pt-4")
        info_div = card.find("div", class_="mb-4 w-full px-4")

        if title_div:
            company_title = title_div.find("h2")
            company_desc = title_div.find("span", class_="text-xs text-neutral-1000")
            company_size = title_div.find(
                "span", class_="text-xs italic text-neutral-500"
            )

            job_info["job_title"] = (
                company_title.text.strip() if company_title else "N/A"
            )
            job_info["company_description"] = (
                company_desc.text.strip() if company_desc else "N/A"
            )
            job_info["company_size"] = (
                company_size.text.strip() if company_size else "N/A"
            )

        if info_div:
            additional_details = []

            for child in info_div.children:
                job_description = child.find("a")
                job_type = job_description.next_sibling
                job_details = child.find_all("span", class_="pl-1 text-xs")
                job_time = child.find(
                    "span", class_="text-xs lowercase text-dark-a md:hidden"
                )

                detail = {
                    "job_description": job_description.text.strip()
                    if job_description
                    else "N/A",
                    "job_type": job_type.text.strip(),
                    "job_details": [
                        job_detail.text.strip() for job_detail in job_details
                    ],
                    "job_time": job_time.text.strip() if job_time else "N/A",
                    "Job_link" : job_description.get("href") if job_description else "N/A"
                }

                additional_details.append(detail)

            job_info["additional_details"] = additional_details

        job_data.append(job_info)

    with open("job_cards_data.json", "w") as json_file:
        json.dump(job_data, json_file, indent=4)

    print(f"Extracted and saved {len(job_data)} job cards to job_cards_data.json.")

extract_job_cards(url)
