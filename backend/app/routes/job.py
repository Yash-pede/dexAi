
from typing import Optional
from fastapi import APIRouter, HTTPException, Query
from app.services.job_service import get_job_locations, get_job_roles, get_job_results

router = APIRouter()


@router.get("/locations", tags=["Jobs"])
def fetch_job_locations():
    """Fetch available job locations."""
    return get_job_locations()


@router.get("/roles", tags=["Jobs"])
def fetch_job_roles():
    """Fetch available job roles."""
    return get_job_roles()


@router.get("/results/{location}/{role}", tags=["Jobs"])
def fetch_job_results(location: str, role: str, page: Optional[int] = Query(default=1)):
    """Fetch job results based on location and role."""
    try:
            return get_job_results(location, role, page)
    except HTTPException as http_err:
        raise http_err
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")

