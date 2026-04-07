import json
from urllib.parse import quote
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError

from ..data.seed_data import VACCINATION_SCHEDULE, MILESTONES, HOSPITAL_BAG_CHECKLIST


def _search_local_seed(query: str) -> dict:
    q = (query or "").lower().strip()
    tokens = [t for t in q.split() if len(t) > 2]

    matches = []

    for v in VACCINATION_SCHEDULE:
        text = f"{v.get('vaccine','')} {v.get('dose','')} {v.get('description','')}".lower()
        if any(t in text for t in tokens):
            matches.append({
                "type": "vaccination",
                "title": f"{v.get('vaccine')} - {v.get('dose')}",
                "snippet": v.get("description", ""),
                "source": v.get("source", "seed_data")
            })

    for m in MILESTONES:
        text = f"{m.get('category','')} {m.get('milestone','')}".lower()
        if any(t in text for t in tokens):
            matches.append({
                "type": "milestone",
                "title": f"{m.get('age_months')} months - {m.get('category')}",
                "snippet": m.get("milestone", ""),
                "source": m.get("source", "seed_data")
            })

    for section, items in HOSPITAL_BAG_CHECKLIST.items():
        for item in items:
            txt = f"{section} {item}".lower()
            if any(t in txt for t in tokens):
                matches.append({
                    "type": "hospital_bag",
                    "title": section,
                    "snippet": item,
                    "source": "seed_data"
                })

    return {
        "status": "success" if matches else "not_found",
        "source_type": "local_fallback",
        "provider": "babyorbit_seed_data",
        "query": query,
        "results": matches[:8]
    }


def _wiki_search(query: str) -> dict | None:
    opensearch_url = (
        "https://en.wikipedia.org/w/api.php"
        f"?action=opensearch&search={quote(query)}&limit=1&namespace=0&format=json"
    )
    req = Request(opensearch_url, headers={"User-Agent": "BabyOrbit/1.0"})
    with urlopen(req, timeout=6) as resp:
        data = json.loads(resp.read().decode("utf-8"))

    titles = data[1] if isinstance(data, list) and len(data) > 1 else []
    if not titles:
        return None

    title = titles[0]
    summary_url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{quote(title)}"
    req2 = Request(summary_url, headers={"User-Agent": "BabyOrbit/1.0"})
    with urlopen(req2, timeout=6) as resp2:
        s = json.loads(resp2.read().decode("utf-8"))

    extract = s.get("extract", "")
    page = s.get("content_urls", {}).get("desktop", {}).get("page", "")
    if not extract:
        return None

    return {
        "status": "success",
        "source_type": "external",
        "provider": "wikipedia",
        "query": query,
        "results": [{
            "type": "article",
            "title": s.get("title", title),
            "snippet": extract,
            "source": page or "https://www.wikipedia.org"
        }]
    }


def search_parenting_knowledge(query: str) -> dict:
    """
    Search parenting info from free external source first (Wikipedia),
    then fallback to local BabyOrbit seed data if unavailable/not found.
    """
    if not query or not query.strip():
        return {"status": "error", "message": "query is required"}

    try:
        external = _wiki_search(query.strip())
        if external and external.get("results"):
            return external
    except (URLError, HTTPError, TimeoutError, Exception):
        pass

    return _search_local_seed(query.strip())
