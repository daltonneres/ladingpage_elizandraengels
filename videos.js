(function () {
  "use strict";
  var v = document.getElementById("heroVideo");
  if (!v) return;
  var list = (v.getAttribute("data-playlist") || "").split(",");
  var dots = document.querySelectorAll("#heroDots i");
  var i = 0;

  function show() {
    dots.forEach(function (d, n) { d.classList.toggle("is-on", n === i); });
  }

  v.addEventListener("ended", function () {
    i = (i + 1) % list.length;
    v.src = list[i];
    v.play().catch(function () {});
    show();
  });

  // pausa quando o hero sai da tela (economiza bateria/dados)
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) v.play().catch(function () {});
        else v.pause();
      });
    }, { threshold: 0.2 }).observe(v);
  }
})();
