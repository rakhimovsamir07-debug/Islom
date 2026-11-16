// ===== Filiallar ma'lumoti (TODO: aniq manzil, ish vaqti va telefonlarni kiriting) =====
const BRANCHES = [
  { name: "Chirchiq",   addr: "Chirchiq shahri (aniq manzil kiritiladi)", time: "Du–Sha, 08:00 – 19:00", phone: "+998917123300", phoneText: "91 712-33-00", lat: 41.4737983,  lng: 69.5866066 },
  { name: "Qibray",     addr: "Qibray tumani (aniq manzil kiritiladi)",   time: "Du–Sha, 08:00 – 19:00", phone: "+998917123300", phoneText: "91 712-33-00", lat: 41.38648512, lng: 69.46033597 },
  { name: "G'azalkent", addr: "G'azalkent shahri (aniq manzil kiritiladi)", time: "Du–Sha, 08:00 – 19:00", phone: "+998917123300", phoneText: "91 712-33-00", lat: null, lng: null, query: "Buxoro Med Academy G'azalkent" },
];

// ===== Mobil menyu =====
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");
const setMenu = (open) => {
  nav.classList.toggle("is-open", open);
  burger.setAttribute("aria-expanded", String(open));
};
burger.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

// ===== Hisoblagichlar: HTML'da yakuniy qiymat turadi, animatsiya faqat bezak =====
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduce && "IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const to = +el.dataset.to, suffix = el.dataset.suffix || "";
      const start = performance.now(), dur = 1400;
      const tick = (t) => {
        const p = Math.min((t - start) / dur, 1);
        el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll(".count").forEach((el) => io.observe(el));
}

// ===== Natijalar tablari =====
document.querySelectorAll("[data-tab]").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("[data-tab]").forEach((b) => {
      const on = b === btn;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-selected", String(on));
    });
    document.querySelectorAll("[data-panel]").forEach((p) => (p.hidden = p.dataset.panel !== btn.dataset.tab));
  });
});

// ===== Filiallar tablari =====
const showBranch = (i) => {
  const b = BRANCHES[i];
  const q = b.lat ? `${b.lat},${b.lng}` : encodeURIComponent(b.query);
  document.getElementById("b-addr").textContent = b.addr;
  document.getElementById("b-time").textContent = b.time;
  const ph = document.getElementById("b-phone");
  ph.textContent = b.phoneText;
  ph.href = "tel:" + b.phone;
  document.getElementById("b-route").href = `https://www.google.com/maps/search/?api=1&query=${q}`;
  document.getElementById("b-map").src = `https://maps.google.com/maps?q=${q}&z=16&output=embed`;
  document.getElementById("b-map").title = `${b.name} filiali xaritasi`;
};
document.querySelectorAll("[data-branch]").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("[data-branch]").forEach((b) => {
      const on = b === btn;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-selected", String(on));
    });
    showBranch(+btn.dataset.branch);
  });
});
showBranch(0);

// ===== Kurslar: kartochkalarni kurslar.js dagi ma'lumot bilan to'ldirish =====
const COURSES = window.COURSES || {};
const show = (v, fallback = "—") => (v == null || v === "" ? fallback : v);
const PRICE_EMPTY = "Narxini so'rang";

document.querySelectorAll(".course[data-id]").forEach((card) => {
  const c = COURSES[card.dataset.id];
  if (!c) return;
  card.querySelector('[data-f="name"]').textContent = c.name;
  card.querySelector('[data-f="cat"]').textContent = c.cat;
  card.querySelector('[data-f="duration"]').textContent = show(c.duration);
  card.querySelector('[data-f="perWeek"]').textContent = show(c.perWeek);
  card.querySelector('[data-f="price"]').textContent = show(c.price, PRICE_EMPTY);
  card.querySelector(".course__go").setAttribute("aria-label", `${c.name} kursiga yozilish`);
  card.querySelector(".course__more").setAttribute("aria-label", `${c.name} kursi haqida batafsil`);
});

// Formada kursni avtomatik tanlash
const pickCourse = (id) => {
  const c = COURSES[id];
  if (c) document.getElementById("course-select").value = c.name;
};
document.querySelectorAll("[data-enroll]").forEach((a) => a.addEventListener("click", (e) => {
  e.stopPropagation();
  pickCourse(a.dataset.enroll);
}));

