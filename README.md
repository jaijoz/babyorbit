# BabyOrbit - Your Parenting Universe, Organized

AI-powered multi-agent parenting companion built with **Google ADK** and **Gemini AI**.
From bump to baby - evidence-based guidance at your fingertips.

## Live Demo
- **Frontend**: https://babyorbit-web-1091443480665.us-east4.run.app
- **Backend API**: https://babyorbit-api-1091443480665.us-east4.run.app
- **Demo Video**: https://drive.google.com/file/d/1kgcR64SRnqOxS_FynuEx0rwWYghI-fp2/view?usp=drivesdk

## What It Does
BabyOrbit uses 5 specialized AI agents orchestrated by a coordinator:

| Agent | Responsibility |
|-------|---------------|
| **OrbitCoordinator** | Routes requests to the right specialist agent |
| **Newborn Care** | Feeding, sleep, growth, rashes, milestones (0-24 months) |
| **Vaccination Tracker** | WHO & IAP schedule, tracking, side effects |
| **Pregnancy Guide** | Week-by-week updates, hospital bag, birth planning |
| **Mother Wellness** | Postpartum recovery, breastfeeding, mental health |
| **Myth Buster** | Debunks parenting myths with WHO/AAP/CDC evidence |

## Architecture

~~~
User -> React Frontend -> nginx -> ADK Backend (Cloud Run)
                                        |
                              OrbitCoordinator (root)
                             /    |    |    |    \
                       Newborn  Vaccine  Pregnancy  Mother  Myth
                        Care    Tracker   Guide    Wellness Buster
~~~

## Tech Stack
- **Backend**: Python, Google Agent Development Kit (ADK), Gemini 2.5 Flash
- **Frontend**: React, Vite, TailwindCSS, Lucide Icons
- **Deployment**: Google Cloud Run (serverless)
- **AI Model**: Google Gemini via Vertex AI
- **Data Sources**: WHO, IAP 2024, CDC Act Early, AAP

## Project Structure

~~~
babyorbit/
+-- orbit_coordinator/           # ADK Multi-Agent Backend
|   +-- agent.py                 # Root coordinator agent
|   +-- sub_agents/              # 5 specialist agents
|   +-- tools/                   # Modular tool functions
|   +-- store/                   # Data store abstraction
|   +-- data/                    # Seed data (WHO/IAP/CDC)
+-- frontend/                    # React + TailwindCSS
|   +-- src/pages/               # Landing + Chat pages
|   +-- src/services/            # API integration
+-- README.md
~~~

## Run Locally

### Backend
~~~bash
cd babyorbit
pip install google-adk python-dotenv
adk web --port 8080
~~~

### Frontend
~~~bash
cd babyorbit/frontend
npm install
npm run dev
~~~

## Environment Variables
Create orbit_coordinator/.env:
~~~
GOOGLE_GENAI_USE_VERTEXAI=TRUE
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_CLOUD_LOCATION=us-east4
MODEL=gemini-2.5-flash
~~~

## Key Features
- **Multi-Agent Routing**: Intelligent request routing to specialist agents
- **Evidence-Based**: All guidance cites WHO, AAP, CDC, IAP sources
- **Vaccination Tracking**: Complete schedule with overdue/due/upcoming tracking
- **Cultural Sensitivity**: Respects cultural practices while ensuring medical safety
- **Myth Busting**: Real-time fact-checking using Google Search Grounding
- **Health Logging**: Track feeding, sleep, diapers, symptoms
- **Appointment Scheduling**: Book and manage medical appointments

## Author
**Jaimol Jose** - [GitHub](https://github.com/jaijoz)

## License
Copyright 2026 Jaimol Jose. All rights reserved.
