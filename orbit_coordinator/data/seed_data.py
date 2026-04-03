VACCINATION_SCHEDULE = [
    {"vaccine": "BCG", "dose": "Birth Dose", "age_weeks": 0, "description": "Protection against tuberculosis", "source": "WHO, IAP"},
    {"vaccine": "OPV-0", "dose": "Birth Dose", "age_weeks": 0, "description": "Oral Polio Vaccine - zero dose", "source": "WHO, IAP"},
    {"vaccine": "Hepatitis B", "dose": "Birth Dose", "age_weeks": 0, "description": "Protection against Hepatitis B", "source": "WHO, IAP"},
    {"vaccine": "OPV-1", "dose": "1st Dose", "age_weeks": 6, "description": "Oral Polio Vaccine", "source": "WHO, IAP"},
    {"vaccine": "Pentavalent-1", "dose": "1st Dose", "age_weeks": 6, "description": "DPT + Hep B + Hib combined", "source": "WHO, IAP"},
    {"vaccine": "Rotavirus-1", "dose": "1st Dose", "age_weeks": 6, "description": "Protection against rotavirus diarrhea", "source": "WHO, IAP"},
    {"vaccine": "PCV-1", "dose": "1st Dose", "age_weeks": 6, "description": "Pneumococcal Conjugate Vaccine", "source": "WHO, IAP"},
    {"vaccine": "IPV-1", "dose": "1st Dose", "age_weeks": 6, "description": "Injectable Polio Vaccine", "source": "WHO, CDC"},
    {"vaccine": "OPV-2", "dose": "2nd Dose", "age_weeks": 10, "description": "Oral Polio Vaccine", "source": "WHO, IAP"},
    {"vaccine": "Pentavalent-2", "dose": "2nd Dose", "age_weeks": 10, "description": "DPT + Hep B + Hib combined", "source": "WHO, IAP"},
    {"vaccine": "Rotavirus-2", "dose": "2nd Dose", "age_weeks": 10, "description": "Protection against rotavirus diarrhea", "source": "WHO, IAP"},
    {"vaccine": "OPV-3", "dose": "3rd Dose", "age_weeks": 14, "description": "Oral Polio Vaccine", "source": "WHO, IAP"},
    {"vaccine": "Pentavalent-3", "dose": "3rd Dose", "age_weeks": 14, "description": "DPT + Hep B + Hib combined", "source": "WHO, IAP"},
    {"vaccine": "Rotavirus-3", "dose": "3rd Dose", "age_weeks": 14, "description": "Protection against rotavirus diarrhea", "source": "WHO, IAP"},
    {"vaccine": "IPV-2", "dose": "2nd Dose", "age_weeks": 14, "description": "Injectable Polio Vaccine", "source": "WHO, CDC"},
    {"vaccine": "PCV Booster", "dose": "Booster", "age_weeks": 36, "description": "Pneumococcal booster", "source": "WHO, IAP"},
    {"vaccine": "Measles-1", "dose": "1st Dose", "age_weeks": 36, "description": "Measles vaccine first dose", "source": "WHO, IAP"},
    {"vaccine": "MMR-1", "dose": "1st Dose", "age_weeks": 48, "description": "Measles, Mumps, Rubella", "source": "WHO, CDC, IAP"},
    {"vaccine": "Varicella-1", "dose": "1st Dose", "age_weeks": 48, "description": "Chickenpox vaccine", "source": "CDC, IAP"},
    {"vaccine": "Hepatitis A-1", "dose": "1st Dose", "age_weeks": 48, "description": "Hepatitis A vaccine", "source": "WHO, CDC, IAP"},
    {"vaccine": "DPT Booster-1", "dose": "Booster 1", "age_weeks": 72, "description": "DPT first booster", "source": "WHO, IAP"},
    {"vaccine": "OPV Booster", "dose": "Booster", "age_weeks": 72, "description": "Oral Polio booster", "source": "WHO, IAP"},
    {"vaccine": "Typhoid", "dose": "1st Dose", "age_weeks": 96, "description": "Typhoid conjugate vaccine", "source": "WHO, IAP"},
    {"vaccine": "MMR-2", "dose": "2nd Dose", "age_weeks": 240, "description": "Measles, Mumps, Rubella booster", "source": "WHO, CDC, IAP"},
    {"vaccine": "DPT Booster-2", "dose": "Booster 2", "age_weeks": 240, "description": "DPT second booster", "source": "WHO, IAP"}
]

