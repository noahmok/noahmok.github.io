/* =========================
   Theme toggle
   ========================= */

(function () {
  var root = document.documentElement;
  var toggle = document.getElementById("theme-toggle");
  var label = document.getElementById("theme-label");
  var toc = document.getElementById("toc");

  function applyTheme(theme) {
    var dark = theme === "dark";

    root.setAttribute("data-theme", theme);

    toggle.setAttribute(
      "aria-pressed",
      String(dark)
    );

    label.textContent = dark
      ? "Light mode"
      : "Dark mode";
  }

  applyTheme(
    root.getAttribute("data-theme") || "light"
  );


  toggle.addEventListener("click", function () {
    var next =
      root.getAttribute("data-theme") === "dark"
        ? "light"
        : "dark";

    applyTheme(next);

    try {
      localStorage.setItem("theme", next);
    } catch (e) {}
  });


  /* =========================
     Contents dropdown
     ========================= */

  // Close the contents dropdown after choosing a link.
  toc.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      toc.removeAttribute("open");
    }
  });


  // Close when clicking outside.
  document.addEventListener("click", function (e) {
    if (!toc.contains(e.target)) {
      toc.removeAttribute("open");
    }
  });


  // Close with Escape.
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      toc.removeAttribute("open");
    }
  });

})();


/* =========================
   Photo albums
   ========================= */

(function () {

  var calm = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;


  document.querySelectorAll("[data-album]").forEach(function (album) {

    var track = album.querySelector(".album-track");

    var numberOfSlides = track.children.length;

    var count = album.querySelector(".album-count");

    var caption = album.querySelector(".album-caption");


    /* Determine the currently visible slide */

    function currentIndex() {
      return Math.round(
        track.scrollLeft / track.clientWidth
      );
    }


    /* Update caption and image count */

    function updateDisplay() {

      var index = currentIndex();

      count.textContent =
        (index + 1) +
        " / " +
        numberOfSlides;

      caption.textContent =
        track.children[index].dataset.cap;
    }


    /* Navigate to a particular slide */

    function goTo(index) {

      var target =
        Math.max(
          0,
          Math.min(
            numberOfSlides - 1,
            index
          )
        );

      track.scrollTo({
        left: target * track.clientWidth,
        behavior: calm ? "auto" : "smooth"
      });
    }


    /* Previous button */

    album
      .querySelector(".prev")
      .addEventListener("click", function () {

        goTo(currentIndex() - 1);

      });


    /* Next button */

    album
      .querySelector(".next")
      .addEventListener("click", function () {

        goTo(currentIndex() + 1);

      });


    /* Update when manually swiping */

    track.addEventListener(
      "scroll",
      updateDisplay
    );


    /* Keyboard navigation */

    track.addEventListener(
      "keydown",
      function (e) {

        if (e.key === "ArrowLeft") {

          e.preventDefault();

          goTo(currentIndex() - 1);

        }


        if (e.key === "ArrowRight") {

          e.preventDefault();

          goTo(currentIndex() + 1);

        }

      }
    );


    /* Set initial state */

    updateDisplay();

  });

})();
