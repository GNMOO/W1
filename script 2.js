/* ================================================================
   دعوة زفاف — سكربت الجافاسكربت
   كل الإعدادات القابلة للتعديل موضوعة أعلى الملف بوضوح
   ================================================================ */

/* ---------- ✏️ إعدادات قابلة للتعديل بسهولة ---------- */
const CONFIG = {
  // تاريخ ووقت الزفاف — بصيغة (سنة، شهر - 1، يوم، ساعة، دقيقة)
  weddingDate: new Date(2026, 7, 30, 19, 0, 0), // 30 أغسطس 2026 الساعة 7:00 مساءً

  // البريد الإلكتروني الذي ستُرسل إليه ردود التأكيد
  rsvpEmail: "example@email.com",

  // عدد البتلات العائمة في الخلفية
  petalCount: 14,

  // عدد نقاط التألق
  sparkleCount: 22,
};

/* ================================================================
   1) شاشة الدخول (Entrance Overlay)
   ================================================================ */
window.addEventListener("load", () => {
  const overlay = document.getElementById("entranceOverlay");
  // ننتظر قليلاً حتى يشعر الزائر بلحظة الترقب ثم تختفي الشاشة برفق
  setTimeout(() => {
    overlay.classList.add("hidden");
  }, 1800);
});

/* ================================================================
   2) توليد البتلات العائمة في الخلفية
   ================================================================ */
function createPetals() {
  const layer = document.getElementById("petalsLayer");
  if (!layer) return;

  for (let i = 0; i < CONFIG.petalCount; i++) {
    const petal = document.createElement("div");
    petal.className = "petal";

    // شكل SVG بسيط لبتلة (نستخدم الرمز المعرف في الـ HTML)
    petal.innerHTML = `
      <svg viewBox="0 0 40 40" width="100%" height="100%">
        <use href="#petalShape"></use>
      </svg>`;

    // توزيع عشوائي للموقع الأفقي، السرعة، الحجم، والتأخير
    const left = Math.random() * 100;
    const duration = 12 + Math.random() * 10; // بين 12 و22 ثانية
    const delay = Math.random() * 20;
    const size = 12 + Math.random() * 14;
    const drift = (Math.random() * 2 - 1) * 120; // انحراف أفقي أثناء السقوط

    petal.style.left = `${left}vw`;
    petal.style.width = `${size}px`;
    petal.style.height = `${size}px`;
    petal.style.animationDuration = `${duration}s`;
    petal.style.animationDelay = `-${delay}s`;
    petal.style.setProperty("--drift", `${drift}px`);
    petal.style.opacity = 0.35 + Math.random() * 0.35;

    layer.appendChild(petal);
  }
}

/* ================================================================
   3) توليد نقاط التألق (Sparkles)
   ================================================================ */
function createSparkles() {
  const layer = document.getElementById("sparkleLayer");
  if (!layer) return;

  for (let i = 0; i < CONFIG.sparkleCount; i++) {
    const sparkle = document.createElement("div");
    sparkle.className = "sparkle";

    sparkle.style.top = `${Math.random() * 100}vh`;
    sparkle.style.left = `${Math.random() * 100}vw`;
    sparkle.style.animationDelay = `${Math.random() * 4}s`;
    sparkle.style.animationDuration = `${3 + Math.random() * 3}s`;

    layer.appendChild(sparkle);
  }
}

/* ================================================================
   4) تأثير الحركة بالماوس (Parallax) — لأجهزة الحاسوب فقط
   ================================================================ */
function initParallax() {
  const parallax = document.getElementById("heroParallax");
  if (!parallax) return;

  // تعطيل التأثير على اللمس/الجوال لتوفير الأداء
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
  if (isTouchDevice) return;

  document.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2; // من -1 إلى 1
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    parallax.style.transform = `translate3d(${x * 14}px, ${y * 10}px, 0)`;
  });
}

/* ================================================================
   5) الظهور التدريجي عند التمرير (Scroll Reveal)
   ================================================================ */
function initScrollReveal() {
  const revealEls = document.querySelectorAll(".reveal");
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  revealEls.forEach((el) => observer.observe(el));
}

/* ================================================================
   6) العد التنازلي الحي
   ================================================================ */
