/**
 * 交互特效模块
 * 滚动渐入、导航高亮、卡片 3D 倾斜与聚光、打字机、粒子背景
 * 所有特效均遵循 prefers-reduced-motion，且渲染失败时不影响页面内容
 */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initScrollSpy();
    initScrollReveal();
    if (finePointer && !reduceMotion) initCardTiltAndGlow();
    if (!reduceMotion) initTypewriter();
    if (!reduceMotion) initHeroParticles();
  });

  /* ---------- Header 滚动阴影 ---------- */
  function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    const update = () => header.classList.toggle('scrolled', window.scrollY > 8);
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ---------- 导航滚动高亮 ---------- */
  function initScrollSpy() {
    const links = Array.from(document.querySelectorAll('.header-nav .nav-link'));
    const sections = links
      .map(link => {
        const hash = link.getAttribute('href') || '';
        const id = hash.startsWith('#') ? hash.slice(1) : null;
        const el = id ? document.getElementById(id) : null;
        return el ? { link, el } : null;
      })
      .filter(Boolean);
    if (sections.length === 0) return;

    const setActive = target => {
      links.forEach(l => l.classList.toggle('active', l === target));
    };

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const match = sections.find(s => s.el === entry.target);
            if (match) setActive(match.link);
          }
        });
      },
      { rootMargin: '-35% 0px -55% 0px' }
    );
    sections.forEach(s => observer.observe(s.el));

    // 回到页面顶部时取消高亮
    window.addEventListener(
      'scroll',
      () => {
        if (window.scrollY < 60) setActive(null);
      },
      { passive: true }
    );
  }

  /* ---------- 滚动渐入（含动态渲染的卡片） ---------- */
  function initScrollReveal() {
    if (reduceMotion || !('IntersectionObserver' in window)) return;

    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          io.unobserve(el);
          el.classList.add('revealed');
          // 动画结束后移除类，避免 transition 覆盖卡片自身的悬停过渡
          const delay = parseFloat(el.style.getPropertyValue('--reveal-delay')) || 0;
          setTimeout(() => {
            el.classList.remove('reveal', 'revealed');
            el.style.removeProperty('--reveal-delay');
          }, 750 + delay);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );

    const attach = (el, index) => {
      if (el.nodeType !== 1) return;
      el.classList.add('reveal');
      el.style.setProperty('--reveal-delay', Math.min(index * 80, 400) + 'ms');
      io.observe(el);
    };

    document.querySelectorAll('.section-title').forEach(el => attach(el, 0));

    // 技能与项目由 JS 渲染（含语言切换重渲染），用 MutationObserver 自动接管新节点
    ['skills-grid', 'projects-grid'].forEach(id => {
      const grid = document.getElementById(id);
      if (!grid) return;
      Array.from(grid.children).forEach((child, i) => attach(child, i));
      new MutationObserver(mutations => {
        let i = 0;
        mutations.forEach(m => m.addedNodes.forEach(node => attach(node, i++)));
      }).observe(grid, { childList: true });
    });
  }

  /* ---------- 卡片 3D 倾斜 + 跟随光标聚光 ---------- */
  function initCardTiltAndGlow() {
    const TILT_SELECTOR = '.project-card';
    const GLOW_SELECTOR = '.project-card, .skill-group';
    let activeTilt = null;
    let rafId = 0;

    const resetTilt = card => {
      if (!card) return;
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    };

    document.addEventListener('pointerout', e => {
      const card = e.target.closest(TILT_SELECTOR);
      if (card && !card.contains(e.relatedTarget)) {
        resetTilt(card);
        if (activeTilt === card) activeTilt = null;
      }
    });

    document.addEventListener('pointermove', e => {
      const glowCard = e.target.closest(GLOW_SELECTOR);
      const tiltCard = e.target.closest(TILT_SELECTOR);
      activeTilt = tiltCard;
      if (!glowCard && !tiltCard) return;
      if (rafId) return;

      const { clientX, clientY } = e;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        if (glowCard) {
          const rect = glowCard.getBoundingClientRect();
          glowCard.style.setProperty('--mx', ((clientX - rect.left) / rect.width) * 100 + '%');
          glowCard.style.setProperty('--my', ((clientY - rect.top) / rect.height) * 100 + '%');
        }
        if (tiltCard && tiltCard === activeTilt) {
          const rect = tiltCard.getBoundingClientRect();
          const px = (clientX - rect.left) / rect.width - 0.5;
          const py = (clientY - rect.top) / rect.height - 0.5;
          tiltCard.style.setProperty('--ry', (px * 6).toFixed(2) + 'deg');
          tiltCard.style.setProperty('--rx', (-py * 5).toFixed(2) + 'deg');
        }
      });
    });
  }

  /* ---------- 打字机：Hero 职位轮播 ---------- */
  function initTypewriter() {
    const el = document.getElementById('hero-title');
    if (!el) return;

    const phrases = {
      zh: [
        '机器视觉算法工程师',
        '算法研发 · Python / PyTorch',
        '工程落地 · C# / .NET 8',
        '边缘部署 · C++ / ONNX Runtime'
      ],
      en: [
        'Machine Vision Algorithm Engineer',
        'Algorithm R&D · Python / PyTorch',
        'Engineering · C# / .NET 8',
        'Edge Deployment · C++ / ONNX Runtime'
      ]
    };

    // 通知 main.js：hero-title 由打字机接管，语言切换时不要覆盖
    window.heroTypewriter = true;

    el.innerHTML = '';
    const text = document.createElement('span');
    text.className = 'typed-text';
    const cursor = document.createElement('span');
    cursor.className = 'typed-cursor';
    el.appendChild(text);
    el.appendChild(cursor);

    const locale = () =>
      (typeof i18n !== 'undefined' && phrases[i18n.currentLocale]) ? i18n.currentLocale : 'zh';

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let current = phrases[locale()][0];

    const tick = () => {
      if (!deleting) {
        charIndex++;
        text.textContent = current.slice(0, charIndex);
        if (charIndex >= current.length) {
          deleting = true;
          setTimeout(tick, 2400);
          return;
        }
        setTimeout(tick, 55);
      } else {
        charIndex--;
        text.textContent = current.slice(0, charIndex);
        if (charIndex <= 0) {
          deleting = false;
          const list = phrases[locale()];
          phraseIndex = (phraseIndex + 1) % list.length;
          current = list[phraseIndex];
          setTimeout(tick, 350);
          return;
        }
        setTimeout(tick, 26);
      }
    };
    tick();
  }

  /* ---------- Hero 粒子网络背景 ---------- */
  function initHeroParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    // 窄屏（移动端）暂不启动，等窗口变宽后再初始化
    if (window.innerWidth < 640) {
      window.addEventListener('resize', function retry() {
        if (window.innerWidth >= 640) {
          window.removeEventListener('resize', retry);
          initHeroParticles();
        }
      });
      return;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'hero-particles';
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    wrapper.appendChild(canvas);
    hero.prepend(wrapper);

    const ctx = canvas.getContext('2d');
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const COUNT = 46;
    const LINK_DIST = 130;
    let width = 0;
    let height = 0;
    let particles = [];
    let running = false;
    let rafId = 0;
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      width = hero.clientWidth;
      height = hero.clientHeight;
      canvas.width = width * DPR;
      canvas.height = height * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };

    const seed = () => {
      particles = [];
      for (let i = 0; i < COUNT; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: 1.2 + Math.random() * 1.6
        });
      }
    };

    const step = () => {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }

      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK_DIST) {
            ctx.strokeStyle = 'rgba(37, 99, 235, ' + (0.14 * (1 - dist / LINK_DIST)).toFixed(3) + ')';
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        // 光标附近的连线（青色）
        const md = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (md < LINK_DIST * 1.2) {
          ctx.strokeStyle = 'rgba(6, 182, 212, ' + (0.28 * (1 - md / (LINK_DIST * 1.2))).toFixed(3) + ')';
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      for (const p of particles) {
        ctx.fillStyle = 'rgba(37, 99, 235, 0.35)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(step);
    };

    const start = () => {
      if (running) return;
      running = true;
      rafId = requestAnimationFrame(step);
    };
    const stop = () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
    };

    resize();
    seed();

    // Hero 不在视口或页面隐藏时暂停，节省资源
    new IntersectionObserver(entries => {
      entries.forEach(entry => (entry.isIntersecting ? start() : stop()));
    }).observe(hero);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop();
      else if (hero.getBoundingClientRect().bottom > 0) start();
    });

    window.addEventListener('resize', () => {
      resize();
      seed();
    });
    hero.addEventListener('pointermove', e => {
      const rect = hero.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    hero.addEventListener('pointerleave', () => {
      mouse.x = -9999;
      mouse.y = -9999;
    });
  }
})();
