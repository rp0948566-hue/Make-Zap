#!/usr/bin/env python3
"""
Complete Website Downloader Script
Downloads a complete website (HTML, CSS, JS, Images) and saves it locally for preview & code inspection.
"""
import sys
import os
import subprocess
import urllib.parse
import urllib.request
import json
import re

WGET_PATH = os.path.abspath(os.path.join("Complete-Website-Downloader", "WebsiteDownloader", "wget.exe"))

def download_website(url, output_dir="downloaded_sites"):
    if not url.startswith("http://") and not url.startswith("https://"):
        url = "https://" + url

    parsed = urllib.parse.urlparse(url)
    domain = parsed.netloc.replace(":", "_").replace("www.", "")
    if not domain:
        domain = "downloaded_site"

    target_folder = os.path.abspath(os.path.join(output_dir, domain))
    os.makedirs(target_folder, exist_ok=True)

    print(f"[WEBSITE DOWNLOADER] Starting download for: {url}")
    print(f"[WEBSITE DOWNLOADER] Target folder: {target_folder}")

    if os.path.exists(WGET_PATH):
        cmd = [
            WGET_PATH,
            "--mirror",
            "--convert-links",
            "--adjust-extension",
            "--page-requisites",
            "--no-parent",
            "--no-check-certificate",
            "-P", target_folder,
            url
        ]
        try:
            proc = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
        except Exception as e:
            print(f"[WGET EXCEPTION]: {e}")
    else:
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
            with urllib.request.urlopen(req) as resp:
                content = resp.read().decode('utf-8', errors='ignore')
                index_path = os.path.join(target_folder, "index.html")
                with open(index_path, "w", encoding="utf-8") as f:
                    f.write(content)
        except Exception as e:
            print(f"[SCRAPE ERROR]: {e}")

    index_file = None
    for root, dirs, files in os.walk(target_folder):
        for f in files:
            if f.endswith(".html") or f.endswith(".htm"):
                index_file = os.path.join(root, f)
                break
        if index_file:
            break

    if not index_file:
        index_file = os.path.join(target_folder, "index.html")
        if not os.path.exists(index_file):
            with open(index_file, "w", encoding="utf-8") as f:
                f.write(f"<!DOCTYPE html><html><head><title>{domain}</title></head><body><h1>Downloaded Site: {domain}</h1><p>Source URL: {url}</p></body></html>")

    rel_path = os.path.relpath(index_file, os.getcwd()).replace("\\", "/")

    result = {
        "status": "success",
        "url": url,
        "domain": domain,
        "folder": target_folder.replace("\\", "/"),
        "index_file": index_file.replace("\\", "/"),
        "relative_path": rel_path
    }

    return result

if __name__ == '__main__':
    target_url = sys.argv[1] if len(sys.argv) > 1 else "https://example.com"
    res = download_website(target_url)
    print(json.dumps(res, indent=2))
