(function () {
  var root = document.documentElement;
  var toggle = document.getElementById("theme-toggle");
  var label = document.getElementById("theme-label");
  var toc = document.getElementById("toc");

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

  // Close the contents dropdown after choosing a link, clicking elsewhere, or pressing Escape
  toc.addEventListener("click", function (e) { if (e.target.tagName === "A") toc.removeAttribute("open"); });
  document.addEventListener("click", function (e) { if (!toc.contains(e.target)) toc.removeAttribute("open"); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") toc.removeAttribute("open"); });
})();


// Photo albums: native swipe/scroll-snap, plus buttons and arrow keys
(function () {
  var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll("[data-album]").forEach(function (a) {
    var t = a.querySelector(".album-track"), n = t.children.length;
    var count = a.querySelector(".album-count"), cap = a.querySelector(".album-caption");
    function idx() { return Math.round(t.scrollLeft / t.clientWidth); }
    function show() { var i = idx(); count.textContent = (i + 1) + " / " + n; cap.textContent = t.children[i].dataset.cap; }
    function go(i) { t.scrollTo({ left: Math.max(0, Math.min(n - 1, i)) * t.clientWidth, behavior: calm ? "auto" : "smooth" }); }
    a.querySelector(".prev").addEventListener("click", function () { go(idx() - 1); });
    a.querySelector(".next").addEventListener("click", function () { go(idx() + 1); });
    t.addEventListener("scroll", show);
    t.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { e.preventDefault(); go(idx() - 1); }
      if (e.key === "ArrowRight") { e.preventDefault(); go(idx() + 1); }
    });
  });
})();
