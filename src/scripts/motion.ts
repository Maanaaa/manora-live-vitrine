/**
 * Motion design de la vitrine : révélations au scroll, titres mot à mot,
 * en-tête qui se compacte, compteurs, parallaxe légère.
 * Tout est désactivé si l'utilisateur préfère réduire les animations.
 */

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Découpe le texte d'un élément en mots, en gardant les balises internes. */
function splitWords(root: Element) {
  let i = 0;
  const walk = (node: Node) => {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent ?? '';
        if (!text.trim()) continue;
        const frag = document.createDocumentFragment();
        text.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            frag.append(document.createTextNode(' '));
            return;
          }
          const w = document.createElement('span');
          w.className = 'w';
          const inner = document.createElement('span');
          inner.textContent = part;
          inner.style.setProperty('--i', String(i++));
          w.append(inner);
          frag.append(w);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE && (child as Element).tagName !== 'BR') {
        walk(child);
      }
    }
  };
  walk(root);
}

function initReveals() {
  document.querySelectorAll('.split').forEach(splitWords);

  const targets = document.querySelectorAll('[data-reveal], .split, [data-inview]');
  if (reduced) {
    targets.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          if (!(e.target as HTMLElement).dataset.repeat) io.unobserve(e.target);
        } else if ((e.target as HTMLElement).dataset.repeat) {
          e.target.classList.remove('is-in');
        }
      });
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.1 },
  );
  targets.forEach((el) => io.observe(el));
}

function initHeader() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;
  let last = 0;
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 20);
    header.classList.toggle('is-hidden', y > 400 && y > last && !header.classList.contains('is-open'));
    last = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const toggle = header.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  toggle?.addEventListener('click', () => {
    const open = header.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });
  header.querySelectorAll('[data-menu] a').forEach((a) =>
    a.addEventListener('click', () => {
      header.classList.remove('is-open');
      toggle?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }),
  );
}

/** Compteurs animés : <span data-count="40">0</span> */
function initCounters() {
  const els = document.querySelectorAll<HTMLElement>('[data-count]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target as HTMLElement;
      io.unobserve(el);
      const end = Number(el.dataset.count);
      if (reduced) {
        el.textContent = String(end);
        return;
      }
      const dur = 1600;
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min((t - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 4);
        el.textContent = String(Math.round(end * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  });
  els.forEach((el) => io.observe(el));
}

/** Parallaxe à la souris : data-depth="0.4" sur les enfants de [data-parallax] */
function initParallax() {
  if (reduced || !window.matchMedia('(pointer: fine)').matches) return;
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((scene) => {
    const layers = scene.querySelectorAll<HTMLElement>('[data-depth]');
    let raf = 0;
    scene.addEventListener('pointermove', (ev) => {
      const r = scene.getBoundingClientRect();
      const x = (ev.clientX - r.left) / r.width - 0.5;
      const y = (ev.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        layers.forEach((l) => {
          const d = Number(l.dataset.depth) * 40;
          l.style.translate = `${x * d}px ${y * d}px`;
        });
      });
    });
    scene.addEventListener('pointerleave', () => {
      layers.forEach((l) => (l.style.translate = '0 0'));
    });
  });
}

/** Progression du scroll dans une section : écrit --p (0 → 1) sur [data-progress] */
function initProgress() {
  const els = document.querySelectorAll<HTMLElement>('[data-progress]');
  if (!els.length || reduced) return;
  const update = () => {
    const vh = window.innerHeight;
    els.forEach((el) => {
      const r = el.getBoundingClientRect();
      const p = Math.min(Math.max((vh - r.top) / (vh + r.height), 0), 1);
      el.style.setProperty('--p', p.toFixed(4));
    });
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

export function initMotion() {
  initReveals();
  initHeader();
  initCounters();
  initParallax();
  initProgress();
}

export { reduced };