MILESTONES = [
    {"age_months": 1, "category": "Physical", "milestone": "Lifts head briefly during tummy time", "concern_if_not_by": 2, "source": "CDC Act Early"},
    {"age_months": 1, "category": "Social", "milestone": "Focuses on faces", "concern_if_not_by": 2, "source": "CDC Act Early"},
    {"age_months": 2, "category": "Social", "milestone": "First social smile", "concern_if_not_by": 3, "source": "CDC Act Early"},
    {"age_months": 2, "category": "Communication", "milestone": "Coos and makes gurgling sounds", "concern_if_not_by": 4, "source": "CDC Act Early"},
    {"age_months": 3, "category": "Physical", "milestone": "Holds head steady unsupported", "concern_if_not_by": 4, "source": "CDC Act Early"},
    {"age_months": 4, "category": "Physical", "milestone": "Pushes up on elbows during tummy time", "concern_if_not_by": 5, "source": "CDC Act Early"},
    {"age_months": 4, "category": "Physical", "milestone": "Grasps and shakes toys", "concern_if_not_by": 6, "source": "CDC Act Early"},
    {"age_months": 5, "category": "Physical", "milestone": "Rolls from tummy to back", "concern_if_not_by": 6, "source": "CDC Act Early"},
    {"age_months": 6, "category": "Physical", "milestone": "Sits with support, begins solid foods", "concern_if_not_by": 8, "source": "WHO, CDC"},
    {"age_months": 6, "category": "Communication", "milestone": "Babbles consonant sounds (ba, ma, da)", "concern_if_not_by": 9, "source": "CDC Act Early"},
    {"age_months": 7, "category": "Physical", "milestone": "Sits without support", "concern_if_not_by": 9, "source": "WHO Motor Development Study"},
    {"age_months": 8, "category": "Physical", "milestone": "Crawls or moves forward on belly", "concern_if_not_by": 10, "source": "CDC Act Early"},
    {"age_months": 9, "category": "Social", "milestone": "Stranger anxiety develops", "concern_if_not_by": 12, "source": "AAP"},
    {"age_months": 9, "category": "Physical", "milestone": "Pulls to standing position", "concern_if_not_by": 12, "source": "WHO Motor Development Study"},
    {"age_months": 10, "category": "Physical", "milestone": "Pincer grasp develops", "concern_if_not_by": 12, "source": "CDC Act Early"},
    {"age_months": 12, "category": "Physical", "milestone": "Takes first independent steps", "concern_if_not_by": 15, "source": "WHO Motor Development Study"},
    {"age_months": 12, "category": "Communication", "milestone": "Says first meaningful words", "concern_if_not_by": 15, "source": "CDC Act Early"},
    {"age_months": 18, "category": "Physical", "milestone": "Walks well, begins to run", "concern_if_not_by": 20, "source": "CDC Act Early"},
    {"age_months": 18, "category": "Communication", "milestone": "Says 10-20 words", "concern_if_not_by": 24, "source": "AAP"},
    {"age_months": 24, "category": "Communication", "milestone": "Combines two words", "concern_if_not_by": 30, "source": "CDC Act Early"},
    {"age_months": 24, "category": "Physical", "milestone": "Kicks a ball, walks up stairs with help", "concern_if_not_by": 30, "source": "CDC Act Early"}
]

HOSPITAL_BAG_CHECKLIST = {
    "mother": [
        "Hospital/insurance documents and ID",
        "Birth plan copies (3-4)",
        "Comfortable nightgowns or nursing gowns (2-3)",
        "Nursing bras (2-3) and breast pads",
        "Comfortable underwear and maternity pads",
        "Toiletries (toothbrush, face wash, lip balm, hair ties)",
        "Slippers and warm socks",
        "Phone charger and earphones",
        "Snacks and water bottle",
        "Going home outfit (maternity size)",
        "Pillow from home for comfort"
    ],
    "baby": [
        "Newborn onesies/bodysuits (3-4)",
        "Swaddle blankets (2-3)",
        "Baby cap and mittens",
        "Newborn diapers (small pack)",
        "Baby wipes (sensitive/unscented)",
        "Going home outfit",
        "Car seat (mandatory for car travel)",
        "Receiving blanket",
        "Burp cloths (2-3)"
    ],
    "partner": [
        "Change of clothes",
        "Toiletries",
        "Snacks and water",
        "Phone charger",
        "Camera",
        "List of people to notify"
    ]
}
