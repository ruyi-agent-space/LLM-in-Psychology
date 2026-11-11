#!/usr/bin/env python3
"""Local HTTP browser checks only; no deployment or external-source access."""
import argparse
import functools
import json
import re
import sys
import tempfile
import threading
import time
from urllib.request import Request, urlopen
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import expect, sync_playwright

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / 'site'
PREFIX = '/LLM-in-Psychology/'


class PrefixHandler(SimpleHTTPRequestHandler):
    def serve_prefixed(self, method):
        if not urlsplit(self.path).path.startswith(PREFIX):
            self.send_error(404)
            return
        self.path = '/' + self.path[len(PREFIX):]
        method()

    def do_GET(self):
        self.serve_prefixed(super().do_GET)

    def do_HEAD(self):
        self.serve_prefixed(super().do_HEAD)

    def log_message(self, *_):
        pass


def no_overflow(page, label):
    result = page.evaluate("""async () => {
        await new Promise(requestAnimationFrame);
        await new Promise(requestAnimationFrame);
        return {viewport:innerWidth, document:document.documentElement.scrollWidth, body:document.body.scrollWidth};
    }""")
    assert max(result['document'], result['body']) <= result['viewport'] + 1, (label, result)


def assert_english_view(page, label, selector='body'):
    # Keep each language's own name in the language chooser.
    visible = page.locator(selector).inner_text()
    chooser = page.locator('.language-switch').inner_text()
    visible = visible.replace(chooser, '', 1)
    # Bibliographic titles retain the exact source text in either interface language.
    titles = page.evaluate("""() => [...window.RESEARCH_DATA.sources, ...(window.RADAR_DATA.daily || []), ...(window.RADAR_DATA.weekly || []).flatMap(row => row.papers || [])].map(row => row.title).filter(Boolean)""")
    for title in set(titles):
        visible = visible.replace(title, '')
    mixed = [line for line in visible.splitlines() if re.search(r'[\u4e00-\u9fff]', line)]
    assert not mixed, (label, mixed)


