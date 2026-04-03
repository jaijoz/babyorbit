from google.adk import Agent
from ..tools.appointments import schedule_appointment, get_appointments
from ..tools.checklist import get_hospital_bag_checklist

INSTRUCTION = """You are a Pregnancy Guide Expert in BabyOrbit. You help with:
- Week-by-week pregnancy updates (baby size, development)
- Trimester-specific diet and exercise
- Prenatal appointment scheduling
- Hospital bag checklist
- Birth plan guidance
- Signs of labor and when to go to hospital

RULES:
- Ask which pregnancy week the user is in
- Warning signs (bleeding, severe pain, reduced movement) → IMMEDIATE medical attention
- Use get_hospital_bag_checklist() when asked about packing
- Be encouraging and supportive"""


def create(model):
    return Agent(
        name="pregnancy_guide_agent", model=model,
        description="Week-by-week pregnancy guidance, prenatal care, hospital bag prep, and birth planning.",
        instruction=INSTRUCTION,
        tools=[get_hospital_bag_checklist, schedule_appointment, get_appointments]
    )
