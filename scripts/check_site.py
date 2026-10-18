"""Check generated HTML, assets, headings, duplicate IDs and baseurl links.
Usage: python scripts/check_site.py _site --baseurl /repository
"""
import argparse
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import re

class Document(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links, self.ids, self.duplicates = [], set(), []
        self.headings, self.missing_alt = 0, 0
        self.has_title = False
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'h1': self.headings += 1
        if tag == 'title': self.has_title = True
        if tag == 'img' and 'alt' not in attrs: self.missing_alt += 1
        if 'id' in attrs:
            if attrs['id'] in self.ids: self.duplicates.append(attrs['id'])
            self.ids.add(attrs['id'])
        for attr in ('src', 'href'):
            if attr in attrs: self.links.append(attrs[attr])

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('directory', type=Path)
    parser.add_argument('--baseurl', default='')
    args = parser.parse_args()
    root, base = args.directory.resolve(), args.baseurl.rstrip('/')
    errors, pages = [], {}
    for path in root.rglob('*.html'):
        doc = Document()
        text = path.read_text(encoding='utf-8')
        doc.feed(text)
        pages[path] = doc
        if path.relative_to(root).parts[0] == 'admin': continue
        if re.search(r'\{%|\{\{', text): errors.append(f'{path}: unrendered Liquid')
        if re.search('\u9cb8\u5c0f\u54e8|\u4e2d\u56fd\u94f6\u884c', text): errors.append(f'{path}: legacy branding')
        if doc.headings != 1: errors.append(f'{path}: expected one h1, got {doc.headings}')
        if not doc.has_title: errors.append(f'{path}: missing title')
        if doc.missing_alt: errors.append(f'{path}: missing image alt')
        if doc.duplicates: errors.append(f'{path}: duplicate IDs {doc.duplicates}')
    if not pages: errors.append('No generated HTML pages found')
    for path, doc in pages.items():
        for link in doc.links:
            parsed = urlsplit(link)
            if parsed.scheme or parsed.netloc: continue
            target_path = unquote(parsed.path)
            if not target_path: target = path
            elif target_path.startswith('/'):
                if base and target_path != base and not target_path.startswith(base + '/'):
                    errors.append(f'{path}: missing baseurl in {link}')
                    continue
                target = root / target_path[len(base):].lstrip('/')
            else: target = (path.parent / target_path).resolve()
            if target.is_dir(): target = target / 'index.html'
            if not target.is_file(): errors.append(f'{path}: missing target {link}')
            elif parsed.fragment and target in pages and unquote(parsed.fragment) not in pages[target].ids:
                errors.append(f'{path}: missing anchor {link}')
    if errors: raise SystemExit('\n'.join(errors))
    print(f'PASS: {len(pages)} HTML pages; local links, images, headings, IDs and baseurl checked.')

if __name__ == '__main__': main()
