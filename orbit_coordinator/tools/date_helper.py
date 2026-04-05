from datetime import datetime, timedelta
import re


def parse_natural_date(date_text: str) -> dict:
    """Convert natural language date to YYYY-MM-DD. Handles: 'last month 15th', '2 months ago', 'March 15', 'this year march 15', etc.

    Args:
        date_text: Natural language date like 'last month 15th', 'march 15', or 'march 15 this year'

    Returns:
        dict: Parsed date in YYYY-MM-DD format with readable version and today's date for reference
    """
    today = datetime.now()
    text = date_text.lower().strip()
    text = re.sub(r'(\d+)(st|nd|rd|th)', r'\1', text)
    text = text.replace("this year", str(today.year)).replace("last year", str(today.year - 1))

    try:
        base = {"today": today.strftime("%Y-%m-%d"), "current_year": today.year}

        if re.match(r'\d{4}-\d{2}-\d{2}', text):
            parsed = datetime.strptime(text[:10], "%Y-%m-%d")
            return {**base, "status": "success", "date": parsed.strftime("%Y-%m-%d"), "readable": parsed.strftime("%B %d, %Y")}

        match = re.search(r'last\s+month\s+(\d{1,2})', text)
        if match:
            day, m, y = int(match.group(1)), today.month - 1, today.year
            if m < 1: m, y = 12, y - 1
            return {**base, "status": "success", "date": f"{y}-{m:02d}-{day:02d}", "readable": datetime(y, m, day).strftime("%B %d, %Y")}

        match = re.search(r'(\d+)\s+months?\s+ago', text)
        if match:
            months_ago = int(match.group(1))
            m, y = today.month - months_ago, today.year
            while m < 1: m, y = m + 12, y - 1
            day = min(today.day, 28)
            return {**base, "status": "success", "date": f"{y}-{m:02d}-{day:02d}", "readable": datetime(y, m, day).strftime("%B %d, %Y")}

        match = re.search(r'(\d+)\s+weeks?\s+ago', text)
        if match:
            parsed = today - timedelta(weeks=int(match.group(1)))
            return {**base, "status": "success", "date": parsed.strftime("%Y-%m-%d"), "readable": parsed.strftime("%B %d, %Y")}

        months_map = {"january": 1, "february": 2, "march": 3, "april": 4, "may": 5, "june": 6,
                      "july": 7, "august": 8, "september": 9, "october": 10, "november": 11, "december": 12,
                      "jan": 1, "feb": 2, "mar": 3, "apr": 4, "jun": 6, "jul": 7, "aug": 8, "sep": 9, "oct": 10, "nov": 11, "dec": 12}
        for mname, mnum in months_map.items():
            match = re.search(rf'{mname}\s+(\d{{1,2}})(?:\s+(\d{{4}}))?', text) or re.search(rf'(\d{{1,2}})\s*{mname}(?:\s+(\d{{4}}))?', text)
            if match:
                day, year = int(match.group(1)), int(match.group(2)) if match.group(2) else today.year
                parsed = datetime(year, mnum, day)
                if parsed > today: parsed = datetime(year - 1, mnum, day)
                return {**base, "status": "success", "date": parsed.strftime("%Y-%m-%d"), "readable": parsed.strftime("%B %d, %Y")}

        if "yesterday" in text:
            parsed = today - timedelta(days=1)
            return {**base, "status": "success", "date": parsed.strftime("%Y-%m-%d"), "readable": parsed.strftime("%B %d, %Y")}

        return {**base, "status": "needs_clarification", "message": f"Could not parse '{date_text}'. Please say something like 'March 15, 2026' or 'last month 15th'."}
    except Exception as e:
        return {"today": today.strftime("%Y-%m-%d"), "status": "error", "message": str(e)}
