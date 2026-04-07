import logging
import os

logger = logging.getLogger(__name__)

BABY_TOPICS_KEYWORDS = {
    "baby", "infant", "newborn", "toddler", "child", "children",
    "pregnancy", "pregnant", "breastfeeding", "formula", "vaccination",
    "vaccine", "immunization", "milestone", "sleep", "feeding", "diaper",
    "birth", "prenatal", "postnatal", "postpartum", "mother", "maternal",
    "pediatric", "teething", "colic", "reflux", "growth", "development",
    "hospital", "delivery", "trimester", "weaning", "solid", "cradle",
    "swaddle", "pacifier", "crib", "nursery", "latch", "colostrum",
    "jaundice", "rash", "fever", "umbilical", "cord", "potty", "crawl",
    "walking", "babbling", "words", "preschool", "playdate", "neonatal",
    "obstetric", "gynecology", "midwife", "doula", "epidural", "caesarean",
    "c-section", "contractions", "amniotic", "placenta", "ultrasound",
    "trimester", "kick", "breast", "nipple", "pump", "lactation",
    "baby food", "puree", "finger food", "allergy", "eczema", "diarrhoea",
    "constipation", "vomiting", "immunise", "booster", "dtap", "mmr",
    "measles", "polio", "hepatitis", "rotavirus"
}


def _is_baby_related(query: str) -> bool:
    """Return True if the query contains any baby/parenting-related keyword."""
    q = query.lower()
    return any(kw in q for kw in BABY_TOPICS_KEYWORDS)


def groq_answer(query: str) -> dict:
    """
    Answer a query using the Groq LLM. This tool is called in two situations:

    1. OFF-TOPIC QUERY: The user asks something unrelated to baby care, pregnancy,
       vaccinations, or parenting.  Groq responds politely, provides a brief answer
       if appropriate, then redirects the user to BabyOrbit's core topics.

    2. GEMINI FALLBACK: The primary Gemini/Vertex AI service is unavailable or
       returns a rate-limit error (HTTP 429).  Groq steps in as a backup LLM so
       the user still gets a helpful response.

    Returns a dict with keys:
        status          – "success" or "error"
        provider        – "groq"
        is_baby_related – bool
        answer          – the LLM-generated text  (on success)
        message         – error description        (on error)
    """
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        logger.error("[Groq] GROQ_API_KEY is not set — cannot call Groq API.")
        return {
            "status": "error",
            "provider": "groq",
            "message": "GROQ_API_KEY is not set. Add it to your .env / Cloud Run env vars."
        }

    try:
        from groq import Groq  # lazy import so the package is optional at module load

        client = Groq(api_key=api_key)
        is_baby = _is_baby_related(query)

        trigger_reason = "baby_fallback" if is_baby else "off_topic"
        logger.info(
            "[Groq] Calling Groq API | reason=%s | model=llama-3.3-70b-versatile | query=%r",
            trigger_reason,
            query[:120],
        )

        if is_baby:
            system_prompt = (
                "You are a compassionate AI assistant inside BabyOrbit, a parenting app "
                "covering pregnancy, newborn care, vaccinations, and parenting guidance. "
                "Give evidence-based, warm, and reassuring answers. "
                "Cite WHO, AAP, CDC, or IAP guidelines where relevant. "
                "Always recommend consulting a healthcare professional for medical concerns."
            )
        else:
            system_prompt = (
                "You are a helpful AI assistant inside BabyOrbit, a parenting app "
                "specialising in pregnancy, newborn care, vaccinations, and parenting. "
                "The user has asked something outside BabyOrbit's core scope. "
                "Politely note that BabyOrbit focuses on baby and parenting topics. "
                "If their question is harmless and you can answer it briefly, do so. "
                "Then invite them to ask about pregnancy, baby care, vaccinations, or parenting."
            )

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": query},
            ],
            max_tokens=800,
            temperature=0.7,
        )

        raw_answer = response.choices[0].message.content or ""

        # Append a visible source label so the user (and you during testing)
        # can confirm this response came from Groq.
        if is_baby:
            footer = "\n\n---\n*🤖 Answered via Groq (Gemini fallback)*"
        else:
            footer = "\n\n---\n*🤖 Answered via Groq · This topic is outside BabyOrbit's core scope*"

        answer = raw_answer + footer

        logger.info(
            "[Groq] Response received | reason=%s | chars=%d",
            trigger_reason,
            len(raw_answer),
        )

        return {
            "status": "success",
            "provider": "groq",
            "model": "llama-3.3-70b-versatile",
            "is_baby_related": is_baby,
            "answer": answer,
        }

    except Exception as exc:
        logger.error("[Groq] API call failed: %s", exc)
        return {
            "status": "error",
            "provider": "groq",
            "message": f"Groq API error: {exc}",
        }
