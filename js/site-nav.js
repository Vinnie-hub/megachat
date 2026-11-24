(function () {
  "use strict";
  var nav = document.querySelector(".header-nav");
  var right = document.querySelector(".header-right");
  if (!nav || !right) return;
  if (!nav.id) nav.id = "primaryNav";
  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "menu-btn";
  btn.setAttribute("aria-label", "Open menu");
  btn.setAttribute("aria-expanded", "false");
  btn.setAttribute("aria-controls", nav.id);
  btn.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
  right.appendChild(btn);
  function setOpen(open) {
    nav.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    btn.firstChild.className = open ? "fas fa-xmark" : "fas fa-bars";
  }
  btn.addEventListener("click", function () { setOpen(!nav.classList.contains("open")); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
  document.addEventListener("click", function (e) { if (!nav.contains(e.target) && !btn.contains(e.target)) setOpen(false); });
  window.matchMedia("(min-width: 901px)").addEventListener("change", function () { setOpen(false); });
})();