def run_case(browser, base, width, height, folder, language):
    context = browser.new_context(viewport={'width':width, 'height':height}, accept_downloads=True, service_workers='block')
    errors, unexpected, responses = [], [], {}
    origin = urlsplit(base).netloc

    def local_only(route):
        parsed = urlsplit(route.request.url)
        if parsed.scheme in ('blob','data'):
            route.continue_()
        elif parsed.scheme in ('http','https') and parsed.netloc == origin and parsed.path.startswith(PREFIX):
            route.continue_()
        elif parsed.scheme in ('http','https') and parsed.netloc == origin and parsed.path == '/favicon.ico':
            route.fulfill(status=204, body='')
        else:
            unexpected.append(route.request.url)
            route.abort()

    context.route('**/*', local_only)
    page = context.new_page()
    page.set_default_timeout(15000)
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.on('response', lambda response: responses.update({response.url:response.status}))
    try:
        response = page.goto(base, wait_until='networkidle')
        assert response and response.status == 200
        page.locator('#languageEn' if language == 'en' else '#languageZh').click()
        expect(page.locator('html')).to_have_attribute('lang','en' if language == 'en' else 'zh-CN')
        page.reload(wait_until='networkidle')
        expect(page.locator('html')).to_have_attribute('lang','en' if language == 'en' else 'zh-CN')
        expected_title = '心理语义任务 X 技术能力网络' if language == 'zh' else 'Psychological Semantic Tasks X Technical Capabilities Network'
        expect(page.locator('#network h1')).to_have_text(expected_title)
        expect(page.locator('#safetyText')).to_have_text('仅供研究使用和分享，目前不提供任何心理健康相关服务。' if language == 'zh' else 'For research use and sharing. No mental health services are currently provided.')
        assert page.locator('#methodology').count() == 0
        assert page.locator('input[type="password"]').count() == 0
        assert page.locator('#automaticNote a[href="mailto:ruyiw20@gmail.com"]').count() == 1
        actual_radar = page.evaluate('window.RADAR_DATA')
        expected_radar = json.loads((ROOT / 'data/radar.json').read_text())
        assert actual_radar == expected_radar, 'Hosted radar differs from the checked deployment snapshot'
        graph = page.evaluate('window.GRAPH_DATA')
        research = page.evaluate('window.RESEARCH_DATA')
        daily_count = page.evaluate('(window.RADAR_DATA.daily || []).length')
        assert graph['nodes'] and graph['edges'] and 0 <= daily_count <= 3
        assets = page.evaluate("""() => [...document.querySelectorAll('script[src],link[rel="stylesheet"]')].map(el => el.src || el.href)""")
        assert assets
        for url in assets:
            assert url.startswith(base) and responses.get(url) == 200, (url, responses.get(url))
        expect(page.locator('#network.active')).to_be_visible()
        expect(page.locator('.graph-node')).to_have_count(len(graph['nodes']))
        no_overflow(page, 'network')
        if language == 'en':
            assert_english_view(page, 'Mixed-language network view')

        node = page.locator('.graph-node[data-id="T01"]')
        node.click()
        original_ids = page.locator('.graph-node').evaluate_all('(nodes) => nodes.map(node => node.dataset.id)')
        page.locator('#edgeFilter').select_option('support')
        page.locator('#search').fill('Foundation')
        filtered_ids = page.locator('.graph-node').evaluate_all('(nodes) => nodes.map(node => node.dataset.id)')
        assert 'T01' in filtered_ids and len(filtered_ids) < len(original_ids)
        opposite_button = '#languageZh' if language == 'en' else '#languageEn'
        current_button = '#languageEn' if language == 'en' else '#languageZh'
        page.locator(opposite_button).click()
        assert page.locator('.graph-node').evaluate_all('(nodes) => nodes.map(node => node.dataset.id)') == filtered_ids
        expect(page.locator('.graph-node[data-id="T01"]')).to_have_attribute('aria-pressed','true')
        expect(page.locator('#search')).to_have_value('Foundation')
        expect(page.locator('#edgeFilter')).to_have_value('support')
        page.locator(current_button).click()
        page.locator('#reset').click()
        node = page.locator('.graph-node[data-id="T01"]')
        node.click()
        expect(node).to_have_attribute('aria-pressed','true')
        detail = page.locator('#nodeDetail')
        expect(detail).to_be_visible()
        expect(detail.locator('.eyebrow')).to_contain_text('T01')
        linked = detail.locator('button.node-link[data-select]').first
        linked_id = linked.get_attribute('data-select')
        assert linked_id and linked_id != 'T01'
        linked.click()
        expect(page.locator(f'.graph-node[data-id="{linked_id}"]')).to_have_attribute('aria-pressed','true')
        expect(detail.locator('.eyebrow')).to_contain_text(linked_id)
        no_overflow(page, 'related node')
        if language == 'en':
            assert_english_view(page, 'Untranslated node detail', '#nodeDetail')
        page.locator('#closeDetail').click()
        expect(detail).to_be_hidden()

        page.locator('#search').fill('re-identification')
        assert page.locator('.graph-node').count() > 0
        page.locator('#reset').click()
        with page.expect_download() as pending:
            page.locator('#export').click()
        download = pending.value
        assert download.suggested_filename == 'psychology-network.json'
        output = folder / f'network-{width}-{language}.json'
        download.save_as(output)
        assert download.failure() is None
        raw = output.read_bytes()
        exported = json.loads(raw.decode('utf-8'))
        assert exported['metadata'] == graph['metadata']
        assert exported['filters'] == {'domain':'all','query':'','edge':'all'}
        assert exported['nodes'] == graph['nodes'] and exported['edges'] == graph['edges']
        assert exported['view']['language'] == language
        assert len(exported['view']['nodeLabels']) == len(graph['nodes'])
        assert exported['view']['nodeLabels']['T01']['title'] == (graph['nodes'][0]['en'] if language == 'en' else graph['nodes'][0]['title'])
        assert graph['nodes'][0]['title'].encode('utf-8') in raw

        for section in ('weekly','daily','challenges','evidence'):
            nav = page.locator(f'.navigation a[href="#{section}"]')
            nav.click()
            expect(page).to_have_url(base + '#' + section)
            expect(nav).to_have_attribute('aria-current','page')
            expect(page.locator('.workspace.active')).to_have_count(1)
            expect(page.locator(f'#{section}.active')).to_be_visible()
            if section == 'weekly':
                expect(page.locator('#weeklyList .weekly-card')).to_have_count(5)
                expect(page.locator('#weeklyStatus')).not_to_be_empty()
            elif section == 'daily':
                expect(page.locator('#dailyList .daily-card')).to_have_count(daily_count)
                expect(page.locator('#dailyStatus')).not_to_be_empty()
                if not daily_count:
                    expect(page.locator('#dailyList .note')).to_be_visible()
            elif section == 'challenges':
                expect(page.locator('#challengeList .challenge')).to_have_count(10)
                first = page.locator('#challengeList .challenge').first
                first.locator('summary').click()
                expect(first).to_have_attribute('open','')
                expect(first.locator('.challenge-body')).to_be_visible()
                expect(first.locator('.challenge-body')).to_contain_text('如何验证' if language == 'zh' else 'Evaluation approach')
            else:
                expect(page.locator('#sourceList .source')).to_have_count(len(research['sources']))
            no_overflow(page, section)
            if language == 'en':
                assert_english_view(page, 'Mixed-language section: ' + section)
        assert not unexpected, unexpected
        assert not errors, errors
        return {'language':language, 'viewport':f'{width}x{height}', 'nodes':len(graph['nodes']), 'edges':len(graph['edges']), 'exportBytes':len(raw), 'pageErrors':errors, 'dailyUpdatedAt':actual_radar.get('dailyUpdatedAt'), 'weeklyUpdatedAt':actual_radar.get('weeklyUpdatedAt'), 'coverage':actual_radar.get('status',{}).get('state'), 'status':'passed'}
    except Exception:
        print(json.dumps({'viewport':width,'language':language,'pageErrors':errors,'blockedRequests':unexpected}, ensure_ascii=False), file=sys.stderr)
        raise
    finally:
        context.close()



