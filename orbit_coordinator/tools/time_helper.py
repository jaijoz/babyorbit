from datetime import datetime

def get_current_datetime():
    now = datetime.now()
    return {
        "iso": now.isoformat(),
        "date": now.strftime("%Y-%m-%d"),
        "time": now.strftime("%H:%M:%S"),
        "readable": now.strftime("%B %d, %Y %I:%M %p")
    }
