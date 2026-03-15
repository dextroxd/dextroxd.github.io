/* ============================================================
   DIVYANSHU DHAWAN — HYPER-PREMIUM PORTFOLIO
   Advanced Animation Engine
   ============================================================ */

'use strict';

/* ─── UTILITIES ─────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const clamp = (n, min, max) => Math.min(Math.max(n, min), max);
const lerp = (a, b, t) => a + (b - a) * t;
const rand = (min, max) => Math.random() * (max - min) + min;
const isMobile = () => window.innerWidth <= 768;

/* ─── LOADER ─────────────────────────────────────── */
function initLoader() {
  const loader = $('#loader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 600);
  });
}

/* ─── CURSOR GLOW ────────────────────────────────── */
function initCursorGlow() {
  if (isMobile()) return;
  const glow = $('#cursor-glow');
  if (!glow) return;
  let mx = 0, my = 0, cx = 0, cy = 0;
  let rafId;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  const tick = () => {
    cx = lerp(cx, mx, 0.08);
    cy = lerp(cy, my, 0.08);
    glow.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
    rafId = requestAnimationFrame(tick);
  };
  tick();
}

/* ─── PARTICLE CANVAS ───────────────────────────── */
function initCanvas() {
  const canvas = $('#bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles, animId;

  const PARTICLE_COUNT = isMobile() ? 40 : 80;
  const LINK_DIST = 120;
  const PARTICLE_COLOR = '110,231,183';
  const LINK_COLOR = '110,231,183';

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: rand(0, W), y: rand(0, H),
      vx: rand(-0.25, 0.25), vy: rand(-0.25, 0.25),
      r: rand(1, 2.5),
      alpha: rand(0.3, 0.9),
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${PARTICLE_COLOR},${p.alpha})`;
      ctx.fill();
    });
    // Draw links
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < LINK_DIST) {
          const alpha = (1 - dist / LINK_DIST) * 0.18;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${LINK_COLOR},${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    animId = requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();
  window.addEventListener('resize', () => { resize(); createParticles(); });
}

/* ─── TYPEWRITER ─────────────────────────────────── */
function initTypewriter() {
  const el = $('#typewriter');
  if (!el) return;
  const roles = [
    'Software Engineer @ Google',
    'Distributed Systems Builder',
    'Kubernetes Ecosystem Expert',
    'Open Source Enthusiast',
    'Competitive Programmer',
  ];
  let ri = 0, ci = 0, deleting = false;
  const DELAY_TYPING = 75, DELAY_DELETE = 38, DELAY_PAUSE = 2000, DELAY_NEXT = 500;

  function type() {
    const current = roles[ri];
    if (deleting) {
      ci--;
      el.textContent = current.slice(0, ci);
      if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; setTimeout(type, DELAY_NEXT); return; }
      setTimeout(type, DELAY_DELETE);
    } else {
      ci++;
      el.textContent = current.slice(0, ci);
      if (ci === current.length) { deleting = true; setTimeout(type, DELAY_PAUSE); return; }
      setTimeout(type, DELAY_TYPING);
    }
  }
  setTimeout(type, 1200);
}

/* ─── SCROLL REVEAL ──────────────────────────────── */
function initScrollReveal() {
  const els = $$('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  els.forEach(el => io.observe(el));
}

/* ─── ACTIVE NAV ─────────────────────────────────── */
function initActiveNav() {
  const links = $$('.nav-link');
  const sections = $$('section[id]');
  const header = $('#header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    // Scrolled class
    if (window.scrollY > 20) header.classList.add('scrolled');
    else header.classList.remove('scrolled');

    // Active link
    if (isMobile()) return;
    const scrollMid = window.scrollY + window.innerHeight / 3;
    let current = '';
    sections.forEach(s => { if (s.offsetTop <= scrollMid) current = s.id; });
    links.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === `#${current}`);
    });
  }, { passive: true });
}

