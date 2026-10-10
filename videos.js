/* =========================================================
   Elizandra Engels — vídeos do hero
   Toca hero1 → hero2 → hero3 em sequência e repete.
   ========================================================= */
(function () {
  "use strict";

  var video = document.getElementById("heroVideo");
  if (!video) return;

  var playlist = (video.getAttribute("data-playlist") || "").split(",");
  var dots = document.querySelectorAll("#heroDots i");
  var current = 0;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function updateDots() {
    dots.forEach(function (dot, index) {
      dot.classList.toggle("is-on", index === current);
    });
  }

  function safePlay() {
    var attempt = video.play();
    if (attempt && attempt.catch) attempt.catch(function () {});
  }

  // Quem prefere menos movimento vê só a capa, sem autoplay
  if (reduceMotion) {
    video.removeAttribute("autoplay");
    video.pause();
    return;
  }

  // Ao terminar um vídeo, passa para o próximo
  video.addEventListener("ended", function () {
    current = (current + 1) % playlist.length;
    video.src = playlist[current];
    safePlay();
    updateDots();
  });

  // Pausa quando o hero sai da tela (economiza bateria e dados)
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) safePlay();
        else video.pause();
      });
    }, { threshold: 0.2 }).observe(video);
  }
})();