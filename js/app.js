/* ════════════════════════════════════════════
   ORBITARA — interaksi & efek visual
   Tanpa dependensi. Semua aman jika gagal.
   ════════════════════════════════════════════ */
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;

  /* ── 1. PRELOADER ───────────────────────── */
  var pre = document.getElementById("preloader");
  var preNum = document.getElementById("pre-num");
  var preFill = document.getElementById("pre-fill");
  var progress = 0;
  function tickPre() {
    progress += Math.random() * 22 + 6;
    if (progress >= 100) {
      progress = 100;
      preNum.textContent = "100";
      preFill.style.width = "100%";
      setTimeout(function () {
        pre.classList.add("done");
        document.body.classList.add("ready");
        setTimeout(function () { pre.style.display = "none"; }, 1000);
      }, 350);
      return;
    }
    preNum.textContent = Math.floor(progress);
    preFill.style.width = progress + "%";
    setTimeout(tickPre, 120 + Math.random() * 160);
  }
  if (reduced) {
    pre.style.display = "none";
  } else {
    tickPre();
    // Pengaman: jangan biarkan preloader macet lebih dari 4 detik
    setTimeout(function () {
      if (!pre.classList.contains("done")) {
        pre.classList.add("done");
        setTimeout(function () { pre.style.display = "none"; }, 1000);
      }
    }, 4000);
  }

  /* ── 2. STARFIELD CANVAS ────────────────── */
  try {
    var cv = document.getElementById("starfield");
    var ctx = cv.getContext("2d");
    var W, H, layers = [], shooters = [];
    var mx = 0, my = 0, scrollY = 0;

    function sizeCanvas() {
      W = cv.width = window.innerWidth;
      H = cv.height = window.innerHeight;
      layers = [];
      var defs = [
        { n: 90,  size: 1.1, speed: 0.06, alpha: 0.5, par: 0.015 },
        { n: 55,  size: 1.7, speed: 0.14, alpha: 0.75, par: 0.035 },
        { n: 26,  size: 2.4, speed: 0.28, alpha: 1.0, par: 0.07 }
      ];
      defs.forEach(function (d) {
        var stars = [];
        for (var i = 0; i < d.n; i++) {
          stars.push({
            x: Math.random() * W, y: Math.random() * H,
            r: d.size * (0.5 + Math.random() * 0.8),
            tw: Math.random() * Math.PI * 2,
            ts: 0.008 + Math.random() * 0.02
          });
        }
        layers.push({ def: d, stars: stars });
      });
    }
    sizeCanvas();
    window.addEventListener("resize", sizeCanvas);

    window.addEventListener("mousemove", function (e) {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
    window.addEventListener("scroll", function () {
      scrollY = window.scrollY || window.pageYOffset;
    }, { passive: true });

    function spawnShooter() {
      shooters.push({
        x: Math.random() * W * 0.8 + W * 0.1,
        y: -20,
        vx: -(4 + Math.random() * 4),
        vy: 3 + Math.random() * 3,
        life: 1
      });
    }

    var hue = 190;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      // Nebula halus
      var g = ctx.createRadialGradient(W * 0.8, H * 0.15, 0, W * 0.8, H * 0.15, W * 0.5);
      g.addColorStop(0, "rgba(124,92,255,0.10)");
      g.addColorStop(1, "rgba(124,92,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      var g2 = ctx.createRadialGradient(W * 0.15, H * 0.85, 0, W * 0.15, H * 0.85, W * 0.45);
      g2.addColorStop(0, "rgba(0,229,255,0.07)");
      g2.addColorStop(1, "rgba(0,229,255,0)");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, W, H);

      layers.forEach(function (L) {
        var ox = mx * L.def.par * 220;
        var oy = my * L.def.par * 220 + (scrollY * L.def.par * 0.35) % (H + 40);
        L.stars.forEach(function (s) {
          s.tw += s.ts;
          var a = L.def.alpha * (0.55 + 0.45 * Math.sin(s.tw));
          var y = (s.y + oy) % (H + 40);
          if (y < -20) y += H + 40;
          ctx.beginPath();
          ctx.arc(s.x + ox, y - 20, s.r, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(235,244,255," + a.toFixed(3) + ")";
          ctx.fill();
        });
      });

      // Bintang jatuh sesekali
      if (!reduced && Math.random() < 0.006 && shooters.length < 3) spawnShooter();
      shooters = shooters.filter(function (s) { return s.life > 0 && s.y < H + 60; });
      shooters.forEach(function (s) {
        s.x += s.vx; s.y += s.vy; s.life -= 0.016;
        var grad = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * 12, s.y - s.vy * 12);
        grad.addColorStop(0, "rgba(0,229,255," + (0.9 * s.life).toFixed(3) + ")");
        grad.addColorStop(1, "rgba(0,229,255,0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * 12, s.y - s.vy * 12);
        ctx.stroke();
      });

      if (!reduced) requestAnimationFrame(draw);
    }
    if (reduced) {
      // Satu frame statis saja
      draw();
    } else {
      draw();
    }
  } catch (e) { /* kanvas gagal: halaman tetap jalan */ }

  /* ── 3. CUSTOM CURSOR ───────────────────── */
  if (finePointer && !reduced) {
    try {
      var dot = document.querySelector(".cursor-dot");
      var ring = document.querySelector(".cursor-ring");
      var cx = -100, cy = -100, rx = -100, ry = -100;
      document.addEventListener("mousemove", function (e) {
        cx = e.clientX; cy = e.clientY;
        dot.style.transform = "translate(" + (cx - 4) + "px," + (cy - 4) + "px)";
      }, { passive: true });
      (function follow() {
        rx += (cx - rx) * 0.16;
        ry += (cy - ry) * 0.16;
        ring.style.transform = "translate(" + (rx - 19) + "px," + (ry - 19) + "px)";
        requestAnimationFrame(follow);
      })();
      document.querySelectorAll("a, button, [data-hover]").forEach(function (el) {
        el.addEventListener("mouseenter", function () { document.body.classList.add("cursor-hot"); });
        el.addEventListener("mouseleave", function () { document.body.classList.remove("cursor-hot"); });
      });
    } catch (e) {}
  }

  /* ── 4. SCROLL PROGRESS ─────────────────── */
  var pfill = document.getElementById("progress-fill");
  function onScrollProgress() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    pfill.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
  }
  window.addEventListener("scroll", onScrollProgress, { passive: true });
  onScrollProgress();

  /* ── 5. REVEAL ON SCROLL ────────────────── */
  try {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  } catch (e) {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
  }

  /* ── 6. MAGNETIC BUTTONS ────────────────── */
  if (finePointer && !reduced) {
    document.querySelectorAll(".magnetic").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        el.style.transform = "translate(" + x * 0.22 + "px," + y * 0.28 + "px)";
      });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; });
    });
  }

  /* ── 7. 3D TILT PADA KARTU ──────────────── */
  if (finePointer && !reduced) {
    document.querySelectorAll(".tilt").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform =
          "perspective(900px) rotateY(" + (px * 10).toFixed(2) + "deg)" +
          " rotateX(" + (-py * 10).toFixed(2) + "deg) translateZ(6px)";
      });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; });
    });
  }

  /* ── 8. TABS SEWA / BELI ────────────────── */
  var tabs = document.querySelectorAll(".tab");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) { t.classList.remove("active"); });
      tab.classList.add("active");
      document.querySelectorAll(".tab-panel").forEach(function (p) { p.classList.remove("active"); });
      var panel = document.getElementById("panel-" + tab.getAttribute("data-tab"));
      if (panel) panel.classList.add("active");
    });
  });

  /* ── 9. FAQ ACCORDION ───────────────────── */
  document.querySelectorAll(".faq").forEach(function (item) {
    var q = item.querySelector(".faq-q");
    var a = item.querySelector(".faq-a");
    q.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq.open").forEach(function (o) {
        o.classList.remove("open");
        o.querySelector(".faq-a").style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add("open");
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });

  /* ── 10. MOBILE MENU ────────────────────── */
  var burger = document.getElementById("burger");
  var mmenu = document.getElementById("mobile-menu");
  burger.addEventListener("click", function () {
    var open = mmenu.classList.toggle("open");
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
  });
  mmenu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      mmenu.classList.remove("open");
      burger.classList.remove("open");
    });
  });

  /* ── 11. WHATSAPP CTA (placeholder) ─────── */
  var toast = document.getElementById("toast");
  var toastTimer = null;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 3200);
  }
  document.getElementById("wa-btn").addEventListener("click", function () {
    showToast("Nomor WhatsApp masih sementara — ganti dengan nomor resmi sebelum publikasi.");
  });

  /* ── 12. PARALLAX HALUS UNTUK HERO ──────── */
  if (!reduced) {
    var heroInner = document.querySelector(".hero-inner");
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY || window.pageYOffset;
        if (y < window.innerHeight * 1.2) {
          heroInner.style.transform = "translateY(" + y * 0.22 + "px)";
          heroInner.style.opacity = Math.max(0, 1 - y / (window.innerHeight * 0.85));
        }
        ticking = false;
      });
    }, { passive: true });
  }
})();