def wait_for_public_site(base):
    expected = json.loads((ROOT / 'data/radar.json').read_text())
    error = None
    for attempt in range(12):
        try:
            headers = {'Cache-Control':'no-cache', 'User-Agent':'Psychology-Pages-Verification'}
            with urlopen(Request(base, headers=headers), timeout=15) as response:
                html = response.read(300000).decode('utf-8')
            with urlopen(Request(base + 'radar-data.js', headers=headers), timeout=15) as response:
                wrapper = response.read(800000).decode('utf-8').strip()
            actual = json.loads(wrapper.removeprefix('window.RADAR_DATA = ').removesuffix(';').strip())
            with urlopen(Request(base + 'i18n.js', headers=headers), timeout=15) as response:
                remote_i18n = response.read(300000).decode('utf-8')
            if 'id="languageEn"' in html and remote_i18n == (SITE / 'i18n.js').read_text() and actual == expected:
                return
            error = RuntimeError('The deployed page or radar snapshot is not current yet.')
        except Exception as exc:
            error = exc
        if attempt < 11:
            time.sleep(5)
    raise RuntimeError(f'Live site did not match the checked deployment: {type(error).__name__}: {error}')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--url', help='Verify the authorized public Pages URL')
    args = parser.parse_args()
    server, thread = None, None
    if args.url:
        base = args.url.rstrip('/') + '/'
        assert base == 'https://ruyi-agent-space.github.io/LLM-in-Psychology/', 'Unexpected live verification target'
        wait_for_public_site(base)
    else:
        assert (SITE / 'index.html').is_file()
        server = ThreadingHTTPServer(('127.0.0.1',0), functools.partial(PrefixHandler, directory=str(SITE)))
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        base = f'http://127.0.0.1:{server.server_port}{PREFIX}'
    try:
        with tempfile.TemporaryDirectory(prefix='psychology-smoke-') as folder:
            with sync_playwright() as playwright:
                browser = playwright.chromium.launch(headless=True)
                try:
                    reports = [run_case(browser,base,width,height,Path(folder),language) for width,height in ((1440,1000),(390,844)) for language in ('zh','en')]
                finally:
                    browser.close()
    finally:
        if server:
            server.shutdown()
            server.server_close()
            thread.join(timeout=5)
    print(json.dumps({'mode':'live' if args.url else 'local', 'url':base, 'browserSmoke':reports}, ensure_ascii=False))


if __name__ == '__main__':
    main()
