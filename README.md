# Majal Network Lab

A FAST-style internet speed-test interface hosted as a static GitHub Pages site.

## Engine

The original FAST.com/Netflix testing bundle has been replaced with **LibreSpeed**, an open-source browser speed-test engine.

- `index.html` — retained FAST-style page layout
- `app-07ba96.css` — retained page styling
- `app.js` — Majal UI adapter and automatic test flow
- `speedtest.js`, `speedtest_worker.js` — LibreSpeed engine (LGPL-3.0)
- `servers.json` — snapshot of public LibreSpeed community test servers
- `assets/` — existing logo, icon font stylesheet, and font file

## Server selection

On each run, the browser checks the listed public test servers and selects the one with the lowest measured HTTP latency. This is the lowest-latency reachable server in the configured list, not necessarily the geographically closest server.

The current public list has no Pakistan-based test point; Tokyo is currently the only listed Asian location. The selected server may therefore be far away. Public test servers are independently operated and can become unavailable or change their policies.

The server list is mirrored from the public directory at [librespeed.org/backend-servers/servers.php](https://librespeed.org/backend-servers/servers.php). Refresh `servers.json` periodically to pick up additions and removals.

## Test behavior

- Download and upload measurements use 10-second phases.
- Latency and jitter are measured with HTTP requests, not ICMP ping.
- The UI targets a 25-second run, holding the final result if the measurement engine finishes slightly early.
- Browser scheduling, server response times, and background-tab throttling mean a browser page cannot guarantee a hard real-time 25.000-second duration.
- Results depend on the selected community server, browser, device, routing, and other network traffic.

No LibreSpeed telemetry or results-sharing endpoint is configured by this site. The selected test server still receives the network requests needed to run the test and may log connection metadata under its own policies.

## GitHub Pages

The site uses relative paths for local scripts, stylesheets, fonts, logos, and the server list. Publish the repository root from the `main` branch in GitHub Pages.

## Third-party notices

LibreSpeed is Copyright (C) Federico Dossena and contributors, licensed under GNU LGPL v3. See [LICENSE-LIBRESPEED](LICENSE-LIBRESPEED) and the [upstream project](https://github.com/librespeed/speedtest).

This project is an independent interface and is not affiliated with Netflix, FAST.com, or the operators of the public LibreSpeed test servers.
