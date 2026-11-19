(function () {
  var root = document.documentElement;
  var toggle = document.getElementById("theme-toggle");
  if (!toggle) return;

  function applyTheme(theme) {
    var dark = theme === "dark";
    root.setAttribute("data-theme", theme);
    toggle.setAttribute("aria-pressed", String(dark));
    toggle.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  }

  applyTheme(root.getAttribute("data-theme") || "light");

  toggle.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });
})();

/* Interactive CAD image viewer */
(function () {
  var viewport = document.querySelector("[data-cad-viewer]");
  if (!viewport) return;

  var image = viewport.querySelector("img");
  var scale = 1;
  var offsetX = 0;
  var offsetY = 0;
  var dragX = 0;
  var dragY = 0;
  var dragging = false;

  function render() {
    image.style.transform =
      "translate(" + offsetX + "px," + offsetY + "px) scale(" + scale + ")";
  }

  viewport.addEventListener("wheel", function (event) {
    event.preventDefault();
    scale = Math.max(1, Math.min(4, scale - event.deltaY * 0.0015));
    if (scale === 1) { offsetX = 0; offsetY = 0; }
    render();
  }, { passive: false });

  viewport.addEventListener("pointerdown", function (event) {
    dragging = true;
    dragX = event.clientX - offsetX;
    dragY = event.clientY - offsetY;
    viewport.setPointerCapture(event.pointerId);
  });

  viewport.addEventListener("pointermove", function (event) {
    if (!dragging) return;
    offsetX = event.clientX - dragX;
    offsetY = event.clientY - dragY;
    var limit = 220 * scale;
    offsetX = Math.max(-limit, Math.min(limit, offsetX));
    offsetY = Math.max(-limit, Math.min(limit, offsetY));
    render();
  });

  viewport.addEventListener("pointerup", function () { dragging = false; });
  viewport.addEventListener("pointercancel", function () { dragging = false; });
})();

/* Light Mount model selector */
(function () {
  var viewer = document.getElementById("light-mount-model");
  if (!viewer) return;

  document.querySelectorAll(".mount-select").forEach(function (button) {
    button.addEventListener("click", function () {
      document.querySelectorAll(".mount-select").forEach(function (item) {
        item.classList.remove("active");
      });
      button.classList.add("active");
      viewer.src = button.dataset.model + "?v=2";
      viewer.alt = "Interactive 3D model of the " + button.dataset.label;
    });
  });
})();
