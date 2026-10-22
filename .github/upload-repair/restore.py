#!/usr/bin/env python3
"""Restore six truncated text files from the user's original uploaded ZIP.

The payload contains only missing text suffixes and SHA-256 checksums.
No project design, font declarations, or opportunity facts are changed.
"""
from pathlib import Path
import base64
import hashlib
import json
import lzma

PAYLOAD_SHA256 = 'c01de02c39ccfa443ce1a923c2bc9d89d19b744f105ec9bfdb28dbe6751088c2'
ALLOWED_PATHS = {
    'css/main.css',
    'data/opportunities.json',
    'js/detail.js',
    'js/list.js',
    'js/main.js',
    'scripts/validate-data.js',
}

def sha256(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()

def main() -> None:
    bundle = Path(__file__).resolve().parent
    root = bundle.parent.parent
    encoded = ''.join((bundle / f'part{i}.b64').read_text(encoding='ascii').strip() for i in range(1, 5))
    if sha256(encoded.encode('ascii')) != PAYLOAD_SHA256:
        raise SystemExit('Recovery payload checksum mismatch; no files changed.')
    records = json.loads(lzma.decompress(base64.b64decode(encoded, validate=True)))
    if set(records) != ALLOWED_PATHS:
        raise SystemExit('Unexpected paths in recovery payload; no files changed.')

    pending = []
    for name, record in records.items():
        target = root / name
        if target.is_symlink():
            raise SystemExit(f'Refusing symlink: {name}')
        current = target.read_bytes()
        if sha256(current) == record['after']:
            print(f'Already complete: {name}')
            continue
        if sha256(current) != record['before']:
            raise SystemExit(f'Unexpected existing content: {name}; no files changed.')
        restored = current + record['tail'].encode('utf-8')
        if sha256(restored) != record['after']:
            raise SystemExit(f'Reconstructed checksum mismatch: {name}; no files changed.')
        pending.append((name, target, restored))

    for name, target, restored in pending:
        target.write_bytes(restored)
        print(f'Restored and verified: {name} ({len(restored)} bytes)')
    print(f'Upload recovery complete: {len(pending)} file(s) restored.')

if __name__ == '__main__':
    main()
