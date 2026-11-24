(function () {
  "use strict";

  /* ============ SETTINGS ============ */
  const REGISTER_URL = "https://lipahub.com/register.php?ref=mentorroyalty";
  const PAGE_SIZE = 6;
  const ROTATE_MS = 7000;

  /* ============ HOTELS ============
     pay = KSh earned per review of this hotel (keep these accurate). */
  const HOTELS = [
    { id: 1,  type: "dining", pay: 420, title: "Classic dining room",           name: "", location: "", blurb: "White-linen tables and warm lighting." },
    { id: 2,  type: "room", pay: 560,   title: "Sea-view bedroom suite",        name: "", location: "", blurb: "Plush bedding and a window onto the water." },
    { id: 3,  type: "city", pay: 550,   title: "High-rise city hotel",          name: "", location: "", blurb: "A glass-fronted tower, glowing at dusk." },
    { id: 4,  type: "resort", pay: 600, title: "Courtyard hotel with pool",     name: "", location: "", blurb: "Landscaped gardens and a lagoon-style pool." },
    { id: 5,  type: "room", pay: 500,   title: "Suite with vaulted ceiling",    name: "", location: "", blurb: "A spacious lounge under a chandelier." },
    { id: 6,  type: "resort", pay: 520, title: "Pool terrace at dusk",          name: "", location: "", blurb: "Terraced rooms wrapped around a glowing pool." },
    { id: 7,  type: "resort", pay: 480, title: "Beachfront resort",             name: "", location: "", blurb: "Sun loungers and palms on soft sand." },
    { id: 8,  type: "city", pay: 340,   title: "City hotel with resort pool",   name: "", location: "", blurb: "Modern rooms and a palm-lined pool deck." },
    { id: 9,  type: "dining", pay: 400, title: "Modern restaurant",             name: "", location: "", blurb: "A bright dining room with timber furniture." },
    { id: 10, type: "dining", pay: 300, title: "Rattan-lit lounge restaurant",  name: "", location: "", blurb: "Woven lighting over relaxed lounge seating." },
    { id: 11, type: "dining", pay: 300, title: "Timber lounge & dining",        name: "", location: "", blurb: "A warm, wood-toned dining space." },
    { id: 12, type: "dining", pay: 450, title: "Skyline-view restaurant",       name: "", location: "", blurb: "Large windows and a view over the city." },
    { id: 13, type: "dining", pay: 380, title: "Garden-style restaurant",       name: "", location: "", blurb: "Plants and natural textures throughout." },
    { id: 14, type: "resort", pay: 450, title: "Resort entrance & water feature", name: "", location: "", blurb: "A grand arrival with a cascading waterfall." },
    { id: 15, type: "resort", pay: 350, title: "Tropical pool deck",            name: "", location: "", blurb: "A thatched lounge, palms and ocean breezes." },
    { id: 16, type: "resort", pay: 320, title: "Beach resort from above",       name: "", location: "", blurb: "White sand and a calm lagoon." },
    { id: 17, type: "resort", pay: 400, title: "Palm-lined pool & balconies",   name: "", location: "", blurb: "Balconied rooms around a sunny pool." },
    { id: 18, type: "room", pay: 460,   title: "Spacious lounge suite",         name: "", location: "", blurb: "Ornate décor and a cosy sitting area." },
    { id: 19, type: "room", pay: 410,   title: "Twin guest room",               name: "", location: "", blurb: "A bright room with blue accents and a fruit welcome." },
    { id: 20, type: "resort", pay: 580, title: "Large resort with lagoon pools", name: "", location: "", blurb: "Pools and a lazy river across a big resort." }
  ];

  const TYPE_LABEL = { resort: "Resort & pool", city: "City hotel", room: "Rooms & suites", dining: "Dining" };

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  /* ============ REFERRAL LINKS ============ */
  document.querySelectorAll("[data-register]").forEach((a) => (a.href = REGISTER_URL));

  /* ============ LIVE HOTEL GRID (shuffles like the live profiles on /chat) ============ */
  const SHOW = 12;
  const REFRESH_MS = 8000;
  const grid = document.getElementById("hotelGrid");
  const emptyMsg = document.getElementById("gridEmpty");
  const moreCount = document.getElementById("moreCount");
  const filterBar = document.getElementById("filterBar");
  const shuffleBtn = document.getElementById("shuffleBtn");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const CHECKLIST = {
    resort: ["Pool, beach or garden facilities", "Family and leisure activities", "Room types and views", "Guest comments on service and upkeep"],
    city: ["Location and access to transport", "Business and meeting facilities", "Room comfort and noise levels", "Guest comments on check-in and staff"],
    room: ["Bed, bedding and room size", "Cleanliness standards", "In-room amenities and Wi-Fi", "Guest comments on comfort and value"],
    dining: ["Menu variety and food quality", "Ambience and seating", "Service speed and friendliness", "Guest comments on value for money"]
  };

  let filter = "all";
  let paused = false;
  let timer = null;
  let swapTimer = null;
  let inView = true;
  let current = [];

  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const pool = () => HOTELS.filter((h) => filter === "all" || h.type === filter);

  const card = (h, i) => {
    const heading = h.name || h.title;
    const alt = h.name ? `${h.name}${h.location ? ", " + h.location : ""}` : h.title;
    return `
      <article class="hotel-card" style="animation-delay:${i * 50}ms" data-id="${h.id}">
        <div class="hotel-media">
          <img src="/assets/hotels/hotel-${h.id}.webp" alt="${esc(alt)}" loading="${i < 4 ? "eager" : "lazy"}" decoding="async" width="640" height="440" />
          <span class="hotel-tag">${esc(TYPE_LABEL[h.type])}</span>
          <span class="hotel-status"><span class="s-dot" aria-hidden="true"></span> Open for review</span>
          <span class="hotel-pay"><small>Earn</small><b>KSh ${h.pay}</b><small>per review</small></span>
        </div>
        <div class="hotel-body">
          <h3>${esc(heading)}</h3>
          ${h.location ? `<div class="hotel-loc"><i class="fas fa-location-dot" aria-hidden="true"></i> ${esc(h.location)}</div>` : ""}
          <p>${esc(h.blurb)}</p>
          <div class="hotel-actions">
            <a class="btn btn-success hotel-btn" href="${REGISTER_URL}" target="_blank" rel="sponsored noopener" aria-label="Review ${esc(heading)}">
              <i class="fas fa-pen" aria-hidden="true"></i> <span>Review</span>
            </a>
            <button type="button" class="btn btn-soft hotel-btn js-preview" data-id="${h.id}" aria-label="Preview ${esc(heading)}">
              <i class="fas fa-eye" aria-hidden="true"></i> <span>Preview</span>
            </button>
          </div>
        </div>
      </article>`;
  };

  function render() {
    const p = pool();
    current = shuffle(p).slice(0, SHOW);
    grid.innerHTML = current.map(card).join("");
    if (emptyMsg) emptyMsg.hidden = current.length > 0;
  }

  function refresh() {
    clearTimeout(swapTimer);
    if (reduceMotion) return render();
    grid.classList.add("out");
    swapTimer = setTimeout(() => { render(); grid.classList.remove("out"); }, 300);
  }

  const stop = () => { clearInterval(timer); timer = null; };
  const start = () => {
    stop();
    if (!reduceMotion && !paused && inView && !document.hidden && pool().length > SHOW) timer = setInterval(refresh, REFRESH_MS);
  };

  grid.addEventListener("mouseenter", () => { paused = true; stop(); });
  grid.addEventListener("mouseleave", () => { paused = false; start(); });
  grid.addEventListener("focusin", () => { paused = true; stop(); });
  grid.addEventListener("focusout", () => { paused = false; start(); });
  grid.addEventListener("touchstart", () => { paused = true; stop(); }, { passive: true });
  grid.addEventListener("touchend", () => setTimeout(() => { paused = false; start(); }, 5000), { passive: true });
  document.addEventListener("visibilitychange", start);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries) => { inView = entries[0].isIntersecting; inView ? start() : stop(); }, { threshold: 0.1 }).observe(grid);
  }

  filterBar.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip[data-filter]");
    if (!chip) return;
    filter = chip.dataset.filter;
    filterBar.querySelectorAll(".chip[data-filter]").forEach((c) => {
      const on = c === chip;
      c.classList.toggle("is-active", on);
      c.setAttribute("aria-pressed", String(on));
    });
    refresh();
    start();
  });
  shuffleBtn.addEventListener("click", () => { refresh(); start(); });

  /* ============ PREVIEW DIALOG ============ */
  const dlg = document.getElementById("hotelDialog");
  const dlgClose = document.getElementById("dlgClose");
  let lastFocus = null;

  function openPreview(id) {
    const h = HOTELS.find((x) => x.id === Number(id));
    if (!h || !dlg) return;
    lastFocus = document.activeElement;
    const heading = h.name || h.title;
    document.getElementById("dlgImg").src = `/assets/hotels/hotel-${h.id}.webp`;
    document.getElementById("dlgImg").alt = heading;
    document.getElementById("dlgTag").textContent = TYPE_LABEL[h.type];
    document.getElementById("dlgTitle").textContent = heading;
    document.getElementById("dlgBlurb").textContent = h.blurb;
    document.getElementById("dlgPay").textContent = "KSh " + h.pay;
    document.getElementById("dlgList").innerHTML = CHECKLIST[h.type].map((t) => `<li><i class="fas fa-check" aria-hidden="true"></i> ${esc(t)}</li>`).join("");
    document.getElementById("dlgCta").href = REGISTER_URL;
    paused = true; stop();
    if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
    document.documentElement.classList.add("dlg-open");
    if (typeof window.gtag === "function") window.gtag("event", "preview_hotel", { hotel_id: h.id });
  }
  function closePreview() {
    if (typeof dlg.close === "function") dlg.close(); else dlg.removeAttribute("open");
  }
  grid.addEventListener("click", (e) => {
    const b = e.target.closest(".js-preview");
    if (b) openPreview(b.dataset.id);
  });
  if (dlg) {
    dlgClose.addEventListener("click", closePreview);
    dlg.addEventListener("click", (e) => { if (e.target === dlg) closePreview(); });
    dlg.addEventListener("close", () => {
      document.documentElement.classList.remove("dlg-open");
      paused = false; start();
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    });
  }

  render();
  start();

  /* ============ FAQ ============ */
  document.querySelectorAll(".faq-q").forEach((btn) => {
    btn.addEventListener("click", function () {
      const item = this.closest(".faq-item");
      const wasOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach((i) => {
        i.classList.remove("open");
        i.querySelector(".faq-q").setAttribute("aria-expanded", "false");
      });
      if (!wasOpen) {
        item.classList.add("open");
        this.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ============ FOOTER YEAR ============ */
  const yearEl = document.getElementById("currentYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============ STATS + TICKER (built from the real listings above) ============ */
  /* "more hotels inside" counter drifts between 300 and 400 */
  if (moreCount) {
    let n = 300 + Math.floor(Math.random() * 101);
    const showCount = () => {
      moreCount.classList.add("updating");
      moreCount.textContent = "+" + n.toLocaleString();
      setTimeout(() => moreCount.classList.remove("updating"), 450);
    };
    showCount();
    setInterval(() => {
      n += Math.floor(Math.random() * 15) - 7;
      n = Math.min(400, Math.max(300, n));
      showCount();
    }, 3200);
  }

  const tickerTrack = document.getElementById("tickerTrack");
  if (tickerTrack) {
    const items = HOTELS.map(
      (h) => `<div class="t-item"><i class="fas fa-hotel" aria-hidden="true"></i><strong>${esc(h.name || h.title)}</strong> · earn <span class="t-amt">KSh ${h.pay}</span> per review</div>`
    );
    tickerTrack.innerHTML = items.concat(items).join("");
  }

  /* ============ MOBILE MENU ============ */
  const menuBtn = document.getElementById("menuBtn");
  const nav = document.getElementById("primaryNav");
  if (menuBtn && nav) {
    const setOpen = (open) => {
      nav.classList.toggle("open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      menuBtn.firstElementChild.className = open ? "fas fa-xmark" : "fas fa-bars";
    };
    menuBtn.addEventListener("click", () => setOpen(!nav.classList.contains("open")));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
    document.addEventListener("click", (e) => { if (!nav.contains(e.target) && !menuBtn.contains(e.target)) setOpen(false); });
    window.matchMedia("(min-width: 901px)").addEventListener("change", () => setOpen(false));
  }

  /* ============ ANALYTICS: registration clicks ============ */
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-register], .hotel-btn");
    if (a && typeof window.gtag === "function") window.gtag("event", "click_register", { location: a.classList.contains("hotel-btn") ? "hotel_card" : "hotels_page" });
  });

  /* ============ PWA INSTALL ============ */
  const installButtons = [document.getElementById("installBtn"), ...document.querySelectorAll(".js-install-btn")].filter(Boolean);
  const setInstallVisible = (show) => installButtons.forEach((b) => (b.hidden = !show));
  let deferredInstallPrompt = null;
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;

  if (isStandalone) setInstallVisible(false);

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    if (!isStandalone) setInstallVisible(true);
  });

  installButtons.forEach((btn) =>
    btn.addEventListener("click", async () => {
      if (!deferredInstallPrompt) return;
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      setInstallVisible(false);
    })
  );

  window.addEventListener("appinstalled", () => setInstallVisible(false));

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    });
  }
})();
