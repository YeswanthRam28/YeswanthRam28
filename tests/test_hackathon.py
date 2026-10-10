import unittest
from models.hackathon import Hackathon

class TestHackathon(unittest.TestCase):
    def test_get_wins(self):
        hackathon = Hackathon()
        self.assertEqual(hackathon.get_wins(), 6)

if __name__ == '__main__':
    unittest.main()
