#!/usr/bin/env python3
"""Verify the original public repository and preconfigured public Actions Pages."""
import argparse
import json
from pathlib import Path
from urllib.parse import urlparse

EXPECTED_REPOSITORY = 'ruyi-agent-space/LLM-in-Psychology'
EXPECTED_URL = 'https://ruyi-agent-space.github.io/LLM-in-Psychology/'


def validate(repository, pages):
    if repository.get('full_name') != EXPECTED_REPOSITORY or repository.get('private') is not False or repository.get('visibility') != 'public':
        raise ValueError('The original Psychology repository must still be explicitly public.')
    if pages.get('public') is not True:
        raise ValueError('Pages visitor visibility must be explicitly public for this authorized deployment.')
    if pages.get('build_type') != 'workflow':
        raise ValueError('Set repository Settings > Pages > Source to GitHub Actions; no setting was changed by this check.')
    url = pages.get('html_url', '')
    parsed = urlparse(url)
    if parsed.scheme != 'https' or parsed.username or parsed.password or url.rstrip('/') + '/' != EXPECTED_URL:
        raise ValueError('Pages returned an unexpected site URL; inspect settings before deployment.')
    return EXPECTED_URL


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('repository', type=Path)
    parser.add_argument('pages', type=Path)
    args = parser.parse_args()
    repository = json.loads(args.repository.read_text())
    pages = json.loads(args.pages.read_text())
    print(json.dumps({'repository':repository.get('full_name'), 'repositoryPrivate':repository.get('private'), 'pagesPublic':pages.get('public'), 'buildType':pages.get('build_type'), 'htmlUrl':pages.get('html_url')}))
    try:
        validate(repository, pages)
    except (ValueError, TypeError, AttributeError) as error:
        parser.exit(1, str(error) + '\n')


if __name__ == '__main__':
    main()
