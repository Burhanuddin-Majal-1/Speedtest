# Majal Network Lab

A static internet speed-test page hosted on GitHub Pages.

## Implementation

This repository currently uses the FAST.com web interface bundle and its associated browser-side assets. The page measures network performance through FAST.com's service infrastructure; it is not an independently operated measurement backend.

- `index.html` — page markup
- `app-07ba96.css` — styles
- `app-0bffe1.js` — browser test application
- `assets/` — logo, icon font stylesheet, and font file

## GitHub Pages

The page uses relative paths for local stylesheets, scripts, fonts, and logos so it can load from a project site such as:

`https://burhanuddin-majal-1.github.io/Speedtest/`

The missing favicon references were removed rather than pointing browsers at files that are not in this repository.

## Service and attribution

FAST.com is operated by Netflix. This project is an independent, unofficial deployment and is not affiliated with or endorsed by Netflix. The speed-test application contacts FAST.com/Netflix infrastructure, and its availability, behavior, terms, and permitted use are controlled by that service. Review the upstream project's applicable license and terms before redistributing or modifying its bundled source.

## Important

Results depend on the browser, device, connection, routing, and FAST.com test servers. This page is not a substitute for an ISP service-level test or a certified network measurement.
