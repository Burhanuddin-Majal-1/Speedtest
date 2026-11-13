/* Majal Network Lab — LibreSpeed browser adapter.
 * LibreSpeed engine: https://github.com/librespeed/speedtest/ (LGPL-3.0).
 * Server list is a snapshot of the public LibreSpeed directory.
 */
(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const ui = {
    main: $("speed-value"),
    units: $("speed-units"),
    upload: $("upload-value"),
    ping: $("latency-value"),
    jitter: $("bufferbloat-value"),
    pingLabel: $("latency-label"),
    jitterLabel: $("bufferbloat-label"),
    status: $("your-speed-message"),
    progress: $("speed-progress-indicator"),
    progressIcon: $("speed-progress-indicator-icon"),
    error: $("error-results-msg"),
    unstable: $("unstable-results-msg"),
    detailsLink: $("show-more-details-link"),
    details: $("extra-details-container"),
    server: $("server-locations"),
    clientIp: $("user-ip"),
    clientLocation: $("user-location"),
    clientIsp: $("user-isp"),
    downloadMb: $("down-mb-value"),
    uploadMb: $("up-mb-value"),
    helpButton: $("test-help-btn"),
    help: $("help-content"),
    settingsLink: $("settings-link"),
    config: $("test-config-container")
  };

  const TARGET_MS = 25000;
  let engine = null;
  let serverList = null;
  let running = false;
  let selecting = false;
  let startedAt = 0;
  let ticker = null;
  let cancelledSelection = false;

  function setText(node, value) {
    if (node) node.textContent = value;
  }

  function showError(message) {
    running = false;
    selecting = false;
    if (ui.error) {
      ui.error.textContent = message;
      ui.error.style.display = "block";
    }
    if (ui.status) setText(ui.status, "Test unavailable");
    if (ui.progress) ui.progress.classList.remove("in-progress");
    if (ui.progressIcon) ui.progressIcon.className = "oc-icon oc-icon-play speed-progress-indicator-icon";
  }

  function clearError() {
    if (ui.error) ui.error.style.display = "none";
    if (ui.unstable) ui.unstable.style.display = "none";
  }

  function setStatus(text) {
    setText(ui.status, text);
  }

  function setSpeed(value) {
    const number = Number.parseFloat(value);
    setText(ui.main, Number.isFinite(number) ? number.toFixed(2) : "—");
    setText(ui.units, "Mbps");
  }

  function setUpload(value) {
    const number = Number.parseFloat(value);
    setText(ui.upload, Number.isFinite(number) ? number.toFixed(2) : "—");
  }

  function resetDisplay() {
    clearError();
    setSpeed(0);
    setUpload(0);
    setText(ui.ping, "—");
    setText(ui.jitter, "—");
    setText(ui.server, "Finding nearest server…");
    setText(ui.clientIp, "Not collected");
    setText(ui.clientLocation, "");
    setText(ui.clientIsp, "");
    setText(ui.downloadMb, "—");
    setText(ui.uploadMb, "—");
    if (ui.progress) ui.progress.classList.add("in-progress");
    if (ui.progressIcon) ui.progressIcon.className = "oc-icon oc-icon-pause speed-progress-indicator-icon";
  }

  function tick() {
    if (!startedAt || !running) return;
    const elapsed = Date.now() - startedAt;
    const remaining = Math.max(0, Math.ceil((TARGET_MS - elapsed) / 1000));
    if (remaining > 0) setStatus("Testing your connection · " + remaining + "s");
    else setStatus("Finalizing results…");
  }

  function finishUi() {
    running = false;
    selecting = false;
    if (ticker) clearInterval(ticker);
    ticker = null;
    if (ui.progress) ui.progress.classList.remove("in-progress");
    if (ui.progressIcon) ui.progressIcon.className = "oc-icon oc-icon-refresh speed-progress-indicator-icon";
    setStatus("Your Internet speed is");
  }

  async function loadServers() {
    if (serverList) return serverList;
    const response = await fetch("servers.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Could not load the test-server list (" + response.status + ").");
    const list = await response.json();
    if (!Array.isArray(list) || list.length < 2) throw new Error("The test-server list is empty or invalid.");
    serverList = list;
    return list;
  }

  async function startTest() {
    if (running || selecting) return;
    cancelledSelection = false;
    resetDisplay();
    selecting = true;
    setStatus("Finding the fastest available test server…");

    try {
      const servers = await loadServers();
      if (cancelledSelection) return;

      engine = new Speedtest();
      engine.setParameter("test_order", "D_P_U");
      engine.setParameter("time_dl_max", 10);
      engine.setParameter("time_ul_max", 10);
      engine.setParameter("time_auto", false);
      engine.setParameter("time_dlGraceTime", 0.5);
      engine.setParameter("time_ulGraceTime", 0.5);
      engine.setParameter("count_ping", 10);
      engine.setParameter("telemetry_level", 0);
      engine.addTestPoints(servers);

      engine.onupdate = (data) => {
        if (!data) return;
        if (data.testState === 1) {
          setStatus("Testing download speed…");
          setSpeed(data.dlStatus);
        } else if (data.testState === 2) {
          setStatus("Measuring latency and jitter…");
          if (data.pingStatus !== "") setText(ui.ping, data.pingStatus);
          if (data.jitterStatus !== "") setText(ui.jitter, data.jitterStatus);
        } else if (data.testState === 3) {
          setStatus("Testing upload speed…");
          setUpload(data.ulStatus);
        }
        if (data.clientIp) setText(ui.clientIp, data.clientIp);
      };

      engine.onend = (aborted) => {
        const elapsed = Date.now() - startedAt;
        const finalize = () => {
          if (aborted) {
            finishUi();
            setStatus("Test stopped");
            return;
          }
          finishUi();
          setStatus("Test complete");
          setText(ui.pingLabel, "Latency");
          setText(ui.jitterLabel, "Jitter");
        };
        if (aborted) {
          finalize();
          return;
        }
        // Keep the requested 25-second experience; if the engine finishes
        // slightly early, hold the final result until the 25-second mark.
        window.setTimeout(finalize, Math.max(0, TARGET_MS - elapsed));
      };

      engine.selectServer((server) => {
        if (cancelledSelection) return;
        if (!server) {
          showError("No reachable test servers were found. Please try again later.");
          return;
        }
        setText(ui.server, server.name);
        selecting = false;
        running = true;
        startedAt = Date.now();
        tick();
        ticker = window.setInterval(tick, 250);
        setStatus("Starting test…");
        try {
          engine.start();
        } catch (error) {
          console.error(error);
          showError("The test engine could not start. Check the browser console for details.");
        }
      });
    } catch (error) {
      console.error(error);
      showError(error && error.message ? error.message : "Could not reach the test servers.");
    }
  }

  function stopTest() {
    if (selecting) {
      cancelledSelection = true;
      selecting = false;
      setStatus("Server selection cancelled");
      if (ui.progress) ui.progress.classList.remove("in-progress");
      if (ui.progressIcon) ui.progressIcon.className = "oc-icon oc-icon-play speed-progress-indicator-icon";
      return;
    }
    if (running && engine) {
      setStatus("Stopping test…");
      try { engine.abort(); } catch (error) { console.warn(error); }
    }
  }

  if (ui.details) ui.details.style.display = "none";
  if (ui.help) ui.help.style.display = "none";
  if (ui.config) ui.config.style.display = "none";
  if (ui.downloadMb && ui.downloadMb.closest("table")) ui.downloadMb.closest("table").style.display = "none";
  if (ui.settingsLink) ui.settingsLink.closest("td")?.style.setProperty("display", "none");

  ui.detailsLink?.addEventListener("click", (event) => {
    event.preventDefault();
    ui.details.style.display = ui.details.style.display === "none" ? "block" : "none";
  });
  ui.helpButton?.addEventListener("click", (event) => {
    event.preventDefault();
    ui.help.style.display = ui.help.style.display === "none" ? "block" : "none";
  });
  ui.progress?.addEventListener("click", () => {
    if (running || selecting) stopTest();
    else startTest();
  });

  // FAST-style automatic start on page load.
  startTest();
})();
