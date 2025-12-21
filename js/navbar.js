(function () {
  const LONG_PRESS_MS = 330;

  const dropdown = document.querySelector(".dropdown");
  const button = document.getElementById("menubutton");
  const menu = document.getElementById("drophover");

  if (!dropdown || !button || !menu) {
    console.warn("[navbar] Missing elements:", { dropdown, button, menu });
    return;
  }
  // Prevent long-press context menu (Chrome/Android + emulation)
button.addEventListener("contextmenu", (e) => e.preventDefault());
menu.addEventListener("contextmenu", (e) => e.preventDefault());


  const links = () => Array.from(menu.querySelectorAll("a"));

  let pressTimer = null;
  let holding = false;     // true only during press-and-hold gesture
  let toggled = false;     // true when opened by quick tap
  let activeLink = null;   // currently highlighted link during hold

  function clearHover() {
    links().forEach(a => a.classList.remove("hoveron"));
  }

  function setHover(a) {
    clearHover();
    if (a) a.classList.add("hoveron");
    activeLink = a || null;
  }

  function openHold() {
    holding = true;
    toggled = false;
    dropdown.classList.add("touch");   // uses your existing CSS to show menu
    menu.classList.remove("toggle");
    menu.classList.add("show");
  }

  function openToggle() {
    toggled = true;
    holding = false;
    dropdown.classList.remove("touch");
    menu.classList.add("toggle");
    menu.classList.add("show");
    menu.style.display = "block";
  }

  function closeAll() {
    holding = false;
    toggled = false;
    activeLink = null;
    clearHover();
    dropdown.classList.remove("touch");
    menu.classList.remove("toggle");
    menu.classList.remove("show");
    menu.style.display = "";
  }

  function linkAtPoint(x, y) {
    const el = document.elementFromPoint(x, y);
    if (!el) return null;
    return el.closest && el.closest("#drophover a");
  }

  function navigate(a) {
    if (!a) return;
    const href = a.getAttribute("href");
    if (!href) return;

    const target = a.getAttribute("target");
    if (target === "_blank") {
      window.open(href, "_blank", "noopener");
    } else {
      window.location.href = href;
    }
  }

  // --- Hold gesture ---
  button.addEventListener("pointerdown", (ev) => {
    if (ev.pointerType === "mouse" && ev.button !== 0) return;

    // Important: prevent iOS callout/scroll cancel; you added CSS too.
    ev.preventDefault();

    // Start long-press timer
    pressTimer = setTimeout(() => {
      openHold();
      // initial hover
      setHover(linkAtPoint(ev.clientX, ev.clientY));
    }, LONG_PRESS_MS);
  }, { passive: false });

  document.addEventListener("pointermove", (ev) => {
    if (!holding) return;
    ev.preventDefault();
    setHover(linkAtPoint(ev.clientX, ev.clientY));
  }, { passive: false });

  document.addEventListener("pointerup", (ev) => {
    // Cancel pending long press if it hasn't fired yet
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }

    if (holding) {
      // select highlighted item on release
      const chosen = linkAtPoint(ev.clientX, ev.clientY) || activeLink;
      closeAll();
      navigate(chosen);
      return;
    }

    // If not holding, treat as tap -> toggle
    // Only toggle if the tap began on the button area
    // (pointerup can happen anywhere)
  });

  // Tap/click toggles menu
  button.addEventListener("click", (ev) => {
    // If hold already happened, ignore click
    if (holding) return;

    // If long-press timer is still pending, cancel it
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }

    ev.preventDefault();

    if (toggled) {
      closeAll();
    } else {
      openToggle();
    }
  });

  // In toggle mode, clicking a link should close the menu (normal nav)
  menu.addEventListener("click", (ev) => {
    if (!toggled) return;
    const a = ev.target.closest && ev.target.closest("a");
    if (!a) return;
    closeAll();
    // allow normal navigation
  });

  // Clicking outside closes menu in toggle mode
  document.addEventListener("pointerdown", (ev) => {
    if (!toggled) return;
    const inside = ev.target.closest && ev.target.closest(".dropdown");
    if (!inside) closeAll();
  });

  closeAll();
  console.log("[navbar] hold-swipe-release enabled");
})();
