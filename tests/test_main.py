import unittest
from app.main import get_hackathon_wins

class TestMain(unittest.TestCase):
    def test_get_hackathon_wins(self):
        self.assertEqual(get_hackathon_wins(), 6)

if __name__ == '__main__':
    unittest.main()