/* ─── MOBILE NAV ─────────────────────────────────── */
function initMobileNav() {
  const toggle = $('#nav-toggle');
  const overlay = $('#mobile-overlay');
  const mobileLinks = $$('.mobile-nav-link, .mobile-cta');
  if (!toggle || !overlay) return;

  const open = () => {
    toggle.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    overlay.classList.add('open');
    document.body.classList.add('nav-open');
  };
  const close = () => {
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    overlay.classList.remove('open');
    document.body.classList.remove('nav-open');
  };

  toggle.addEventListener('click', () => toggle.classList.contains('open') ? close() : open());
  mobileLinks.forEach(l => l.addEventListener('click', close));
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

/* ─── COUNTER ANIMATION ─────────────────────────── */
function initCounters() {
  const counters = $$('.stat-num[data-target]');
  if (!counters.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.target;
      const dur = 1800;
      const start = performance.now();
      const tick = (now) => {
        const t = clamp((now - start) / dur, 0, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(eased * target);
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      };
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => io.observe(c));
}

/* ─── 3D TILT CARDS ──────────────────────────────── */
function initTiltCards() {
  if (isMobile()) return;
  const cards = $$('.project-card, .m-stat');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const rx = clamp((e.clientY - cy) / (rect.height / 2), -1, 1) * -6;
      const ry = clamp((e.clientX - cx) / (rect.width / 2), -1, 1) * 6;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ─── MAGNETIC NAV LINKS ────────────────────────── */
function initMagneticLinks() {
  if (isMobile()) return;
  $$('.nav-link, .btn').forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.1;
      const dy = (e.clientY - cy) * 0.15;
      el.style.transform = `translate(${dx}px,${dy}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
}

/* ─── TIMELINE DOT COLORS ────────────────────────── */
function initTimelineDots() {
  const items = $$('.timeline-item');
  const colors = ['#6ee7b7', '#00a4ef', '#ff9900', '#1428a0'];
  items.forEach((item, i) => {
    const dot = item.querySelector('.timeline-dot');
    if (dot) {
      dot.style.borderColor = colors[i] || colors[0];
      dot.style.boxShadow = `0 0 12px ${colors[i] || colors[0]}60`;
    }
  });
}

/* ─── SMOOTH SCROLL ─────────────────────────────── */
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = $(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ─── STAGGER SKILL ITEMS ──────────────────────── */
function initSkillStagger() {
  const categories = $$('.skill-category');
  if (!categories.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const items = $$('li', e.target);
      items.forEach((li, i) => {
        li.style.transitionDelay = `${i * 60}ms`;
        li.style.opacity = '0';
        li.style.transform = 'translateX(-10px)';
        requestAnimationFrame(() => {
          setTimeout(() => {
            li.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            li.style.opacity = '1';
            li.style.transform = 'translateX(0)';
          }, 100 + i * 60);
        });
      });
      io.unobserve(e.target);
    });
  }, { threshold: 0.3 });
  categories.forEach(c => io.observe(c));
}

/* ─── TAG HOVER RIPPLE ──────────────────────────── */
function initTagRipple() {
  $$('.tag').forEach(tag => {
    tag.addEventListener('click', e => {
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position:absolute;width:5px;height:5px;border-radius:50%;
        background:rgba(110,231,183,0.6);pointer-events:none;
        transform:translate(-50%,-50%) scale(0);
        animation:tag-ripple 0.5s ease-out forwards;
        left:${e.offsetX}px;top:${e.offsetY}px;
      `;
      tag.style.position = 'relative';
      tag.style.overflow = 'hidden';
      tag.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);
    });
  });
  // Inject keyframe
  const style = document.createElement('style');
  style.textContent = `@keyframes tag-ripple { to { transform:translate(-50%,-50%) scale(20); opacity:0; } }`;
  document.head.appendChild(style);
}

/* ─── PAGE PROGRESS BAR ─────────────────────────── */
function initProgressBar() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position:fixed;top:0;left:0;height:2px;width:0%;
    background:linear-gradient(90deg,#6ee7b7,#22d3ee,#818cf8);
    z-index:9998;transition:width 0.1s linear;
    box-shadow:0 0 8px rgba(110,231,183,0.6);
    border-radius:0 2px 2px 0;
  `;
  document.body.appendChild(bar);
  window.addEventListener('scroll', () => {
    const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = `${clamp(scrolled, 0, 100)}%`;
  }, { passive: true });
}

/* ─── EXPERIENCE CARD GLOW ───────────────────────── */
function initCardGlow() {
  if (isMobile()) return;
  $$('.glass-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(110,231,183,0.04) 0%, rgba(255,255,255,0.02) 60%, transparent 100%)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });
}

/* ─── BOOT ───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCursorGlow();
  initCanvas();
  initTypewriter();
  initScrollReveal();
  initActiveNav();
  initMobileNav();
  initCounters();
  initTiltCards();
  initMagneticLinks();
  initTimelineDots();
  initSmoothScroll();
  initSkillStagger();
  initTagRipple();
  initProgressBar();
  initCardGlow();
});