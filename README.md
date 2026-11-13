# Majal Speedtest

A lightweight, responsive browser-based internet speed test built with plain HTML, CSS and JavaScript.

## Features
- Download and upload throughput measurements
- Ping and jitter sampling
- Live download speed display
- Recent test history stored locally in the browser
- Responsive dark glass interface
- No build tools or backend required

## GitHub Pages deployment
1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select **main** and **/(root)**, then save.
4. Wait for GitHub Pages to publish the site.

The site entry point is `index.html`.

## Measurement notes
This project uses Cloudflare's public speed-test endpoints at `speed.cloudflare.com`. Results are estimates and depend on endpoint capacity, routing, device performance, Wi-Fi conditions and browser behavior. The browser must be able to make cross-origin requests to that endpoint. If the endpoint is unavailable or blocked, the test will show an error.

Each run downloads approximately 18 MB and uploads approximately 6 MB, plus latency samples. Avoid repeated tests on metered connections.

## Privacy
Test history is stored in this browser's `localStorage`. There is no account system or project-owned analytics backend. Speed measurements contact Cloudflare's public endpoint.

Built by [Burhanuddin Majal](https://github.com/Burhanuddin-Majal-1) · Majal Technologies.
