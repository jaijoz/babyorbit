from .baby_profile import get_baby_profile
from ..data.seed_data import MILESTONES


def get_milestones(baby_name: str = None, age_months: int = None) -> dict:
    """Get developmental milestones for baby's age.

    Args:
        baby_name: Name of registered baby (optional)
        age_months: Age in months (optional)

    Returns:
        dict: Current, upcoming, and flagged milestones
    """
    if baby_name:
        result = get_baby_profile(baby_name)
        if result["status"] == "not_found":
            return result
        age_months = result["profile"]["age_months"]
    if age_months is None:
        return {"status": "error", "message": "Provide baby_name or age_months"}

    current = [m for m in MILESTONES if m["age_months"] <= age_months and m["age_months"] >= age_months - 2]
    upcoming = [m for m in MILESTONES if age_months < m["age_months"] <= age_months + 3]
    watch = [m for m in MILESTONES if m["concern_if_not_by"] in (age_months, age_months + 1)]

    return {
        "age_months": age_months, "current": current, "upcoming": upcoming,
        "watch_for_delays": watch, "source": "CDC Act Early & WHO Motor Development Study"
    }
