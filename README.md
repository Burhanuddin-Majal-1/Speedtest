# Majal Network Lab

An advanced, static browser-based network diagnostics page built with plain HTML, CSS and JavaScript. No build step, account, or project-owned backend is required.

## Diagnostics

- **Download throughput:** three concurrent Cloudflare HTTP download streams, measuring received bytes over elapsed time.
- **Upload throughput:** three concurrent HTTP upload requests to Cloudflare.
- **HTTP latency distribution:** 20 sequential zero-byte HTTP probes, with minimum, median, average, 95th percentile and maximum.
- **HTTP jitter estimate:** median absolute difference between adjacent successful HTTP probe timings.
- **DNS-over-HTTPS timing:** repeated lookups through Google Public DNS (`dns.google`, resolver service associated with 8.8.8.8) and Cloudflare DNS (`cloudflare-dns.com`, resolver service associated with 1.1.1.1).
- **HTTP probe failure rate:** failed HTTP probes divided by attempted HTTP probes. This is deliberately not called packet loss.
- **Exportable JSON report** and local test history.
- Responsive dark interface and stop control.

## Deploy with GitHub Pages

1. Open **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select **main** and **/(root)**, then save.
4. Wait for GitHub Pages to publish the site.

The entry point is `index.html`.

## Measurement limitations — read this

This is a browser-based estimate, not a professional router or line-certification tool.

- Browser JavaScript cannot send raw ICMP echo requests. The displayed latency is **HTTP request timing**, not ICMP ping.
- DNS values are **DNS-over-HTTPS transaction timings**. They include browser scheduling, connection setup/reuse, TLS, network routing and resolver response time; they are not raw UDP port 53 DNS timings.
- A failed HTTP probe is not proof of packet loss. Browser scheduling, CORS, server errors, throttling, transient congestion and other factors can cause failures.
- The browser cannot reliably expose Wi-Fi signal strength (RSSI), channel width, negotiated PHY rate, router queueing, WAN link rate, or the ISP's exact path.
- Throughput uses three concurrent streams and a fixed data volume (up to approximately 24 MB download and 6 MB upload). Very fast or unstable connections, device CPU limits, browser throttling, endpoint load and concurrent traffic can affect results.
- The browser's Network Information API is optional and unsupported in many browsers. Its values are estimates, not independently measured link characteristics.
- Results can differ from native tools such as `ping`, `mtr`, `iperf3`, router diagnostics and ISP tests. Use those tools for deeper fault isolation and controlled measurements.

## Data, privacy and network usage

- Recent results are stored in this browser's `localStorage`; use **Clear** to remove them.
- **Export JSON** creates a report file locally when a completed test is available.
- No project-owned analytics or result-upload backend is included.
- Running a full test transfers up to roughly 30 MB, excluding HTTP/DNS request overhead. Avoid repeated tests on metered connections.
- The page contacts Cloudflare's public speed-test endpoint and Google's and Cloudflare's public DNS-over-HTTPS services. Those providers process the requests according to their own policies.

## Built with

Plain HTML, CSS and JavaScript · [GitHub repository](https://github.com/Burhanuddin-Majal-1/Speedtest) · [Majal Technologies](https://github.com/Burhanuddin-Majal-1)
