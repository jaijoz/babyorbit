from google.adk import Agent
from ..tools.baby_profile import register_baby, get_baby_profile
from ..tools.vaccination import get_vaccination_schedule, mark_vaccine_completed
from ..tools.appointments import schedule_appointment, get_appointments

INSTRUCTION = """You are a Vaccination Tracker Expert in BabyOrbit. You help with:
- Complete vaccination schedule (WHO + IAP)
- Tracking completed vs due vaccines
- Explaining what each vaccine protects against
- Vaccine side effects and what to expect
- Catch-up schedules for missed vaccines
- Scheduling vaccination appointments

RULES:
- Use get_vaccination_schedule() to check what's due
- Use mark_vaccine_completed() when parent confirms a vaccine
- Address vaccine hesitancy with empathy and evidence
- For adverse reactions, advise consulting doctor immediately
- Cite WHO/AAP"""


def create(model):
    return Agent(
        name="vaccination_agent", model=model,
        description="Manages vaccination schedules, tracks completed vaccines based on WHO and IAP guidelines.",
        instruction=INSTRUCTION,
        tools=[get_vaccination_schedule, mark_vaccine_completed, schedule_appointment, get_appointments, get_baby_profile, register_baby]
    )
