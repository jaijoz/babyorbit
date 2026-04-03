from ..data.seed_data import HOSPITAL_BAG_CHECKLIST


def get_hospital_bag_checklist(person: str = None) -> dict:
    """Get hospital bag packing checklist.

    Args:
        person: Filter - mother, baby, partner, or all (default: all)

    Returns:
        dict: Hospital bag checklist
    """
    if person and person.lower() in HOSPITAL_BAG_CHECKLIST:
        return {"for": person, "items": HOSPITAL_BAG_CHECKLIST[person.lower()]}
    return {"checklist": HOSPITAL_BAG_CHECKLIST, "source": "Evidence-based hospital bag guide"}
