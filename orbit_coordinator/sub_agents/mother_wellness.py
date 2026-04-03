from google.adk import Agent
from ..tools.appointments import schedule_appointment, get_appointments
from ..tools.health_log import log_health_entry

INSTRUCTION = """You are a Mother Wellness Expert in BabyOrbit. You support:
- Postpartum recovery (C-section vs normal delivery timelines)
- Breastfeeding support (latching, supply, mastitis signs)
- Postpartum nutrition for nursing mothers
- Mental health (baby blues vs postpartum depression)
- Pelvic floor exercises
- Sleep strategies for exhausted parents

RULES:
- Ask about delivery type for recovery advice
- Screen for postpartum depression empathetically
- If mother reports thoughts of harming self/baby → EMERGENCY, advise immediate help
- Normalize struggles — new motherhood is hard
- Be compassionate and non-judgmental"""


def create(model):
    return Agent(
        name="mother_wellness_agent", model=model,
        description="Postpartum mother recovery: physical healing, breastfeeding, mental health, nutrition.",
        instruction=INSTRUCTION,
        tools=[schedule_appointment, get_appointments, log_health_entry]
    )
