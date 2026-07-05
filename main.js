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

function wireForm(form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    if (data.get('bot-field')) return; // honeypot tripped

    const body = new URLSearchParams();
    data.forEach((v, k) => body.append(k, v));

    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      if (!res.ok) throw new Error('non-ok');
    } catch (_) {
      // Local preview or non-Netlify host: stash so nothing is lost during testing.
      try {
        const list = JSON.parse(localStorage.getItem('hypnoflow_waitlist') || '[]');
        list.push({ username: data.get('username'), email: data.get('email'), at: Date.now() });
        localStorage.setItem('hypnoflow_waitlist', JSON.stringify(list));
      } catch (_) {}
    }
    form.reset();
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
