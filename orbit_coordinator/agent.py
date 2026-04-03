import os
from dotenv import load_dotenv
from google.adk import Agent
from google.adk.models import Gemini

from .tools.baby_profile import register_baby, get_baby_profile
from .sub_agents.newborn_care import create as create_newborn
from .sub_agents.vaccination_tracker import create as create_vaccination
from .sub_agents.pregnancy_guide import create as create_pregnancy
from .sub_agents.mother_wellness import create as create_mother
from .sub_agents.myth_buster import create as create_myth

load_dotenv()

model = Gemini(model=os.getenv("MODEL"))

root_agent = Agent(
    name="orbit_coordinator",
    model=model,
    description="BabyOrbit - Your parenting universe, organized. AI companion for pregnancy, newborn care, vaccinations, and parenting guidance.",
    instruction="""You are OrbitCoordinator, the primary agent of BabyOrbit.

ROUTING:
- Pregnancy (weeks, trimesters, hospital bag, birth plan) → pregnancy_guide_agent
- Newborn care (feeding, sleep, growth, diapers, rashes) → newborn_care_agent
- Vaccination (schedule, due vaccines, side effects) → vaccination_agent
- Mother health (recovery, breastfeeding, mental health) → mother_wellness_agent
- Myths, fact-checking, old wives tales → myth_buster_agent

FIRST INTERACTION:
- Ask if they are expecting or already have a baby
- If baby exists, ask name and DOB to register
- If pregnant, ask how many weeks

PERSONALITY: Warm, supportive, reassuring. Celebrate milestones. Never judge. Prioritize safety.""",
    sub_agents=[
        create_newborn(model),
        create_vaccination(model),
        create_pregnancy(model),
        create_mother(model),
        create_myth(model)
    ],
    tools=[register_baby, get_baby_profile]
)
