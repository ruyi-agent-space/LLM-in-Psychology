import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('check_pages', Path(__file__).resolve().parents[1] / 'scripts/check_pages.py')
guard = importlib.util.module_from_spec(spec)
spec.loader.exec_module(guard)


class PublicPagesTests(unittest.TestCase):
    def repository(self):
        return {'full_name':guard.EXPECTED_REPOSITORY, 'private':False, 'visibility':'public'}

    def pages(self):
        return {'public':True, 'build_type':'workflow', 'html_url':guard.EXPECTED_URL}

    def test_verified_public_configuration(self):
        self.assertEqual(guard.validate(self.repository(), self.pages()), guard.EXPECTED_URL)

    def test_private_or_unknown_repository_is_not_published(self):
        for value in (True, None, 'false', 0):
            with self.subTest(value=value):
                self.assertRaises(ValueError, guard.validate, dict(self.repository(), private=value), self.pages())
        self.assertRaises(ValueError, guard.validate, dict(self.repository(), full_name='elsewhere/copy'), self.pages())

    def test_site_public_visibility_must_be_explicit(self):
        for value in (False, None, 'true', 1):
            with self.subTest(value=value):
                self.assertRaises(ValueError, guard.validate, self.repository(), dict(self.pages(), public=value))

    def test_wrong_source_or_url_stops_with_no_setting_mutation(self):
        for site in ({}, dict(self.pages(), build_type='legacy'), dict(self.pages(), html_url='http://example.org'), dict(self.pages(), html_url='https://user:pass@example.org'), dict(self.pages(), html_url='https://elsewhere.github.io/')):
            self.assertRaises(ValueError, guard.validate, self.repository(), site)
