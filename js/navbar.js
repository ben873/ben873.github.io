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



BensNavBar.handleTouchStart = function (evt) {
  var menuButton = document.getElementById('menubutton');
  if (evt.target != menuButton) {
    return;
  }
  evt.stopPropagation();
  evt.preventDefault();
  document.getElementsByClassName('dropdown')[0].style.cursor = 'none';
  BensNavBar.touch = true;

  var hoverElement = document.elementFromPoint(evt.clientX || evt.touches[0].clientX, evt.clientY || evt.touches[0].clientY);
  if (hoverElement.id === 'menubutton') {
    BensNavBar.showMenu();
  }
};

BensNavBar.handleTouchMove = function handleTouchMove(evt) {

  if (!BensNavBar.menuOpen) {
    return;
  }
  console.log('touchmove fired');
  evt.stopPropagation();
  evt.preventDefault();
  var hoverElement = document.elementFromPoint(evt.clientX || evt.touches[0].clientX, evt.clientY || evt.touches[0].clientY);
  BensNavBar.hoverOn(hoverElement);


};

BensNavBar.handleTouchEnd = function (evt) {
  document.getElementsByClassName('dropdown')[0].style.cursor = 'auto';
  BensNavBar.hideMenu(BensNavBar.currentHoverElement);
};

document.addEventListener('touchstart', BensNavBar.handleTouchStart, {passive: false});
document.addEventListener('touchmove', BensNavBar.handleTouchMove, {passive: false});
document.addEventListener('touchend', BensNavBar.handleTouchEnd, {passive: false});
document.addEventListener('mousedown', BensNavBar.handleTouchStart, false);
document.addEventListener('mousemove', BensNavBar.handleTouchMove, false);
document.addEventListener('mouseup', BensNavBar.handleTouchEnd, false);

}(this));
