// ─────────────────────────────────────────────
// SERVICE WORKER
// ─────────────────────────────────────────────
if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/sw.js")
      .then(function (reg) {
        console.log("SW registered:", reg.scope);
      })
      .catch(function (err) {
        console.log("SW registration failed:", err);
      });
  });
}

// ─────────────────────────────────────────────
// PWA INSTALL PROMPT
// ─────────────────────────────────────────────
let deferredPrompt;
const installBtn = document.getElementById("installBtn");

if (installBtn) {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = "flex";
  });

  installBtn.addEventListener("click", async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log("Install result:", outcome);
    deferredPrompt = null;
    installBtn.style.display = "none";
  });

  window.addEventListener("appinstalled", () => {
    console.log("PWA installed");
    installBtn.style.display = "none";
    deferredPrompt = null;
  });
}

// ─────────────────────────────────────────────
// MAIN APP LOGIC
// ─────────────────────────────────────────────
(function () {
  const allProfiles = [
    {
      name: "Margaret W.",
      age: 58,
      country: "🇺🇸 US",
      img: "https://randomuser.me/api/portraits/women/65.jpg",
      status: "looking",
      statusText: "Looking to talk 💬",
    },
    {
      name: "Robert H.",
      age: 62,
      country: "🇬🇧 UK",
      img: "https://randomuser.me/api/portraits/men/62.jpg",
      status: "typing",
      statusText: "typing…",
    },
    {
      name: "Helga S.",
      age: 55,
      country: "🇩🇪 DE",
      img: "https://randomuser.me/api/portraits/women/55.jpg",
      status: "looking",
      statusText: "Looking to talk 💬",
    },
    {
      name: "James M.",
      age: 64,
      country: "🇨🇦 CA",
      img: "https://randomuser.me/api/portraits/men/64.jpg",
      status: "typing",
      statusText: "typing…",
    },
    {
      name: "Karen P.",
      age: 51,
      country: "🇦🇺 AU",
      img: "https://randomuser.me/api/portraits/women/51.jpg",
      status: "looking",
      statusText: "Looking to talk 💬",
    },
    {
      name: "Lars E.",
      age: 60,
      country: "🇸🇪 SE",
      img: "https://randomuser.me/api/portraits/men/60.jpg",
      status: "looking",
      statusText: "Looking to talk 💬",
    },
    {
      name: "Ingrid O.",
      age: 57,
      country: "🇳🇴 NO",
      img: "https://randomuser.me/api/portraits/women/57.jpg",
      status: "typing",
      statusText: "typing…",
    },
    {
      name: "Pierre D.",
      age: 63,
      country: "🇫🇷 FR",
      img: "https://randomuser.me/api/portraits/men/63.jpg",
      status: "looking",
      statusText: "Looking to talk 💬",
    },
    {
      name: "Sofia R.",
      age: 54,
      country: "🇮🇹 IT",
      img: "https://randomuser.me/api/portraits/women/54.jpg",
      status: "looking",
      statusText: "Looking to talk 💬",
    },
    {
      name: "Anouk V.",
      age: 56,
      country: "🇳🇱 NL",
      img: "https://randomuser.me/api/portraits/women/56.jpg",
      status: "typing",
      statusText: "typing…",
    },
    {
      name: "William T.",
      age: 67,
      country: "🇺🇸 US",
      img: "https://randomuser.me/api/portraits/men/67.jpg",
      status: "looking",
      statusText: "Looking to talk 💬",
    },
    {
      name: "Diane K.",
      age: 59,
      country: "🇬🇧 UK",
      img: "https://randomuser.me/api/portraits/women/59.jpg",
      status: "looking",
      statusText: "Looking to talk 💬",
    },
    {
      name: "Thomas B.",
      age: 61,
      country: "🇩🇰 DK",
      img: "https://randomuser.me/api/portraits/men/61.jpg",
      status: "typing",
      statusText: "typing…",
    },
    {
      name: "Maria G.",
      age: 53,
      country: "🇪🇸 ES",
      img: "https://randomuser.me/api/portraits/women/53.jpg",
      status: "looking",
      statusText: "Looking to talk 💬",
    },
    {
      name: "Henrik L.",
      age: 66,
      country: "🇫🇮 FI",
      img: "https://randomuser.me/api/portraits/men/66.jpg",
      status: "looking",
      statusText: "Looking to talk 💬",
    },
    {
      name: "Clara P.",
      age: 52,
      country: "🇧🇪 BE",
      img: "https://randomuser.me/api/portraits/women/52.jpg",
      status: "typing",
      statusText: "typing…",
    },
    {
      name: "George R.",
      age: 65,
      country: "🇮🇪 IE",
      img: "https://randomuser.me/api/portraits/men/65.jpg",
      status: "looking",
      statusText: "Looking to talk 💬",
    },
    {
      name: "Elena M.",
      age: 50,
      country: "🇵🇹 PT",
      img: "https://randomuser.me/api/portraits/women/50.jpg",
      status: "looking",
      statusText: "Looking to talk 💬",
    },
    {
      name: "Oliver S.",
      age: 68,
      country: "🇨🇭 CH",
      img: "https://randomuser.me/api/portraits/men/68.jpg",
      status: "typing",
      statusText: "typing…",
    },
    {
      name: "Anna K.",
      age: 56,
      country: "🇦🇹 AT",
      img: "https://randomuser.me/api/portraits/women/56.jpg",
      status: "looking",
      statusText: "Looking to talk 💬",
    },
    {
      name: "Johan V.",
      age: 63,
      country: "🇳🇱 NL",
      img: "https://randomuser.me/api/portraits/men/63.jpg",
      status: "looking",
      statusText: "Looking to talk 💬",
    },
    {
      name: "Lisa N.",
      age: 54,
      country: "🇳🇿 NZ",
      img: "https://randomuser.me/api/portraits/women/54.jpg",
      status: "typing",
      statusText: "typing…",
    },
    {
      name: "Peter J.",
      age: 69,
      country: "🇺🇸 US",
      img: "https://randomuser.me/api/portraits/men/69.jpg",
      status: "looking",
      statusText: "Looking to talk 💬",
    },
    {
      name: "Catherine D.",
      age: 57,
      country: "🇬🇧 UK",
      img: "https://randomuser.me/api/portraits/women/57.jpg",
      status: "looking",
      statusText: "Looking to talk 💬",
    },
  ];

  function shuffleArray(arr) {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  function renderProfiles() {
    const grid = document.getElementById("profilesGrid");
    if (!grid) return;
    const shuffled = shuffleArray(allProfiles);
    const display = shuffled.slice(0, 12);
    grid.innerHTML = display
      .map(
        (p, i) => `
          <a href="https://lipahub.com/register.php?ref=MentorRoyalty" target="_blank" rel="noopener" class="profile-card" style="animation-delay:${i * 0.05}s" aria-label="Chat with ${p.name} from ${p.country}">
            <div class="pc-banner"></div>
            <div class="pc-body">
              <div class="pc-avatar-wrap">
                <img class="pc-avatar" src="${p.img}" alt="${p.name}, ${p.age}, from ${p.country}" loading="lazy" width="50" height="50" />
                <div class="pc-dot"></div>
              </div>
              <div class="pc-info">
                <div class="pc-name">${p.name} <span class="pc-age">· ${p.age}</span></div>
                <div class="pc-meta"><span class="pc-flag-badge">${p.country}</span></div>
                <div class="pc-status ${p.status}">
                  <span class="pc-sdot ${p.status}"></span> ${p.statusText}
                </div>
              </div>
            </div>
            <div class="pc-actions">
              <span class="btn-start-chat">💬 Chat</span>
              <span class="btn-watch-chat">👁 Watch</span>
            </div>
          </a>
        `,
      )
      .join("");
  }

  renderProfiles();
  setInterval(renderProfiles, 8000);

  const tickerItems = [
    { name: "Aisha M.", amt: "$34.50", method: "M-Pesa" },
    { name: "John K.", amt: "$18.00", method: "Bank" },
    { name: "Fatima B.", amt: "$62.00", method: "MoMo" },
    { name: "Emeka O.", amt: "$27.50", method: "PayPal" },
    { name: "Grace N.", amt: "$45.00", method: "M-Pesa" },
    { name: "David A.", amt: "$89.00", method: "Bank" },
    { name: "Amina S.", amt: "$21.00", method: "MoMo" },
    { name: "Kweku T.", amt: "$53.50", method: "M-Pesa" },
    { name: "Brian M.", amt: "$71.00", method: "Bank" },
    { name: "Lydia K.", amt: "$38.00", method: "PayPal" },
    { name: "Sarah J.", amt: "$56.00", method: "M-Pesa" },
    { name: "Kevin O.", amt: "$42.00", method: "M-Pesa" },
    { name: "Mary W.", amt: "$76.50", method: "Bank" },
    { name: "Samuel N.", amt: "$29.00", method: "MoMo" },
    { name: "Zainab H.", amt: "$55.00", method: "PayPal" },
    { name: "Peter K.", amt: "$93.50", method: "M-Pesa" },
    { name: "Esther A.", amt: "$36.00", method: "Bank" },
    { name: "Ibrahim M.", amt: "$68.00", method: "MoMo" },
    { name: "Mercy T.", amt: "$47.50", method: "M-Pesa" },
    { name: "Daniel O.", amt: "$81.00", method: "Bank" },
    { name: "Hawa S.", amt: "$24.50", method: "PayPal" },
    { name: "Collins B.", amt: "$59.00", method: "M-Pesa" },
    { name: "Nadia K.", amt: "$33.50", method: "MoMo" },
    { name: "Joseph A.", amt: "$105.00", method: "Bank" },
    { name: "Wanjiku N.", amt: "$41.00", method: "M-Pesa" },
    { name: "Mohamed T.", amt: "$72.50", method: "PayPal" },
    { name: "Ruth M.", amt: "$28.00", method: "MoMo" },
    { name: "George K.", amt: "$64.00", method: "Bank" },
    { name: "Halima B.", amt: "$49.50", method: "M-Pesa" },
    { name: "Victor O.", amt: "$87.00", method: "PayPal" },
    { name: "Sharon W.", amt: "$35.00", method: "MoMo" },
    { name: "Brian K.", amt: "$46.00", method: "M-Pesa" },
    { name: "Alice N.", amt: "$31.50", method: "Bank" },
    { name: "Mark O.", amt: "$74.00", method: "PayPal" },
    { name: "Lucy W.", amt: "$52.00", method: "MoMo" },
    { name: "Dennis M.", amt: "$39.50", method: "M-Pesa" },
    { name: "Naomi A.", amt: "$67.00", method: "Bank" },
    { name: "Eric K.", amt: "$91.00", method: "PayPal" },
    { name: "Faith J.", amt: "$43.00", method: "M-Pesa" },
  ];

  const tickerTrack = document.getElementById("tickerTrack");
  if (tickerTrack) {
    const doubled = [...tickerItems, ...tickerItems];
    tickerTrack.innerHTML = doubled
      .map(
        (t) => `
          <div class="t-item">
            <div class="t-check">
              <svg viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" /></svg>
            </div>
            <strong>${t.name}</strong> withdrew <span class="t-amt">${t.amt}</span> · ${t.method}
          </div>
        `,
      )
      .join("");
  }

  document.querySelectorAll(".faq-q").forEach((btn) => {
    btn.addEventListener("click", function () {
      const item = this.closest(".faq-item");
      if (!item) return;
      const wasOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach((i) => {
        i.classList.remove("open");
        const q = i.querySelector(".faq-q");
        if (q) q.setAttribute("aria-expanded", "false");
      });
      if (!wasOpen) {
        item.classList.add("open");
        this.setAttribute("aria-expanded", "true");
      }
    });
  });

  let heroCount = 12547;
  let totalPaid = 1284902;
  let totalUsers = 80432;

  function animateValue(el, value, isCurrency = false) {
    if (!el) return;
    el.classList.add("updating");
    el.textContent = isCurrency
      ? "$" + value.toLocaleString()
      : value.toLocaleString();
    setTimeout(() => {
      el.classList.remove("updating");
    }, 450);
  }

  function updateStats() {
    const heroChange = Math.floor(Math.random() * 31) - 10;
    heroCount = Math.max(12100, heroCount + heroChange);
    const headerCount = document.getElementById("headerOnlineCount");
    if (headerCount) headerCount.textContent = heroCount.toLocaleString();
    const statOnline = Math.floor(heroCount / 7.5);
    const statOnlineEl = document.getElementById("statOnline");
    if (statOnlineEl) statOnlineEl.textContent = statOnline.toLocaleString();
    const paidIncrease = Math.floor(Math.random() * 18) + 4;
    totalPaid += paidIncrease;
    animateValue(document.getElementById("statPaid"), totalPaid, true);
    if (Math.random() > 0.55) {
      totalUsers += Math.floor(Math.random() * 3) + 1;
      animateValue(document.getElementById("statUsers"), totalUsers);
      const heroUsers = document.getElementById("heroTotalUsers");
      if (heroUsers) heroUsers.textContent = totalUsers.toLocaleString();
    }
    const moreCount =
      Math.floor(heroCount / 3.5) + Math.floor(Math.random() * 30);
    const moreBadge = document.getElementById("moreCountBadge");
    if (moreBadge) moreBadge.textContent = "+" + moreCount.toLocaleString();
  }

  updateStats();
  setInterval(updateStats, 3200);

  const toastData = [
    ["Aisha M.", "$34.50", "M-Pesa"],
    ["Kelvin O.", "$22.00", "M-Pesa"],
    ["Fatima B.", "$62.00", "MoMo"],
    ["Emeka O.", "$27.50", "PayPal"],
    ["Grace N.", "$45.00", "M-Pesa"],
    ["David A.", "$89.00", "Bank"],
    ["Amina S.", "$21.00", "MoMo"],
    ["Kweku T.", "$53.50", "M-Pesa"],
    ["Sipho D.", "$118.00", "Bank"],
    ["Amaka N.", "$37.00", "PayPal"],
    ["Brian M.", "$29.50", "M-Pesa"],
    ["Lydia K.", "$44.00", "MoMo"],
  ];

  let toastIdx = 0;
  const toastWrap = document.getElementById("toastWrap");

  function showToast() {
    if (!toastWrap) return;
    const d = toastData[toastIdx++ % toastData.length];
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = `
          <div class="t-icon">
            <svg viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" /></svg>
          </div>
          <div class="t-body">
            <div class="t-line"><strong>${d[0]}</strong> withdrew <span class="t-green">${d[1]}</span> · ${d[2]}</div>
          </div>
          <div class="t-ago">${Math.floor(Math.random() * 3) + 1}m ago</div>
        `;
    toastWrap.appendChild(el);
    while (toastWrap.children.length > 2) {
      toastWrap.removeChild(toastWrap.firstChild);
    }
    setTimeout(() => {
      el.classList.add("out");
      setTimeout(() => {
        el.remove();
      }, 350);
    }, 4000);
    setTimeout(showToast, 5500 + Math.random() * 3500);
  }

  setTimeout(showToast, 2000);
})();

// ─────────────────────────────────────────────
// MOBILE MENU
// ─────────────────────────────────────────────
(function () {
  const btn = document.getElementById("menuBtn");
  const nav = document.getElementById("primaryNav");
  if (!btn || !nav) return;
  const setOpen = (open) => {
    nav.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    btn.firstElementChild.className = open ? "fas fa-xmark" : "fas fa-bars";
  };
  btn.addEventListener("click", () => setOpen(!nav.classList.contains("open")));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
  document.addEventListener("click", (e) => { if (!nav.contains(e.target) && !btn.contains(e.target)) setOpen(false); });
  window.matchMedia("(min-width: 901px)").addEventListener("change", () => setOpen(false));
})();
