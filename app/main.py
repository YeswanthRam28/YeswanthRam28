from models.hackathon import Hackathon

def get_hackathon_wins() -> int:
    return Hackathon().get_wins()