// ===== Kurs haqida oyna =====
const modal = document.getElementById("cmodal");
let openedId = null, lastFocus = null;
const fillList = (el, items) => {
  el.replaceChildren(...(items || []).map((t) => Object.assign(document.createElement("li"), { textContent: t })));
};
function openCourse(id) {
  const c = COURSES[id];
  if (!c || !modal) return;
  openedId = id;
  lastFocus = document.activeElement;
  const $ = (s) => document.getElementById(s);
  $("cm-icon").textContent = c.icon || "";
  $("cm-cat").textContent = c.cat;
  $("cm-name").textContent = c.name;
  $("cm-for").textContent = c.for || "";
  $("cm-duration").textContent = show(c.duration);
  $("cm-perWeek").textContent = show(c.perWeek);
  $("cm-lesson").textContent = show(c.lesson);
  $("cm-group").textContent = show(c.group);
  $("cm-price").textContent = show(c.price, PRICE_EMPTY);
  $("cm-note").textContent = c.priceNote || "";
  fillList($("cm-topics"), c.topics);
  fillList($("cm-perks"), c.perks);
  modal.querySelector(".cmodal__head").className = "cmodal__head cmodal__head--" + id;
  modal.showModal();
  document.body.classList.add("no-scroll");
}
function closeCourse() {
  if (modal.open) modal.close();
}
if (modal) {
  modal.addEventListener("close", () => {
    document.body.classList.remove("no-scroll");
    if (lastFocus) lastFocus.focus();
  });
  document.getElementById("cm-close").addEventListener("click", closeCourse);
  // Oyna tashqarisiga bosilsa yopiladi
  modal.addEventListener("click", (e) => { if (e.target === modal) closeCourse(); });
  document.getElementById("cm-enroll").addEventListener("click", (e) => {
    e.preventDefault();
    pickCourse(openedId);
    lastFocus = null;
    closeCourse();
    document.getElementById("royxat").scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    document.querySelector('#form input[name="name"]').focus({ preventScroll: true });
  });
}
document.querySelectorAll(".course[data-id]").forEach((card) => {
  card.addEventListener("click", (e) => {
    if (e.target.closest("[data-enroll]")) return;
    openCourse(card.dataset.id);
  });
});

// ===== Telefon maskasi: 90 123 45 67 =====
const phoneInput = document.querySelector('input[name="phone"]');
phoneInput.addEventListener("input", () => {
  const d = phoneInput.value.replace(/\D/g, "").slice(0, 9);
  phoneInput.value = [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean).join(" ");
});

// ===== Forma =====
// So'rov serverdagi /api/lead ga ketadi, server uni Telegram'ga yuboradi (server.js).
async function sendLead(data) {
  try {
    const r = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const res = await r.json().catch(() => ({}));
    return res.ok ? { ok: true } : { ok: false, error: res.error };
  } catch {
    return { ok: false };
  }
}
const form = document.getElementById("form");
const err = document.getElementById("form-err");
const submitBtn = form.querySelector('button[type="submit"]');
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (submitBtn.disabled) return;
  const name = form.elements.name.value.trim();
  const digits = phoneInput.value.replace(/\D/g, "");
  form.elements.name.setAttribute("aria-invalid", String(name.length < 2));
  phoneInput.setAttribute("aria-invalid", String(digits.length !== 9));
  if (name.length < 2 || digits.length !== 9) {
    err.textContent = "Iltimos, ismingizni va 9 xonali telefon raqamingizni kiriting.";
    err.hidden = false;
    return;
  }
  err.hidden = true;
  submitBtn.disabled = true;
  submitBtn.textContent = "Yuborilmoqda…";
  const res = await sendLead({
    name,
    phone: "+998" + digits,
    course: form.course.value || "Maslahat kerak",
    branch: form.branch.value,
    website: form.elements.website.value, // honeypot
  });
  if (res.ok) {
    submitBtn.hidden = true;
    document.getElementById("form-ok").hidden = false;
  } else {
    submitBtn.disabled = false;
    submitBtn.textContent = "Ro'yxatdan o'tish";
    err.textContent = (res.error ? res.error + ". " : "Xatolik yuz berdi. ") + "Iltimos, 91 712-33-00 raqamiga qo'ng'iroq qiling.";
    err.hidden = false;
  }
});

// ===== Mobil "Bepul konsultatsiya" tugmasi forma ko'ringanda yashirinadi =====
const sticky = document.querySelector(".sticky-cta");
if ("IntersectionObserver" in window) {
  new IntersectionObserver(([e]) => sticky.classList.toggle("is-hidden", e.isIntersecting), { threshold: 0.1 })
    .observe(document.getElementById("royxat"));
}

document.getElementById("year").textContent = new Date().getFullYear();
