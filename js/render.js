(function(){
  function esc(s){
    return String(s).replace(/[&<>"']/g, function(c){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]);
    });
  }

  function roleHref(role){ return esc(role.slug) + ".html"; }

  function pictureHTML(base, alt){
    return (
      '<picture>' +
        '<source srcset="images/work/webp/' + esc(base) + '.webp" type="image/webp">' +
        '<img src="images/work/jpg/' + esc(base) + '.jpg" width="576" height="800" loading="lazy" alt="' + esc(alt) + '">' +
      '</picture>'
    );
  }

  function tileHTML(item){
    var base = item.basename;
    var alt = (item.title || base) +
      (item.year ? (' (' + item.year + ')') : '') +
      (item.type ? (' — ' + item.type) : '');

    var primary = (item.roles && item.roles.length) ? roleHref(item.roles[0]) : 'credits.html';

    var overlay = '';
    if(item.roles && item.roles.length > 1){
      overlay = '<div class="role-overlay">' +
        item.roles.map(function(r){
          return '<a class="role-chip" href="' + roleHref(r) + '">' + esc(r.label) + '</a>';
        }).join('') +
      '</div>';
    }

    return (
      '<div class="work-tile" id="' + esc(base) + '">' +
        '<a class="thumb-link" href="' + primary + '" aria-label="' + esc(item.title || base) + '">' +
          pictureHTML(base, alt) +
        '</a>' +
        overlay +
      '</div>'
    );
  }

  function filterByRole(items, roleSlug){
    return (items || []).filter(function(it){
      return (it.roles || []).some(function(r){ return r.slug === roleSlug; });
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
  // Work grid
var grid = document.getElementById('workGrid');
if (grid && window.BDS_WORK_ITEMS) {
  var itemsToRender = window.BDS_WORK_ITEMS;

  // Only on the homepage: show Re-Recording Mixer titles
  if (document.body.classList.contains('home')) {
    itemsToRender = filterByRole(window.BDS_WORK_ITEMS, 're-recording-mixer');

    // Optional: newest first (blank years go last)
    itemsToRender.sort(function(a, b) {
      var ay = parseInt(a.year, 10) || 0;
      var by = parseInt(b.year, 10) || 0;
      return by - ay;
    });

    // Optional: cap how many show on homepage
    itemsToRender = itemsToRender.slice(0, 8); // change 8 if you want
  }

  // IMPORTANT: only show items with images in the gallery
  itemsToRender = itemsToRender.filter(function(it){ return it.basename; });

  grid.innerHTML = itemsToRender.map(tileHTML).join('');
}



// Role page thumbnails + credits list
var roleList = document.getElementById('roleCredits');
if (roleList && window.BDS_WORK_ITEMS) {
  var roleSlug = roleList.getAttribute('data-role');
  var items = filterByRole(window.BDS_WORK_ITEMS, roleSlug);

  // Optional: newest first (blank years go last)
  items.sort(function(a, b) {
    var ay = parseInt(a.year, 10) || 0;
    var by = parseInt(b.year, 10) || 0;
    return by - ay;
  });

  // 1) Thumbnail grid (only items that have images)
  var thumbGrid = document.getElementById('roleThumbGrid');
  if (thumbGrid) {
    var thumbItems = items.filter(function(it){ return it.basename; });
    thumbGrid.innerHTML = thumbItems.map(tileHTML).join('');
  }

  // 2) Full credits list (includes list-only)
  roleList.innerHTML = items.map(function(it){
    var meta = [it.year, it.type].filter(Boolean).join(' • ');
    return '<li><b>' + esc(it.title) + '</b>' + (meta ? (' — ' + esc(meta)) : '') + '</li>';
  }).join('');
}

  });
})();
