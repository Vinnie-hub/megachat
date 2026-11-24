(function () {
  "use strict";

  /* Footer year */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* FAQ accordion */
  document.querySelectorAll(".faq-q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".faq-item");
      var wasOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach(function (i) {
        i.classList.remove("open");
        i.querySelector(".faq-q").setAttribute("aria-expanded", "false");
      });
      if (!wasOpen) {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* Track which task people pick (Google Analytics) */
  document.querySelectorAll("[data-task]").forEach(function (a) {
    a.addEventListener("click", function () {
      if (typeof gtag === "function") {
        gtag("event", "select_task", { task: a.getAttribute("data-task") });
      }
    });
  });

  /* Track registration clicks */
  document.querySelectorAll("[data-register]").forEach(function (a) {
    a.addEventListener("click", function () {
      if (typeof gtag === "function")
        gtag("event", "click_register", { location: "header" });
    });
  });

  /* PWA install */
  var installBtn = document.getElementById("installBtn");
  var deferred = null;
  var standalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone;
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    deferred = e;
    if (!standalone && installBtn) installBtn.hidden = false;
  });
  if (installBtn) {
    installBtn.addEventListener("click", function () {
      if (!deferred) return;
      deferred.prompt();
      deferred.userChoice.then(function () {
        deferred = null;
        installBtn.hidden = true;
      });
    });
  }
  window.addEventListener("appinstalled", function () {
    if (installBtn) installBtn.hidden = true;
  });

  /* Service worker */
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("/sw.js").catch(function () {});
    });
  }
})();
