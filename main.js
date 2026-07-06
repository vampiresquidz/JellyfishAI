// HypnoFlow landing — mascot animation, waitlist capture, scroll reveals

// Mark that JS is active so reveal animations engage (content is visible without it).
document.documentElement.classList.add('js');

// --- Animated Professor Jelly (sprite-sheet, same asset as the app) ---
function initMascots() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.mascot').forEach((el) => {
    const sheet = el.dataset.sheet;
    const cols = +el.dataset.cols, rows = +el.dataset.rows;
    const frames = +el.dataset.frames, fps = +el.dataset.fps || 15;
    el.style.backgroundImage = `url('${sheet}')`;

    let cell = 0, f = 0, last = 0;
    const layout = () => {
      cell = el.clientWidth;
      if (!cell) return;
      el.style.backgroundSize = `${cell * cols}px ${cell * rows}px`;
      draw();
    };
    const draw = () => {
      const c = f % cols, r = Math.floor(f / cols) % rows;
      el.style.backgroundPosition = `${-c * cell}px ${-r * cell}px`;
    };
    window.addEventListener('resize', layout);
    layout();

    if (reduce) return; // hold on the first frame
    const tick = (t) => {
      if (cell && t - last >= 1000 / fps) { last = t; f = (f + 1) % frames; draw(); }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

// --- Waitlist capture (works out-of-the-box on Netlify; falls back locally) ---
const toast = document.getElementById('toast');
function showToast() {
  if (!toast) return;
  toast.hidden = false;
  window.dispatchEvent(new Event('resize')); // size the toast's mascot now that it's visible
}
function hideToast() { if (toast) toast.hidden = true; }

// --- Waitlist counter (starts at 121; ticks up when someone joins) ---
const COUNT_BASE = 121;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function joinedExtra() {
  const n = parseInt(localStorage.getItem('hypnoflow_joined') || '0', 10);
  return Math.min(isNaN(n) ? 0 : n, 25);
}
function countTarget() { return COUNT_BASE + joinedExtra(); }

function animateCount(el, from, to, dur) {
  if (reduceMotion) { el.textContent = to.toLocaleString(); return; }
  const start = performance.now();
  const step = (t) => {
    const p = Math.min((t - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(from + (to - from) * eased).toLocaleString();
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
function renderCount(fromLoad) {
  const el = document.getElementById('count');
  if (!el) return;
  const to = countTarget();
  animateCount(el, fromLoad ? Math.max(to - 34, 0) : to - 1, to, fromLoad ? 1400 : 600);
}
function bumpCount() {
  const n = joinedExtra() + 1;
  localStorage.setItem('hypnoflow_joined', String(n));
  renderCount(false);
}

function wireForm(form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    if (data.get('botcheck')) return; // honeypot tripped

    try {
      // Web3Forms — works on any static host (DigitalOcean, GitHub Pages, etc.)
      // and emails each signup to the address tied to the access key.
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      });
      const json = await res.json().catch(() => ({}));
      if (!json.success) throw new Error('submit-failed');
    } catch (_) {
      // Local preview or non-Netlify host: stash so nothing is lost during testing.
      try {
        const list = JSON.parse(localStorage.getItem('hypnoflow_waitlist') || '[]');
        list.push({ username: data.get('username'), email: data.get('email'), at: Date.now() });
        localStorage.setItem('hypnoflow_waitlist', JSON.stringify(list));
      } catch (_) {}
    }
    form.reset();
    bumpCount();
    showToast();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initMascots();
  document.querySelectorAll('form.waitlist').forEach(wireForm);

  const closeBtn = document.getElementById('toastClose');
  if (closeBtn) closeBtn.addEventListener('click', hideToast);
  if (toast) toast.addEventListener('click', (e) => { if (e.target === toast) hideToast(); });

  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  renderCount(true);

  // Scroll reveal (fall back to fully visible if unsupported)
  const revealables = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    revealables.forEach((el) => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    revealables.forEach((el) => io.observe(el));
  }
});
