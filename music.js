/* =========================================================
   music.js  (load with defer, after script.js)
   Avatar dropdown + swapping between portfolio and music views
   ========================================================= */

(function () {
  var root = document.documentElement;
  var avatar = document.querySelector(".avatar");
  var avatarBtn = document.getElementById("avatar-btn");
  var vinylBtn = document.getElementById("vinyl-btn");
  var brandText = document.querySelector(".brand-text");
  if (!avatar || !avatarBtn || !vinylBtn) return;

  var canHover = window.matchMedia("(hover: hover)").matches;
  var SITE_TITLE = "Noah Mok";
  var MUSIC_TITLE = "Noah Mok · Music";

  /* ----- Dropdown: hover/tap/keyboard opens, click-away or vinyl click retracts ----- */

  // After a click retracts the vinyl, the mouse is usually still over the avatar.
  // Hold it closed until the mouse leaves, so it doesn't instantly reopen.
  var heldClosed = false;

  function isOpen() { return avatar.classList.contains("open"); }

  function setOpen(open) {
    avatar.classList.toggle("open", open);
    avatarBtn.setAttribute("aria-expanded", String(open));
  }

  function retract() {
    setOpen(false);
    heldClosed = canHover && avatar.matches(":hover");
  }

  if (canHover) {
    avatar.addEventListener("mouseenter", function () {
      if (!heldClosed) setOpen(true);
    });
    avatar.addEventListener("mouseleave", function () {
      heldClosed = false;
      setOpen(false);
    });
  }

  avatarBtn.addEventListener("click", function () {
    if (isOpen()) {
      retract();
    } else {
      heldClosed = false;
      setOpen(true);
    }
  });

  // Click anywhere outside the avatar/vinyl
  document.addEventListener("click", function (e) {
    if (!avatar.contains(e.target)) setOpen(false);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") retract();
  });

  // Keyboard users tabbing away from the vinyl
  avatar.addEventListener("focusout", function (e) {
    if (e.relatedTarget && !avatar.contains(e.relatedTarget)) setOpen(false);
  });

  /* ----- View switching ----- */

  function currentView() {
    return root.getAttribute("data-view") === "music" ? "music" : "site";
  }

  function setView(view, push) {
    var music = view === "music";
    root.setAttribute("data-view", music ? "music" : "site");
    vinylBtn.setAttribute("aria-pressed", String(music));
    document.title = music ? MUSIC_TITLE : SITE_TITLE;
    setOpen(false);

    if (push) {
      try {
        history.pushState(null, "", music ? "#music" : location.pathname + location.search);
      } catch (e) {}
    }
    window.scrollTo(0, 0);
  }

  function fromHash() {
    setView(location.hash === "#music" ? "music" : "site", false);
  }

  vinylBtn.addEventListener("click", function () {
    retract();
    setView(currentView() === "music" ? "site" : "music", true);
  });

  document.querySelectorAll("[data-view-target]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      setView(el.getAttribute("data-view-target"), true);
    });
  });

  // Clicking the name while in the music view goes back to the portfolio
  if (brandText) {
    brandText.addEventListener("click", function (e) {
      if (currentView() === "music") {
        e.preventDefault();
        setView("site", true);
      }
    });
  }

  window.addEventListener("popstate", fromHash);
  window.addEventListener("hashchange", fromHash);

  // Initial state (the inline <head> script already set data-view to avoid a flash)
  vinylBtn.setAttribute("aria-pressed", String(currentView() === "music"));
  document.title = currentView() === "music" ? MUSIC_TITLE : SITE_TITLE;
})();
