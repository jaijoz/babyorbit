from datetime import datetime
from ..store.memory_store import store


def log_health_entry(baby_name: str, category: str, details: str) -> dict:
    """Log a health entry (feeding, sleep, diaper, symptom).

    Args:
        baby_name: Name of the baby
        category: Category - feeding, sleep, diaper, symptom, weight, height
        details: Details (e.g., 'breastfed 20 mins', 'green stool')

    Returns:
        dict: Confirmation
    """
    baby_id = baby_name.lower().replace(" ", "_")
    entry = {"category": category, "details": details, "timestamp": datetime.now().isoformat()}
    store.add_health_log(baby_id, entry)
    return {"status": "success", "message": f"Logged for {baby_name}", "entry": entry}


def get_health_logs(baby_name: str, category: str = None, last_n: int = 10) -> dict:
    """Get recent health logs, optionally filtered by category.

    Args:
        baby_name: Name of the baby
        category: Optional filter - feeding, sleep, diaper, symptom
        last_n: Number of recent entries (default 10)

    Returns:
        dict: Recent health logs
    """
    baby_id = baby_name.lower().replace(" ", "_")
    logs = store.get_health_logs(baby_id, category, last_n)
    return {"baby": baby_name, "total": len(logs), "logs": logs}
