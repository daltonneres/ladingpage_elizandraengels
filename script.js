(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- sticky header state ---------- */
  var header = document.getElementById("siteHeader");
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 12) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- hero load sequence ---------- */
  var heroItems = document.querySelectorAll('[data-reveal="hero"]');
  heroItems.forEach(function (el, i) {
    el.style.setProperty("--i", i);
  });

  function playHero() {
    heroItems.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- scroll-triggered reveal for sections ---------- */
  var revealTargets = document.querySelectorAll("[data-reveal]:not([data-reveal='hero'])");

  if (reduceMotion) {
    heroItems.forEach(function (el) { el.classList.add("is-visible"); });
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    window.requestAnimationFrame(function () {
      setTimeout(playHero, 120);
    });

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
      );
      revealTargets.forEach(function (el) { observer.observe(el); });
    } else {
      revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
    }
  }

  /* ---------- service selector -> whatsapp order ---------- */
  var selectButtons = document.querySelectorAll(".card-select");
  var orderSummary = document.getElementById("orderSummary");
  var orderList = document.getElementById("orderList");
  var orderWhatsapp = document.getElementById("orderWhatsapp");
  var WHATSAPP_NUMBER = "5546999158339";
  var selected = [];

  function updateOrderSummary() {
    if (!orderSummary) return;

    if (selected.length === 0) {
      orderSummary.classList.remove("is-active");
      orderSummary.setAttribute("hidden", "");
      return;
    }

    orderSummary.removeAttribute("hidden");
    window.requestAnimationFrame(function () {
      orderSummary.classList.add("is-active");
    });

    if (orderList) orderList.textContent = selected.join(" · ");

    if (orderWhatsapp) {
      var intro = "Olá, Elizandra! Tenho interesse nos seguintes serviços:";
      var itemsText = selected.map(function (s) { return "- " + s; }).join("\n");
      var closing = "Pode me passar mais detalhes?";
      var message = intro + "\n" + itemsText + "\n\n" + closing;
      orderWhatsapp.href = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
    }
  }

  selectButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var service = btn.getAttribute("data-service");
      var isPressed = btn.getAttribute("aria-pressed") === "true";

      if (isPressed) {
        btn.setAttribute("aria-pressed", "false");
        selected = selected.filter(function (s) { return s !== service; });
      } else {
        btn.setAttribute("aria-pressed", "true");
        selected.push(service);
      }
      updateOrderSummary();
    });
  });

  /* ---------- timecode ticker in the hero viewfinder ---------- */
  var tcEl = document.getElementById("timecode");
  if (tcEl && !reduceMotion) {
    var frames = 0;
    function pad(n) { return String(n).padStart(2, "0"); }
    function tick() {
      frames += 1;
      var totalSeconds = Math.floor(frames / 24);
      var h = Math.floor(totalSeconds / 3600);
      var m = Math.floor((totalSeconds % 3600) / 60);
      var s = totalSeconds % 60;
      tcEl.textContent = pad(h) + ":" + pad(m) + ":" + pad(s);
      window.requestAnimationFrame(tick);
    }
    window.requestAnimationFrame(tick);
  }
})();
