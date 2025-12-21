(function (root) {
var BensNavBar = root.BensNavBar = {};
BensNavBar.touch = false;
BensNavBar.menuOpen = false;
BensNavBar.mailingListLink = 'https://btn.ymlp.com/xgesummygmgm';

BensNavBar.addClass = function (element, newClass) {
  console.log('added ' + newClass + ' to ' + element.id);
  classList = element.className.split(' ');
  for (var i = 0; i < classList.length; i++) {
    if (classList[i] === newClass) {
      return classList.join(' ');
    }
  }

  element.className = classList + ' ' + newClass;
};

BensNavBar.removeClass = function (element, removalClass) {
  console.log('removed ' + removalClass + ' from ' + element.id);
  var classList = element.className.split(' ');
  for (var i = 0; i < classList.length; i++) {
    if (classList[i] === removalClass) {
      classList.splice(i, 1);
    }
  }

  element.className = classList.join(' ');
};

BensNavBar.hoverOn = function (element) {
  if (element !== BensNavBar.currentHoverElement) {
    if (typeof BensNavBar.currentHoverElement !== 'undefined') {
      BensNavBar.removeClass(BensNavBar.currentHoverElement, 'hoveron');
    }

    if (element && ['link1', 'link2', 'link3', 'link4', 'link5'].includes(element.id)) {
      BensNavBar.addClass(element, 'hoveron');
      BensNavBar.currentHoverElement = element;
    } else {
      BensNavBar.currentHoverElement = undefined;
    }
  }
};

BensNavBar.showMenu = function () {
  var menuButton = document.getElementById('menubutton');
  BensNavBar.menuOpen = true;
  BensNavBar.addClass(menuButton, 'touch');
  BensNavBar.addClass(document.getElementById('drophover'), 'show');
  BensNavBar.menuOpen = true;
};



BensNavBar.hideMenu = function (hoverElement) {
 BensNavBar.removeClass(document.getElementById('menubutton'), 'touch');
 BensNavBar.menuOpen = false;
 if (typeof hoverElement !== 'undefined') {
   BensNavBar.removeClass(hoverElement, 'touch');
   window.location = hoverElement.href; 
 }
 if (typeof BensNavBar.currentHoverElement !== 'undefined') {
   BensNavBar.removeClass(BensNavBar.currentHoverElement, 'hoveron');
 }
  BensNavBar.currentHoverElement = undefined;
  BensNavBar.removeClass(document.getElementById('drophover'), 'show');
};




// --- Dual interaction mode ---
// Long press/hold: show menu while holding, swipe/hover to highlight, navigate on release (existing behavior)
// Short tap/click: toggle menu open/closed, click a link to navigate, click outside to close

BensNavBar.mode = null;          // 'hold' | 'toggle' | null
BensNavBar.pressTimer = null;
BensNavBar.LONG_PRESS_MS = 380;  // tweak 320–450ms to taste

BensNavBar.clearPressTimer = function () {
  if (BensNavBar.pressTimer) {
    clearTimeout(BensNavBar.pressTimer);
    BensNavBar.pressTimer = null;
  }
};

BensNavBar.isTouchEvent = function (evt) {
  return evt && typeof evt.type === 'string' && evt.type.indexOf('touch') === 0;
};

BensNavBar.getPointTarget = function (evt) {
  var x, y;
  if (evt.touches && evt.touches[0]) {
    x = evt.touches[0].clientX;
    y = evt.touches[0].clientY;
  } else {
    x = evt.clientX;
    y = evt.clientY;
  }
  return document.elementFromPoint(x, y);
};

BensNavBar.showMenuToggle = function () {
  // Uses existing showMenu() visuals, but allows normal cursor + click-to-select
  BensNavBar.showMenu();
  BensNavBar.addClass(document.getElementById('drophover'), 'toggle');
};

BensNavBar.closeMenuNoNavigate = function () {
  // Close menu without selecting a hovered link (toggle mode close)
  BensNavBar.removeClass(document.getElementById('menubutton'), 'touch');
  BensNavBar.menuOpen = false;

  // remove toggle class if present
  BensNavBar.removeClass(document.getElementById('drophover'), 'toggle');

  if (typeof BensNavBar.currentHoverElement !== 'undefined') {
    BensNavBar.removeClass(BensNavBar.currentHoverElement, 'hoveron');
  }
  BensNavBar.currentHoverElement = undefined;
  BensNavBar.removeClass(document.getElementById('drophover'), 'show');
};

BensNavBar.handleTouchStart = function handleTouchStart(evt) {
  var menuButton = document.getElementById('menubutton');
  if (evt.target !== menuButton) { return; }

  // NOTE: do not preventDefault here; only do so once we enter hold mode.
  evt.stopPropagation();

  BensNavBar.touch = BensNavBar.isTouchEvent(evt);
  BensNavBar.mode = null;

  BensNavBar.clearPressTimer();
  BensNavBar.pressTimer = setTimeout(function () {
    BensNavBar.mode = 'hold';
    document.getElementsByClassName('dropdown')[0].style.cursor = 'none';
    // Existing behavior: show menu immediately on hold
    BensNavBar.showMenu();
  }, BensNavBar.LONG_PRESS_MS);
};

BensNavBar.handleTouchMove = function handleTouchMove(evt) {
  if (!BensNavBar.menuOpen) { return; }

  // HOLD MODE: prevent scroll and use elementFromPoint hover highlighting
  if (BensNavBar.mode === 'hold') {
    evt.stopPropagation();
    evt.preventDefault();
    var hoverElement = BensNavBar.getPointTarget(evt);
    BensNavBar.hoverOn(hoverElement);
    return;
  }

  // TOGGLE MODE:
  // - Touch: allow normal scroll (no preventDefault)
  // - Mouse: allow hover highlighting if desired
  if (BensNavBar.mode === 'toggle' && !BensNavBar.isTouchEvent(evt)) {
    var hoverEl2 = BensNavBar.getPointTarget(evt);
    BensNavBar.hoverOn(hoverEl2);
  }
};

BensNavBar.handleTouchEnd = function handleTouchEnd(evt) {
  document.getElementsByClassName('dropdown')[0].style.cursor = 'auto';

  var wasHold = (BensNavBar.mode === 'hold');
  BensNavBar.clearPressTimer();

  if (wasHold) {
    // Existing behavior: navigate on release (hovered element) and close
    BensNavBar.hideMenu(BensNavBar.currentHoverElement);
    BensNavBar.mode = null;
    return;
  }

  // SHORT PRESS => toggle behavior
  if (BensNavBar.menuOpen) {
    BensNavBar.closeMenuNoNavigate();
    BensNavBar.mode = null;
  } else {
    BensNavBar.mode = 'toggle';
    BensNavBar.showMenuToggle();
  }
};

// Toggle-mode: click a link to navigate; click outside to close
document.addEventListener('click', function (evt) {
  if (BensNavBar.mode !== 'toggle' || !BensNavBar.menuOpen) { return; }

  var drophover = document.getElementById('drophover');
  var dropdown = document.getElementsByClassName('dropdown')[0];

  // If a link inside the menu is clicked, close menu and allow navigation.
  var link = evt.target && evt.target.closest ? evt.target.closest('a') : null;
  if (link && drophover.contains(link)) {
    BensNavBar.closeMenuNoNavigate();
    BensNavBar.mode = null;
    return;
  }

  // Click outside dropdown closes menu
  if (!dropdown.contains(evt.target)) {
    BensNavBar.closeMenuNoNavigate();
    BensNavBar.mode = null;
  }
}, true);

// Listeners: touch uses passive false only for touchmove (needs preventDefault in hold mode)
document.addEventListener('touchstart', BensNavBar.handleTouchStart, {passive: true});
document.addEventListener('touchmove', BensNavBar.handleTouchMove, {passive: false});
document.addEventListener('touchend', BensNavBar.handleTouchEnd, {passive: true});
document.addEventListener('mousedown', BensNavBar.handleTouchStart, false);
document.addEventListener('mousemove', BensNavBar.handleTouchMove, false);
document.addEventListener('mouseup', BensNavBar.handleTouchEnd, false);

}(this));