function initCountdown() {
  const daysEl = document.getElementById("cd-days");
  const hoursEl = document.getElementById("cd-hours");
  const minutesEl = document.getElementById("cd-minutes");
  const secondsEl = document.getElementById("cd-seconds");

  if (!daysEl) return;

  function pad(num) {
    return String(num).padStart(2, "0");
  }

  function tick() {
    const now = new Date();
    const diff = CONFIG.weddingDate - now;

    if (diff <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    daysEl.textContent = pad(days);
    hoursEl.textContent = pad(hours);
    minutesEl.textContent = pad(minutes);
    secondsEl.textContent = pad(seconds);
  }

  tick();
  setInterval(tick, 1000);
}

/* ================================================================
   7) نموذج تأكيد الحضور — يُرسل عبر mailto
   ================================================================ */
function initRsvpForm() {
  const form = document.getElementById("rsvpForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("guestName").value.trim();
    const count = document.getElementById("guestCount").value;
    const attendance = form.querySelector('input[name="attendance"]:checked').value;
    const attendanceText = attendance === "yes" ? "نعم سأحضر" : "أعتذر عن الحضور";

    const subject = encodeURIComponent(`تأكيد حضور: ${name}`);
    const body = encodeURIComponent(
      `الاسم: ${name}\n` +
      `عدد الحضور: ${count}\n` +
      `الحالة: ${attendanceText}\n\n` +
      `— أُرسلت هذه الرسالة من موقع دعوة الزفاف —`
    );

    // فتح تطبيق البريد الافتراضي مع تعبئة الحقول مسبقاً
    window.location.href = `mailto:${CONFIG.rsvpEmail}?subject=${subject}&body=${body}`;
  });
}

/* ================================================================
   8) تشغيل/إيقاف الموسيقى الخلفية
   ================================================================ */
function initMusicToggle() {
  const btn = document.getElementById("musicToggle");
  const label = document.getElementById("musicLabel");
  const audio = document.getElementById("bgMusic");
  if (!btn || !audio) return;

  let isPlaying = false;

  btn.addEventListener("click", () => {
    if (!isPlaying) {
      audio.play().catch(() => {
        // في حال منع المتصفح للتشغيل التلقائي، لا شيء يحدث حتى تفاعل المستخدم مرة أخرى
      });
      label.textContent = "إيقاف الموسيقى";
      btn.classList.add("playing");
      btn.setAttribute("aria-pressed", "true");
    } else {
      audio.pause();
      label.textContent = "تشغيل الموسيقى";
      btn.classList.remove("playing");
      btn.setAttribute("aria-pressed", "false");
    }
    isPlaying = !isPlaying;
  });
}

/* ================================================================
   9) أنيميشن الختام: قصاصات ذهبية عند الوصول لنهاية الصفحة
   ================================================================ */
function initEndingAnimation() {
  const closing = document.getElementById("closing");
  const confettiLayer = document.getElementById("confettiLayer");
  if (!closing || !confettiLayer) return;

  let hasTriggered = false;

  function spawnConfetti() {
    const colors = ["#B9924F", "#D9BC80", "#8C6A34"];

    for (let i = 0; i < 40; i++) {
      const piece = document.createElement("div");
      piece.className = "confetti-piece";

      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDuration = `${2.5 + Math.random() * 2}s`;
      piece.style.animationDelay = `${Math.random() * 0.6}s`;
      piece.style.width = `${5 + Math.random() * 5}px`;
      piece.style.height = `${10 + Math.random() * 8}px`;

      confettiLayer.appendChild(piece);

      // تنظيف العنصر بعد انتهاء الأنيميشن لتوفير الأداء
      piece.addEventListener("animationend", () => piece.remove());
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasTriggered) {
          hasTriggered = true;
          spawnConfetti();
        }
      });
    },
    { threshold: 0.4 }
  );

  observer.observe(closing);
}

/* ================================================================
   تشغيل كل الوظائف بعد تحميل المحتوى
   ================================================================ */
document.addEventListener("DOMContentLoaded", () => {
  createPetals();
  createSparkles();
  initParallax();
  initScrollReveal();
  initCountdown();
  initRsvpForm();
  initMusicToggle();
  initEndingAnimation();
});
