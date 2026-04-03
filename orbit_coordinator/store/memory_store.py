from datetime import datetime


class BabyOrbitStore:
    """In-memory store. Swap with FirestoreStore for production."""

    def __init__(self):
        self._babies = {}
        self._vaccinations = {}
        self._health_logs = {}
        self._appointments = {}

    def save_baby(self, baby_id, profile):
        self._babies[baby_id] = profile

    def get_baby(self, baby_id):
        return self._babies.get(baby_id)

    def add_vaccination(self, baby_id, vax_key, record):
        if baby_id not in self._vaccinations:
            self._vaccinations[baby_id] = {}
        self._vaccinations[baby_id][vax_key] = record

    def get_vaccinations(self, baby_id):
        return self._vaccinations.get(baby_id, {})

    def add_health_log(self, baby_id, entry):
        if baby_id not in self._health_logs:
            self._health_logs[baby_id] = []
        self._health_logs[baby_id].append(entry)

    def get_health_logs(self, baby_id, category=None, last_n=10):
        logs = self._health_logs.get(baby_id, [])
        if category:
            logs = [l for l in logs if l["category"].lower() == category.lower()]
        return logs[-last_n:]

    def add_appointment(self, baby_id, appointment):
        if baby_id not in self._appointments:
            self._appointments[baby_id] = []
        self._appointments[baby_id].append(appointment)

    def get_appointments(self, baby_id):
        return self._appointments.get(baby_id, [])


store = BabyOrbitStore()
