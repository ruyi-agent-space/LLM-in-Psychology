#!/usr/bin/env python3
"""Validate preconfigured private Pages; never enable or change Pages."""
import argparse
import json
from pathlib import Path
from urllib.parse import urlparse

EXPECTED_REPOSITORY = 'ruyi-agent-space/LLM-in-Psychology'


def validate(repository, pages):
    if repository.get('full_name') != EXPECTED_REPOSITORY or repository.get('private') is not True:
        raise ValueError('Expected the original private Psychology repository.')
    if pages.get('public') is not False:
        raise ValueError('Pages privacy is not explicitly verified as private; deployment stopped.')
    if pages.get('build_type') != 'workflow':
        raise ValueError('Pages must already use GitHub Actions; this check does not enable it.')
    url = pages.get('html_url', '')
    parsed = urlparse(url)
    if parsed.scheme != 'https' or not parsed.hostname or parsed.username or parsed.password:
        raise ValueError('Pages did not return a valid HTTPS site URL.')
    return url


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('repository', type=Path)
    parser.add_argument('pages', type=Path)
    args = parser.parse_args()
    try:
        url = validate(json.loads(args.repository.read_text()), json.loads(args.pages.read_text()))
    except (ValueError, TypeError, AttributeError) as error:
        parser.exit(1, str(error) + '\n')
    print('Verified existing private Pages: ' + url)


if __name__ == '__main__':
    main()
