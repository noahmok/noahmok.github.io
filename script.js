/* =========================
   Theme toggle
   ========================= */

(function () {
  var root = document.documentElement;
  var toggle = document.getElementById("theme-toggle");
  var label = document.getElementById("theme-label");

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
   View counter (counterapi.dev)
   Counts once per browser session; refreshes just read the total.
   ========================= */

(function () {
  var el = document.getElementById("view-count");
  var url = "https://api.counterapi.dev/v1/eulerntm-github-io/page-views";
  var counted = false;

  try { counted = sessionStorage.getItem("view-counted") === "1"; } catch (e) {}

  fetch(counted ? url : url + "/up")
    .then(function (res) { return res.json(); })
    .then(function (data) {
      var n = Number(data.count !== undefined ? data.count : data.value);
      if (!isFinite(n)) return;
      el.textContent = n.toLocaleString();
      try { sessionStorage.setItem("view-counted", "1"); } catch (e) {}
    })
    .catch(function () {}); // on failure, the placeholder dash stays
})();
