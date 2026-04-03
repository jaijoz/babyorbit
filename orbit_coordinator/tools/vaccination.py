from datetime import datetime
from ..store.memory_store import store
from .baby_profile import get_baby_profile
from ..data.seed_data import VACCINATION_SCHEDULE


def get_vaccination_schedule(baby_name: str = None, age_weeks: int = None) -> dict:
    """Get vaccination schedule. Provide baby_name or age_weeks.

    Args:
        baby_name: Name of registered baby (optional)
        age_weeks: Age in weeks (optional)

    Returns:
        dict: Overdue, due now, and upcoming vaccinations
    """
    if baby_name:
        result = get_baby_profile(baby_name)
        if result["status"] == "not_found":
            return result
        age_weeks = result["profile"]["age_weeks"]
    if age_weeks is None:
        return {"status": "error", "message": "Provide baby_name or age_weeks"}

    baby_id = baby_name.lower().replace(" ", "_") if baby_name else "unknown"
    completed = store.get_vaccinations(baby_id)

    overdue, due_now, upcoming = [], [], []
    for vax in VACCINATION_SCHEDULE:
        vax_key = f"{vax['vaccine']}_{vax['dose']}"
        if vax_key in completed:
            continue
        if vax["age_weeks"] < age_weeks - 2:
            overdue.append(vax)
        elif vax["age_weeks"] <= age_weeks + 2:
            due_now.append(vax)
        elif vax["age_weeks"] <= age_weeks + 12:
            upcoming.append(vax)

    return {
        "baby_age_weeks": age_weeks, "overdue": overdue, "due_now": due_now,
        "upcoming_3_months": upcoming, "completed_count": len(completed),
        "source": "WHO & IAP 2024 Schedule"
    }


def mark_vaccine_completed(baby_name: str, vaccine_name: str, dose: str, date_given: str = None, doctor_name: str = None) -> dict:
    """Mark a vaccine as completed.

    Args:
        baby_name: Name of the baby
        vaccine_name: Vaccine name (e.g., BCG, OPV-1)
        dose: Dose (e.g., Birth Dose, 1st Dose)
        date_given: Date in YYYY-MM-DD (defaults to today)
        doctor_name: Doctor who administered

    Returns:
        dict: Confirmation
    """
    baby_id = baby_name.lower().replace(" ", "_")
    vax_key = f"{vaccine_name}_{dose}"
    record = {"vaccine": vaccine_name, "dose": dose,
              "date_given": date_given or datetime.now().strftime("%Y-%m-%d"),
              "doctor": doctor_name, "recorded_at": datetime.now().isoformat()}
    store.add_vaccination(baby_id, vax_key, record)
    return {"status": "success", "message": f"{vaccine_name} ({dose}) completed for {baby_name}", "record": record}
