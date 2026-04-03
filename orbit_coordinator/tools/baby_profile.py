from datetime import datetime
from ..store.memory_store import store


def register_baby(baby_name: str, date_of_birth: str, gender: str = None, birth_weight_kg: float = None) -> dict:
    """Register a new baby profile. Date of birth in YYYY-MM-DD format.

    Args:
        baby_name: Name of the baby
        date_of_birth: Date of birth in YYYY-MM-DD format
        gender: Gender of the baby (male/female)
        birth_weight_kg: Birth weight in kilograms

    Returns:
        dict: Registered baby profile with age calculation
    """
    baby_id = baby_name.lower().replace(" ", "_")
    dob = datetime.strptime(date_of_birth, "%Y-%m-%d")
    age_days = (datetime.now() - dob).days

    profile = {
        "baby_id": baby_id, "name": baby_name, "date_of_birth": date_of_birth,
        "gender": gender, "birth_weight_kg": birth_weight_kg,
        "age_days": age_days, "age_weeks": age_days // 7, "age_months": age_days // 30,
        "registered_at": datetime.now().isoformat()
    }
    store.save_baby(baby_id, profile)
    return {"status": "success", "message": f"Baby {baby_name} registered!", "profile": profile}


def get_baby_profile(baby_name: str) -> dict:
    """Get a registered baby's profile with current age.

    Args:
        baby_name: Name of the baby

    Returns:
        dict: Baby profile with updated age
    """
    baby_id = baby_name.lower().replace(" ", "_")
    profile = store.get_baby(baby_id)
    if not profile:
        return {"status": "not_found", "message": f"No profile found for {baby_name}. Please register first."}
    dob = datetime.strptime(profile["date_of_birth"], "%Y-%m-%d")
    age_days = (datetime.now() - dob).days
    profile.update({"age_days": age_days, "age_weeks": age_days // 7, "age_months": age_days // 30})
    return {"status": "found", "profile": profile}
