
from typing import List, Optional
from pydantic import BaseModel


class JobDetails(BaseModel):
    job_description: str
    job_type: str
    job_details: List[str]
    job_time: str
    job_link: str


class JobResult(BaseModel):
    job_title: str
    company_description: str
    company_size: str
    additional_details: List[JobDetails]
