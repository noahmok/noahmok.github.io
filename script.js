/* =========================
   Theme toggle
   ========================= */

(function () {
  var root = document.documentElement;
  var toggle = document.getElementById("theme-toggle");
  var label = document.getElementById("theme-label");
  if (!toggle || !label) return;

  function applyTheme(theme) {
    var dark = theme === "dark";
    root.setAttribute("data-theme", theme);
    toggle.setAttribute("aria-pressed", String(dark));
    label.textContent = dark ? "Light mode" : "Dark mode";
  }

  applyTheme(root.getAttribute("data-theme") || "light");

  toggle.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });
})();


/* =========================
   Contents dropdown
   ========================= */

(function () {
  var toc = document.getElementById("toc");
  if (!toc) return;

  function close() { toc.removeAttribute("open"); }

  toc.addEventListener("click", function (e) {
    if (e.target.tagName === "A") close();
  });

  document.addEventListener("click", function (e) {
    if (!toc.contains(e.target)) close();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") close();
  });
})();


/* =========================
   Photo albums
   ========================= */

(function () {
  var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll("[data-album]").forEach(function (album) {
    var track = album.querySelector(".album-track");
    var count = album.querySelector(".album-count");
    var caption = album.querySelector(".album-caption");
    var total = track.children.length;

    function current() {
      return Math.round(track.scrollLeft / track.clientWidth);
    }

    function update() {
      var i = current();
      count.textContent = (i + 1) + " / " + total;
      caption.textContent = track.children[i].dataset.cap;
    }

    function goTo(i) {
      var target = Math.max(0, Math.min(total - 1, i));
      track.scrollTo({
        left: target * track.clientWidth,
        behavior: calm ? "auto" : "smooth"
      });
    }

    album.querySelector(".prev").addEventListener("click", function () { goTo(current() - 1); });
    album.querySelector(".next").addEventListener("click", function () { goTo(current() + 1); });

    track.addEventListener("scroll", update);
    track.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft")  { e.preventDefault(); goTo(current() - 1); }
      if (e.key === "ArrowRight") { e.preventDefault(); goTo(current() + 1); }
    });

    update();
  });
})();


/* =========================
   View counter (counterapi.dev, V2)
   Counts once per browser session; refreshes just read the total.

   Notes:
   - cache: "no-store" stops the browser from answering from its own cache,
     which would hide increments from the server.
   - CounterAPI buffers writes, so the number it returns can lag a little
     behind the true total for a minute or two. To keep the portfolio and
     music views showing the same number, this browser remembers the highest
     total it has seen and never displays a lower one.
   ========================= */

(function () {
  var WORKSPACE = "ntmok-page-views";  // workspace slug from the CounterAPI dashboard
  var COUNTER = "ntmok-site-views";    // counter slug inside that workspace
  var SESSION_KEY = "view-counted";
  var LAST_KEY = "view-last";          // highest total this browser has seen

  var el = document.getElementById("view-count");
  if (!el) return;

  var base = "https://api.counterapi.dev/v2/" +
    encodeURIComponent(WORKSPACE) + "/" + encodeURIComponent(COUNTER);

  // Show the last total this browser saw straight away, so every view agrees
  var last = 0;
  try { last = Number(localStorage.getItem(LAST_KEY)) || 0; } catch (e) {}
  if (last) el.textContent = last.toLocaleString();

  // Has this tab already counted a visit?
  var counted = false;
  try { counted = sessionStorage.getItem(SESSION_KEY) === "1"; } catch (e) {}

  // First visit in this session -> /up (increment). Otherwise just read the total.
  var url = counted ? base : base + "/up";

  fetch(url, { cache: "no-store" })
    .then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    })
    .then(function (json) {
      // The API replies { code, data: { up_count, down_count, ... } }
      var n = json.data.up_count - json.data.down_count;
      if (!isFinite(n)) throw new Error("Unexpected response: " + JSON.stringify(json));
      n = Math.max(n, last); // a lagging response never makes the number go down
      el.textContent = n.toLocaleString();
      try { localStorage.setItem(LAST_KEY, String(n)); } catch (e) {}

      // Only mark the session as counted after a successful increment.
      if (!counted) {
        try { sessionStorage.setItem(SESSION_KEY, "1"); } catch (e) {}
      }
    })
    .catch(function (err) {
      console.error("View counter:", err); // the dash stays on failure
    });
})();
