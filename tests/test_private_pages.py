import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('check_private_pages', Path(__file__).resolve().parents[1] / 'scripts/check_private_pages.py')
guard = importlib.util.module_from_spec(spec)
spec.loader.exec_module(guard)


class PrivatePagesTests(unittest.TestCase):
    def repository(self):
        return {'full_name': guard.EXPECTED_REPOSITORY, 'private': True}

    def pages(self):
        return {'public': False, 'build_type': 'workflow', 'html_url': 'https://example-private.pages.github.io/'}

    def test_verified_private_configuration(self):
        self.assertEqual(guard.validate(self.repository(), self.pages()), self.pages()['html_url'])

    def test_private_repository_does_not_make_public_pages_safe(self):
        for value in (True, None, 'false', 0):
            with self.subTest(value=value):
                self.assertRaises(ValueError, guard.validate, self.repository(), dict(self.pages(), public=value))

    def test_repository_must_stay_original_and_private(self):
        for repository in (dict(self.repository(), private=False), dict(self.repository(), full_name='elsewhere/copy')):
            self.assertRaises(ValueError, guard.validate, repository, self.pages())

    def test_unconfigured_or_insecure_site_stops(self):
        for site in ({}, dict(self.pages(), build_type='legacy'), dict(self.pages(), html_url='http://example.org'), dict(self.pages(), html_url='https://user:pass@example.org')):
            self.assertRaises(ValueError, guard.validate, self.repository(), site)
