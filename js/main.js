/* سُفرة — main.js (no dependencies) */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const money = (n) => `${n.toLocaleString("en-US")} ج.م`;
  const img = (name) => `assets/img/${name}.jpg`;
  const waLink = (text) => `https://wa.me/${RESTAURANT.whatsapp}?text=${encodeURIComponent(text)}`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- storage (may be blocked in private mode) ---------- */
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } },
  };

  /* ---------- toast ---------- */
  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
  }

  /* ---------- cart ---------- */
  // cart = { key: qty } where key is "m<id>" for menu items or "o<id>" for offers
  let cart = store.get("sufra-cart", {});
  const findItem = (key) => {
    if (key.startsWith("m")) {
      const m = MENU.find((x) => x.id === +key.slice(1));
      return m && { name: m.name, price: m.price, img: m.img };
    }
    const o = OFFERS.find((x) => x.id === key.slice(1));
    return o && { name: o.title, price: o.price, img: o.img };
  };
  const cartLines = () => Object.entries(cart).map(([k, q]) => ({ key: k, qty: q, ...findItem(k) })).filter((l) => l.name);
  const subtotal = () => cartLines().reduce((s, l) => s + l.price * l.qty, 0);
  const delivery = (sub) => (sub === 0 || sub >= RESTAURANT.freeDeliveryOver ? 0 : RESTAURANT.deliveryFee);

  function setQty(key, qty) {
    if (qty <= 0) delete cart[key];
    else cart[key] = Math.min(qty, 50);
    store.set("sufra-cart", cart);
    renderCart();
    syncMenuButtons();
  }
  function addToCart(key) {
    setQty(key, (cart[key] || 0) + 1);
    const item = findItem(key);
    toast(`اتضاف للسلة: ${item.name}`);
    const c = $("#cartCount");
    c.classList.add("bump");
    setTimeout(() => c.classList.remove("bump"), 250);
  }

  function renderCart() {
    const lines = cartLines();
    const count = lines.reduce((s, l) => s + l.qty, 0);
    $("#cartCount").textContent = count;
    const body = $("#cartItems");
    if (!lines.length) {
      body.innerHTML = `<div class="cart-empty"><span>🍽️</span>السلة فاضية.. ضيف أصناف من المنيو.</div>`;
      $("#cartFoot").hidden = true;
      return;
    }
    $("#cartFoot").hidden = false;
    body.innerHTML = lines.map((l) => `
      <div class="cart-item">
        <img src="${img(l.img)}" alt="">
        <div><h4>${esc(l.name)}</h4><small>${money(l.price)} × ${l.qty}</small></div>
        <div class="qty"><button data-inc="${l.key}" aria-label="زوّد">+</button><span>${l.qty}</span><button data-dec="${l.key}" aria-label="قلّل">−</button></div>
      </div>`).join("");
    const sub = subtotal(), fee = delivery(sub);
    $("#subTotal").textContent = money(sub);
    $("#deliveryFee").textContent = fee ? money(fee) : "مجاني";
    $("#grandTotal").textContent = money(sub + fee);
  }

  function openCart() {
    $("#drawer").classList.add("open");
    $("#drawer").setAttribute("aria-hidden", "false");
    $("#overlay").hidden = false;
    document.body.style.overflow = "hidden";
    $("#cartClose").focus();
  }
  function closeCart() {
    $("#drawer").classList.remove("open");
    $("#drawer").setAttribute("aria-hidden", "true");
    $("#overlay").hidden = true;
    document.body.style.overflow = "";
  }

  function checkout() {
    const lines = cartLines();
    if (!lines.length) return;
    const address = $("#orderAddress").value.trim();
    if (address.length < 5) {
      $("#orderAddress").classList.add("invalid");
      $("#orderAddress").focus();
      toast("اكتب عنوان التوصيل الأول");
      return;
    }
    $("#orderAddress").classList.remove("invalid");
    store.set("sufra-address", address);
    const sub = subtotal(), fee = delivery(sub);
    const msg = [
      `أهلاً ${RESTAURANT.name}، عايز أطلب:`,
      ...lines.map((l) => `• ${l.name} × ${l.qty} = ${money(l.price * l.qty)}`),
      ``,
      `المجموع: ${money(sub)}`,
      `التوصيل: ${fee ? money(fee) : "مجاني"}`,
      `الإجمالي: ${money(sub + fee)}`,
      `العنوان: ${address}`,
    ].join("\n");
    window.open(waLink(msg), "_blank", "noopener");
  }

  /* ---------- menu ---------- */
  let activeCat = "all";
  let query = "";

  function renderTabs() {
    $("#tabs").innerHTML = CATEGORIES.map((c) =>
      `<button class="tab" role="tab" data-cat="${c.id}" aria-selected="${c.id === activeCat}">${c.name}</button>`).join("");
  }

  function dishButtons(key) {
    const q = cart[key] || 0;
    return q
      ? `<div class="qty"><button data-inc="${key}" aria-label="زوّد">+</button><span>${q}</span><button data-dec="${key}" aria-label="قلّل">−</button></div>`
      : `<button class="add-btn" data-add="${key}">أضف للسلة</button>`;
  }

  function renderMenu() {
    const q = query.trim();
    const items = MENU.filter((m) => (activeCat === "all" || m.cat === activeCat) &&
      (!q || m.name.includes(q) || m.desc.includes(q)));
    $("#menuEmpty").hidden = items.length > 0;
    const tagHtml = (t) => t === "popular" ? `<span class="tag tag--popular">الأكثر طلباً</span>` : t === "spicy" ? `<span class="tag tag--spicy">حار 🌶</span>` : "";
    $("#menuGrid").innerHTML = items.map((m) => `
      <article class="dish">
        <div class="dish__img"><img src="${img(m.img)}" alt="${esc(m.name)}" loading="lazy" width="800" height="600">
          <div class="dish__tags">${m.tags.map(tagHtml).join("")}</div></div>
        <div class="dish__body">
          <h3>${esc(m.name)}</h3>
          <p>${esc(m.desc)}</p>
          <div class="dish__foot"><span class="price">${m.price} <small>ج.م</small></span><span data-slot="m${m.id}">${dishButtons("m" + m.id)}</span></div>
        </div>
      </article>`).join("");
  }

  function syncMenuButtons() {
    $$("[data-slot]").forEach((s) => { s.innerHTML = dishButtons(s.dataset.slot); });
  }

  function renderOffers() {
    $("#offersGrid").innerHTML = OFFERS.map((o) => `
      <article class="offer reveal">
        <img src="${img(o.img)}" alt="" loading="lazy">
        <div class="offer__body">
          <span class="offer__badge">${esc(o.badge)}</span>
          <h3>${esc(o.title)}</h3>
          <p>${esc(o.desc)}</p>
          <div class="offer__foot">
            <span class="offer__price">${o.price} ج.م<del>${o.old}</del></span>
            <button class="btn btn--primary btn--sm" data-add="o${o.id}">اطلب العرض</button>
          </div>
        </div>
      </article>`).join("");
  }

  function renderReviews() {
    $("#reviewsGrid").innerHTML = REVIEWS.map((r) => `
      <article class="review reveal">
        <div class="review__stars" aria-label="${r.stars} من 5">${"★".repeat(r.stars)}${"☆".repeat(5 - r.stars)}</div>
        <p>“${esc(r.text)}”</p>
        <div class="review__who"><span class="review__avatar">${esc(r.name[0])}</span>${esc(r.name)}</div>
      </article>`).join("");
  }

  function renderInfo() {
    $("#hoursList").innerHTML = RESTAURANT.hours.map(([d, h]) => `<li><span>${d}</span><span>${h}</span></li>`).join("");
    $("#addr").textContent = RESTAURANT.address;
    $("#phoneText").textContent = RESTAURANT.phone;
    const hello = waLink(`أهلاً ${RESTAURANT.name}، عندي استفسار`);
    $("#waContact").href = hello;
    $("#waFloat").href = hello;
    $("#mapFrame").src = `https://maps.google.com/maps?q=${encodeURIComponent(RESTAURANT.mapQuery)}&z=14&output=embed`;
    $("#year").textContent = new Date().getFullYear();
    const saved = store.get("sufra-address", "");
    if (saved) $("#orderAddress").value = saved;
  }

  /* ---------- booking ---------- */
  function setupBooking() {
    const form = $("#bookingForm");
    const pad = (n) => String(n).padStart(2, "0");
    const today = new Date();
    const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    form.date.min = iso(today);
    const max = new Date(today); max.setDate(max.getDate() + 60);
    form.date.max = iso(max);
    form.date.value = iso(today);

    const slots = [];
    for (let h = 12; h <= 23; h++) for (const m of [0, 30]) slots.push(`${pad(h)}:${pad(m)}`);
    const label = (t) => { const [h, m] = t.split(":").map(Number); const h12 = h > 12 ? h - 12 : h; return `${h12}:${pad(m)} ${h < 12 ? "ص" : "م"}`; };
    form.time.innerHTML = slots.map((t) => `<option value="${t}">${label(t)}</option>`).join("");
    form.time.value = "20:00";

    $$(".stepper button", form).forEach((b) => b.addEventListener("click", () => {
      const v = Math.min(20, Math.max(1, (+form.guests.value || 1) + +b.dataset.step));
      form.guests.value = v;
    }));

    form.addEventListener("input", (e) => e.target.classList.remove("invalid"));
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const errors = [];
      const mark = (el, msg) => { el.classList.add("invalid"); errors.push(msg); };
      if (form.name.value.trim().length < 2) mark(form.name, "اكتب اسمك");
      if (!/^01[0125][0-9]{8}$/.test(form.phone.value.trim())) mark(form.phone, "رقم الموبايل لازم يكون 11 رقم ويبدأ بـ 01");
      if (!form.date.value || form.date.value < form.date.min || form.date.value > form.date.max) mark(form.date, "اختار تاريخ من النهارده لحد شهرين قدام");
      const g = +form.guests.value;
      if (!(g >= 1 && g <= 20)) mark(form.guests, "عدد الأفراد من 1 لـ 20");
      // can't book a time that already passed today
      if (form.date.value === iso(new Date())) {
        const now = new Date(); const [h, m] = form.time.value.split(":").map(Number);
        if (h * 60 + m < now.getHours() * 60 + now.getMinutes() + 30) mark(form.time, "اختار ميعاد بعد نص ساعة على الأقل من دلوقتي");
      }
      const err = $("#formError");
      if (errors.length) { err.textContent = errors[0]; err.hidden = false; form.querySelector(".invalid")?.focus(); return; }
      err.hidden = true;

      const dateTxt = new Date(form.date.value + "T00:00").toLocaleDateString("ar-EG-u-nu-latn", { weekday: "long", day: "numeric", month: "long" });
      const summary = `${form.name.value.trim()} — ${g} ${g > 2 && g < 11 ? "أفراد" : "فرد"}\n${dateTxt} الساعة ${label(form.time.value)}\n${form.area.value}`;
      const msg = [
        `أهلاً ${RESTAURANT.name}، عايز أحجز ترابيزة:`,
        `الاسم: ${form.name.value.trim()}`,
        `الموبايل: ${form.phone.value.trim()}`,
        `اليوم: ${dateTxt}`,
        `الساعة: ${label(form.time.value)}`,
        `عدد الأفراد: ${g}`,
        `المكان: ${form.area.value}`,
        form.notes.value.trim() ? `ملاحظات: ${form.notes.value.trim()}` : "",
      ].filter(Boolean).join("\n");
      $("#modalText").textContent = summary;
      $("#modalWa").href = waLink(msg);
      openModal();
      form.reset();
      form.date.value = iso(new Date());
      form.time.value = "20:00";
      form.guests.value = 2;
    });
  }
  function openModal() { $("#modal").hidden = false; $("#modalWa").focus(); }
  function closeModal() { $("#modal").hidden = true; }

  /* ---------- nav, scroll, reveal ---------- */
  function setupNav() {
    const burger = $("#burger"), nav = $("#nav");
    const setOpen = (o) => { nav.classList.toggle("open", o); burger.setAttribute("aria-expanded", o); };
    burger.addEventListener("click", () => setOpen(!nav.classList.contains("open")));
    $$(".nav__link").forEach((a) => a.addEventListener("click", () => setOpen(false)));

    const header = $("#header"), toTop = $("#toTop");
    const onScroll = () => {
      header.classList.toggle("scrolled", scrollY > 10);
      toTop.classList.toggle("show", scrollY > 700);
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));

    if ("IntersectionObserver" in window) {
      const links = $$(".nav__link");
      const spy = new IntersectionObserver((entries) => entries.forEach((en) => {
        if (en.isIntersecting) links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + en.target.id));
      }), { rootMargin: "-45% 0px -50% 0px" });
      $$("main section[id]").forEach((s) => spy.observe(s));
    }
  }

  function setupReveal() {
    const els = $$(".reveal");
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach((e) => io.observe(e));
  }

  /* ---------- events ---------- */
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-add],[data-inc],[data-dec],.tab");
    if (!t) return;
    if (t.dataset.add) addToCart(t.dataset.add);
    else if (t.dataset.inc) setQty(t.dataset.inc, (cart[t.dataset.inc] || 0) + 1);
    else if (t.dataset.dec) setQty(t.dataset.dec, (cart[t.dataset.dec] || 0) - 1);
    else if (t.classList.contains("tab")) { activeCat = t.dataset.cat; renderTabs(); renderMenu(); }
  });
  $("#search").addEventListener("input", (e) => { query = e.target.value; renderMenu(); });
  $("#cartOpen").addEventListener("click", openCart);
  $("#cartClose").addEventListener("click", closeCart);
  $("#overlay").addEventListener("click", closeCart);
  $("#checkout").addEventListener("click", checkout);
  $("#modalClose").addEventListener("click", closeModal);
  $("#modal").addEventListener("click", (e) => { if (e.target.id === "modal") closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeCart(); closeModal(); } });

  /* ---------- init ---------- */
  renderTabs();
  renderMenu();
  renderOffers();
  renderReviews();
  renderInfo();
  renderCart();
  setupBooking();
  setupNav();
  setupReveal();
})();
