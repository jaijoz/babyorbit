from datetime import datetime
from ..store.memory_store import store


def schedule_appointment(baby_name: str, appointment_type: str, doctor_name: str, date_time: str, location: str = None, notes: str = None) -> dict:
    """Schedule a medical appointment.

    Args:
        baby_name: Name of the baby or mother
        appointment_type: Type - vaccination, checkup, pediatrician, obgyn
        doctor_name: Doctor's name
        date_time: Date and time YYYY-MM-DD HH:MM
        location: Hospital/clinic
        notes: Additional notes

    Returns:
        dict: Appointment confirmation
    """
    baby_id = baby_name.lower().replace(" ", "_")
    appt = {"type": appointment_type, "doctor": doctor_name, "date_time": date_time,
            "location": location, "notes": notes, "status": "scheduled",
            "created_at": datetime.now().isoformat()}
    store.add_appointment(baby_id, appt)
    return {"status": "success", "message": f"Appointment with Dr. {doctor_name} on {date_time}", "appointment": appt}


def get_appointments(baby_name: str) -> dict:
    """Get all appointments for a baby/mother.

    Args:
        baby_name: Name of the baby or mother

    Returns:
        dict: List of appointments
    """
    baby_id = baby_name.lower().replace(" ", "_")
    appts = store.get_appointments(baby_id)
    return {"baby": baby_name, "total": len(appts), "appointments": appts}
