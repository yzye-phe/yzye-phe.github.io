/* Yangzhen (Michael) Ye — site interactions and figures. No dependencies.
   Every number drawn here comes from the manuscripts, proposal, and reports
   summarized on the page; edit the data blocks below to update a figure. */
(() => {
  'use strict';

  const root = document.documentElement;
  root.classList.remove('no-js');
  root.classList.add('js');

  const $ = (sel, scope = document) => scope.querySelector(sel);
  const $$ = (sel, scope = document) => Array.from(scope.querySelectorAll(sel));
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reducedMotion = () => motionQuery.matches;

  // Signed values use a true minus sign; interval bounds only sign negatives.
  const signed = (v, digits = 1) => (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v).toFixed(digits);
  const bound = (v, digits = 1) => (v < 0 ? '−' : '') + Math.abs(v).toFixed(digits);

  /* ------------------------------------------------------------------
     Data
     ------------------------------------------------------------------ */

  // Open Doors, Uneven Knocking — course help at less selective four-year
  // institutions, by residence and SES (bottom two quintiles vs. the rest).
  const HERO = [
    { place: 'Off campus', note: '14-point gap', groups: [
      { who: 'Lower SES', v: 49, cls: 's2' },
      { who: 'Higher SES', v: 63, cls: 's1' },
    ] },
    { place: 'On campus', note: 'No gap', groups: [
      { who: 'Lower SES', v: 68, cls: 's2' },
      { who: 'Higher SES', v: 68, cls: 's1' },
    ] },
  ];

  // Open Doors — SES gradients (top vs. bottom), background controls, in points.
  const GRADIENTS = [
    { label: 'Course help', v: 27.0, type: 'Student-initiated', focus: true },
    { label: 'Academic support services', v: 18.7, type: 'Student-initiated', focus: true },
    { label: 'Career services', v: 18.3, type: 'Student-initiated', focus: true },
    { label: 'Study abroad', v: 15.7, type: 'Discretionary enrichment' },
    { label: 'Research with faculty', v: 14.6, type: 'Discretionary enrichment' },
    { label: 'Community project in a course', v: 10.7, type: 'Curriculum-embedded' },
    { label: 'Financial aid advising', v: -25.8, type: 'Need-targeted' },
  ];

  // Same Degree, Different Doors — share in a degree-requiring job by SES tercile.
  const SLOPE = {
    x: ['Bottom', 'Middle', 'Top'],
    series: [
      { short: 'Highly selective', name: 'Began at a highly selective college', cls: 's2', v: [53, 67, 79] },
      { short: 'Elsewhere', name: 'Began elsewhere', cls: 's1', v: [59, 55, 60] },
    ],
  };

  // Belonging (AERA 2027 proposal), Table 1 — AME per 1 SD of belonging.
  const FOREST = [
    { label: 'Selective 4-year', est: 2.8, lo: 0.7, hi: 5.2, p: '.015', sig: true },
    { label: 'Non-selective 4-year', est: -1.1, lo: -5.3, hi: 3.2, p: '.63' },
    { label: 'Broad-access 2-year', est: 1.9, lo: -1.7, hi: 5.6, p: '.31' },
  ];

  // Who Opens an AI Degree — share offering the programme by the 2024 cycle.
  const TIERS = [
    { label: 'World-class universities', v: 88 },
    { label: 'World-class-discipline universities', v: 64 },
    { label: 'Other public institutions', v: 47 },
    { label: 'Private institutions', v: 45 },
  ];
  const TIER_ALL = 49.3;

  // PROTEUS Student Survey Report — EFA solution for the Enjoyment scale.
  const FACTORS = [
    { name: 'Learning value', items: ['E01', 'E02', 'E03', 'E05'], gloss: 'Acquiring knowledge and developing skills' },
    { name: 'Comfort', sub: 'reverse-coded', items: ['E04', 'E09', 'E10', 'E12'], rev: true, gloss: 'Reverse-coded anxiety and boredom items' },
    { name: 'Intrinsic enjoyment', items: ['E06', 'E07', 'E08'], gloss: 'Finding mathematics interesting and enjoyable' },
  ];

  // Home — the thought experiment behind the research. A schematic, not data.
  const LADDER = {
    rungs: ['Middle school, then work', 'An ordinary bachelor’s degree', 'A key university', 'An elite university, then graduate school abroad'],
    eras: [
      { label: 'Before expansion', short: 'Before', village: 0, professor: 2 },
      { label: 'After expansion', short: 'After', village: 1, professor: 3 },
    ],
    kids: [
      { key: 'village', cls: 's2', name: 'Child from a village' },
      { key: 'professor', cls: 's1', name: 'Child of a professor' },
    ],
  };

  // Experience — positions over time, in decimal years; "Summer 2022" is drawn as Jul–Aug.
  const NOW = 2026 + 10 / 12;
  const ROLES = [
    { label: 'Peer mentor & advisor', short: 'Peer mentor', org: 'Soochow University', type: 'programs', start: 2021 + 4 / 12, end: 2024 + 6 / 12, when: 'May 2021 – Jun 2024' },
    { label: 'Rural volunteer teacher', short: 'Village teacher', org: 'Xvji Wuwei Primary School, Henan', type: 'teaching', start: 2022 + 6 / 12, end: 2022 + 8 / 12, when: 'Summer 2022' },
    { label: 'Debate instructor', short: 'Debate instructor', org: 'Suzhou Affiliated High School of XJTU', type: 'teaching', start: 2023, end: 2023 + 7 / 12, when: 'Jan – Jul 2023' },
    { label: 'Program assistant, DSI', short: 'Program asst., DSI', org: 'LSA Digital Studies Institute', type: 'programs', start: 2024 + 7 / 12, end: 2025 + 8 / 12, when: 'Aug 2024 – Aug 2025' },
    { label: 'Independent researcher, CSHPE', short: 'Researcher, CSHPE', org: 'Center for the Study of Higher and Postsecondary Education', type: 'research', start: 2024 + 11 / 12, end: 2026, when: 'Dec 2024 – Dec 2025' },
    { label: 'Research associate II, RTMUS', short: 'RA II, RTMUS', org: 'RTMUS Lab, University of Michigan', type: 'research', start: 2025, end: NOW, when: 'Jan 2025 – present' },
    { label: 'Assessment researcher, IGR', short: 'Assessment, IGR', org: 'Program on Intergroup Relations', type: 'research', start: 2025 + 3 / 12, end: 2025 + 8 / 12, when: 'Apr – Aug 2025' },
  ];
  const ROLE_TYPES = {
    research: { label: 'Research', mark: 'f-s1', key: 's1' },
    programs: { label: 'Programs & advising', mark: 'f-s2', key: 's2' },
    teaching: { label: 'Teaching', mark: 'g-teach', key: 'hollow' },
  };

  // Methods × projects matrix for the Methods section.
  const PROJECTS = [
    { id: 'od', label: 'Open Doors', href: '#paper-open-doors' },
    { id: 'sd', label: 'Same Degree', href: '#paper-degrees' },
    { id: 'be', label: 'Belonging', href: '#paper-belonging' },
    { id: 'fc', label: 'Faculty contact', href: '#talk-aefp' },
    { id: 'ai', label: 'AI degrees', href: '#paper-ai' },
    { id: 'pr', label: 'PROTEUS', href: '#report-proteus' },
    { id: 'ig', label: 'IGR', href: '#report-igr' },
  ];
  const METHODS = [
    { label: 'National longitudinal surveys', uses: ['od', 'sd', 'be', 'fc'] },
    { label: 'Regression & marginal effects', uses: ['od', 'sd', 'be', 'fc', 'pr'] },
    { label: 'Heterogeneity & interactions', uses: ['od', 'sd', 'be', 'fc'] },
    { label: 'Decomposition (Gelbach)', uses: ['od', 'sd'] },
    { label: 'Factor analysis (EFA / CFA)', uses: ['be', 'pr'] },
    { label: 'Measurement invariance', uses: ['be'] },
    { label: 'Event-history models', uses: ['ai'] },
    { label: 'Robustness & sensitivity', uses: ['od', 'sd', 'be', 'fc', 'ai'] },
    { label: 'Preregistration', uses: ['ai'] },
    { label: 'Pre/post & group comparisons', uses: ['pr', 'ig'] },
    { label: 'Qualitative coding', uses: ['pr'] },
  ];

  /* ------------------------------------------------------------------
     Theme
     ------------------------------------------------------------------ */
  const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const themeButton = $('[data-theme-toggle]');
  const currentTheme = () => root.getAttribute('data-theme') || (darkQuery.matches ? 'dark' : 'light');
  const syncThemeButton = () => {
    if (!themeButton) return;
    themeButton.setAttribute('aria-label', currentTheme() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  };
  themeButton?.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) { /* storage blocked: theme lasts this visit */ }
    syncThemeButton();
  });
  darkQuery.addEventListener?.('change', syncThemeButton);
  syncThemeButton();

  /* ------------------------------------------------------------------
     Header: scrolled state, reading progress, mobile menu, section spy
     ------------------------------------------------------------------ */
  const header = $('#site-header');
  const progressBar = $('.read-progress span');
  let scrollQueued = false;
  const onScroll = () => {
    scrollQueued = false;
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 8);
    const max = root.scrollHeight - window.innerHeight;
    progressBar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max).toFixed(4) : 0})`;
  };
  window.addEventListener('scroll', () => {
    if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  const menuButton = $('[data-menu-toggle]');
  const nav = $('#site-nav');
  const setMenu = open => {
    header.classList.toggle('nav-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  menuButton.addEventListener('click', () => setMenu(!header.classList.contains('nav-open')));
  $$('a', nav).forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && header.classList.contains('nav-open')) { setMenu(false); menuButton.focus(); }
  });
  document.addEventListener('click', e => {
    if (header.classList.contains('nav-open') && !header.contains(e.target)) setMenu(false);
  });

  // Pages with a section sub-navigation highlight the section in view.
  const subLinks = new Map($$('.subnav a[href^="#"]').map(a => [a.hash.slice(1), a]));
  if (subLinks.size) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        subLinks.forEach(a => { a.classList.remove('is-active'); a.removeAttribute('aria-current'); });
        const link = subLinks.get(entry.target.id);
        if (!link) return;
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'true');
        // On narrow screens the bar scrolls sideways; keep the active chip in it.
        const bar = link.parentElement;
        const lr = link.getBoundingClientRect();
        const br = bar.getBoundingClientRect();
        if (lr.left < br.left || lr.right > br.right) {
          bar.scrollBy({ left: lr.left - br.left - 24, behavior: reducedMotion() ? 'auto' : 'smooth' });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    ['top', ...subLinks.keys()].forEach(id => {
      const section = document.getElementById(id);
      if (section) spy.observe(section);
    });
  }

  /* ------------------------------------------------------------------
     Reveal on scroll and counting stats
     ------------------------------------------------------------------ */
  const revealer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      revealer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
  $$('[data-reveal]').forEach(node => revealer.observe(node));

  const counter = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      counter.unobserve(entry.target);
      const node = entry.target;
      const target = Number(node.dataset.count);
      const start = performance.now();
      const duration = 1400;
      const tick = now => {
        const p = Math.min(1, (now - start) / duration);
        node.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString('en-US');
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  if (!reducedMotion()) {
    $$('[data-count]').forEach(node => { node.textContent = '0'; counter.observe(node); });
  }

  /* ------------------------------------------------------------------
     Tooltip (one shared element; text set with textContent only)
     ------------------------------------------------------------------ */
  const tip = $('#tooltip');
  let tipOwner = null;

  const placeTip = (x, y) => {
    const pad = 10;
    const w = tip.offsetWidth;
    const h = tip.offsetHeight;
    let left = x + 14;
    let top = y - h - 12;
    if (left + w > window.innerWidth - pad) left = Math.max(pad, x - w - 14);
    if (top < pad) top = Math.min(window.innerHeight - h - pad, y + 18);
    tip.style.transform = `translate(${Math.round(left)}px, ${Math.round(top)}px)`;
  };

  const showTip = (rows, x, y) => {
    tip.replaceChildren(...rows.map(r => {
      if (r.title) {
        const t = document.createElement('div');
        t.className = 'tip-title';
        t.textContent = r.title;
        return t;
      }
      const row = document.createElement('div');
      row.className = 'tip-row';
      if (r.key) {
        const k = document.createElement('span');
        k.className = `tip-key ${r.key}`;
        row.append(k);
      }
      if (r.value) {
        const v = document.createElement('strong');
        v.textContent = r.value;
        row.append(v);
      }
      if (r.label) {
        const l = document.createElement('span');
        l.textContent = r.label;
        row.append(l);
      }
      return row;
    }));
    tip.hidden = false;
    placeTip(x, y);
  };

  const hideTip = () => {
    tip.hidden = true;
    if (tipOwner) {
      tipOwner.classList.remove('is-hover');
      tipOwner.dispatchEvent(new CustomEvent('tipclear'));
    }
    tipOwner = null;
  };

  const bindTip = (node, rows) => {
    const getRows = typeof rows === 'function' ? rows : () => rows;
    node.classList.add('hover-target');
    node.setAttribute('tabindex', '0');
    const enter = (x, y) => {
      if (tipOwner && tipOwner !== node) hideTip();
      tipOwner = node;
      node.classList.add('is-hover');
      node.dispatchEvent(new CustomEvent('tipshow'));
      showTip(getRows(), x, y);
    };
    node.addEventListener('pointerenter', e => enter(e.clientX, e.clientY));
    node.addEventListener('pointermove', e => { if (tipOwner === node) placeTip(e.clientX, e.clientY); });
    node.addEventListener('pointerleave', e => { if (e.pointerType !== 'touch' && tipOwner === node) hideTip(); });
    node.addEventListener('focus', () => {
      const r = node.getBoundingClientRect();
      enter(r.left + r.width / 2, r.top);
    });
    node.addEventListener('blur', () => { if (tipOwner === node) hideTip(); });
  };

  document.addEventListener('pointerdown', e => {
    if (tipOwner && !tipOwner.contains(e.target)) hideTip();
  }, true);
  window.addEventListener('scroll', () => {
    if (tipOwner && document.activeElement !== tipOwner) hideTip();
  }, { passive: true });

  /* ------------------------------------------------------------------
     SVG helpers
     ------------------------------------------------------------------ */
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const svgEl = (tag, attrs = {}, parent) => {
    const node = document.createElementNS(SVG_NS, tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (v === null || v === undefined || v === false) return;
      if (k === 'text') node.textContent = v;
      else node.setAttribute(k, v);
    });
    if (parent) parent.append(node);
    return node;
  };

  const newSvg = (host, w, h, label) => {
    const svg = svgEl('svg', { class: 'viz', width: w, height: h, viewBox: `0 0 ${w} ${h}`, role: 'img', 'aria-label': label });
    host.replaceChildren(svg);
    return svg;
  };

  // Horizontal bar with a rounded data end and a square baseline end.
  const barPath = (x0, x1, y, h, r = 4) => {
    const w = Math.abs(x1 - x0);
    if (w < 0.5) return `M${x0},${y}h0`;
    const rr = Math.min(r, w, h / 2);
    if (x1 >= x0) {
      return `M${x0},${y}H${x1 - rr}A${rr},${rr} 0 0 1 ${x1},${y + rr}V${y + h - rr}A${rr},${rr} 0 0 1 ${x1 - rr},${y + h}H${x0}Z`;
    }
    return `M${x0},${y}H${x1 + rr}A${rr},${rr} 0 0 0 ${x1},${y + rr}V${y + h - rr}A${rr},${rr} 0 0 0 ${x1 + rr},${y + h}H${x0}Z`;
  };

  // Word-wrap an SVG label into tspans no wider than maxW; returns the line count.
  const wrapText = (textNode, str, x, maxW, lineH) => {
    textNode.textContent = '';
    let tspan = svgEl('tspan', { x, dy: 0 }, textNode);
    let line = [];
    let lines = 1;
    str.split(' ').forEach(word => {
      line.push(word);
      tspan.textContent = line.join(' ');
      if (line.length > 1 && tspan.getComputedTextLength() > maxW) {
        line.pop();
        tspan.textContent = line.join(' ');
        line = [word];
        tspan = svgEl('tspan', { x, dy: lineH, text: word }, textNode);
        lines += 1;
      }
    });
    return lines;
  };

  // Use the long wording for a set of labels only if every one of them fits.
  const fitLabels = items => {
    items.forEach(it => { it.node.textContent = it.long; });
    if (items.some(it => it.node.getComputedTextLength() > it.maxW)) {
      items.forEach(it => { it.node.textContent = it.short; });
    }
  };

  /* ------------------------------------------------------------------
     Chart lifecycle: draw at the container's real width, redraw on resize,
     play the entrance once when the chart scrolls into view.
     ------------------------------------------------------------------ */
  const charts = [];
  const player = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      player.unobserve(entry.target);
      requestAnimationFrame(() => requestAnimationFrame(() => entry.target.classList.add('is-played')));
    });
  }, { threshold: 0.3 });

  const watchPlay = host => {
    if (reducedMotion()) host.classList.add('is-played');
    else player.observe(host);
  };

  const mountChart = (host, render) => {
    const chart = { width: 0 };
    chart.draw = force => {
      const w = Math.floor(host.clientWidth);
      // Below ~240px the layouts can't fit; wait for the real width.
      if (w < 240 || (!force && w === chart.width)) return;
      chart.width = w;
      render(host, w);
    };
    charts.push(chart);
    chart.draw(true);
    if ('ResizeObserver' in window) {
      new ResizeObserver(() => requestAnimationFrame(() => chart.draw(false))).observe(host);
    }
    watchPlay(host);
  };

  /* ------------------------------------------------------------------
     Fig. 1 — waffles: where the help-seeking gap lives
     ------------------------------------------------------------------ */
  const renderHero = (host, W) => {
    const stacked = W < 420;
    const innerGap = 14;
    const groupGap = 30;
    const waf = stacked ? Math.min(124, (W - innerGap) / 2) : (W - groupGap - innerGap * 2) / 4;
    const pitch = waf / 10;
    const size = pitch - Math.max(1.5, pitch * 0.16);
    const headH = 32;
    const footH = 52;
    const groupW = waf * 2 + innerGap;
    const groupH = headH + waf + footH;
    const H = Math.ceil(stacked ? groupH * 2 + 18 : groupH);
    const offsetX = stacked ? (W - groupW) / 2 : 0;
    const svg = newSvg(host, W, H, 'Waffle charts of course help-seeking at less selective four-year institutions. Off campus: 49 percent of lower-SES students versus 63 percent of higher-SES students. On campus: 68 percent versus 68 percent.');

    HERO.forEach((block, bi) => {
      const gx = stacked ? offsetX : bi * (groupW + groupGap);
      const gy = stacked ? bi * (groupH + 18) : 0;
      svgEl('text', { x: gx, y: gy + 13, class: 't-strong', style: 'font-size:13px', text: block.place }, svg);
      svgEl('text', { x: gx + groupW, y: gy + 13, 'text-anchor': 'end', class: 't-muted t-mono', text: block.note }, svg);
      svgEl('line', { x1: gx, x2: gx + groupW, y1: gy + 22.5, y2: gy + 22.5, class: 'grid' }, svg);

      block.groups.forEach((d, di) => {
        const wx = gx + di * (waf + innerGap);
        const wy = gy + headH;
        const g = svgEl('g', {}, svg);
        svgEl('rect', { x: wx - 5, y: wy - 5, width: waf + 10, height: waf + footH, rx: 8, class: 'hit' }, g);
        const delay = (bi * 2 + di) * 150;
        for (let i = 0; i < 100; i += 1) {
          const on = i < d.v;
          svgEl('rect', {
            x: (wx + (i % 10) * pitch).toFixed(2),
            y: (wy + (9 - Math.floor(i / 10)) * pitch).toFixed(2),
            width: size.toFixed(2),
            height: size.toFixed(2),
            rx: Math.min(2, size / 4).toFixed(2),
            class: on ? `cell on ${d.cls}` : 'cell',
            style: on ? `--d:${delay + i * 8}ms` : null,
          }, g);
        }
        svgEl('text', { x: wx, y: wy + waf + 27, class: 't-big', text: `${d.v}%` }, g);
        svgEl('rect', { x: wx, y: wy + waf + 36, width: 9, height: 9, rx: 2.5, class: `f-${d.cls}` }, g);
        svgEl('text', { x: wx + 14, y: wy + waf + 44.5, class: 't-muted', text: d.who }, g);
        bindTip(g, [{ title: block.place }, { key: d.cls, value: `${d.v}%`, label: `of ${d.who.toLowerCase()} students sought course help` }]);
      });
    });
  };

  /* ------------------------------------------------------------------
     Open Doors — diverging bars of SES gradients
     ------------------------------------------------------------------ */
  const renderGradients = (host, W) => {
    const stacked = W < 440;
    const labelW = stacked ? 0 : Math.min(200, Math.round(W * 0.4));
    const rowH = stacked ? 42 : 30;
    const barH = 12;
    const top = 4;
    const yEnd = top + GRADIENTS.length * rowH;
    const H = yEnd + 28;
    const plotL = stacked ? 0 : labelW + 12;
    const pad = 40;
    const half = (W - plotL - 2 * pad) / 2;
    const zero = plotL + pad + half;
    const unit = half / 30;
    const svg = newSvg(host, W, H, 'Bar chart of SES gradients in resource use, in percentage points: course help +27.0, academic support services +18.7, career services +18.3, study abroad +15.7, research with faculty +14.6, community project in a course +10.7, financial aid advising −25.8.');

    // Stacked rows put labels above the bars, so the zero line only crosses bar bands there.
    if (!stacked) svgEl('line', { x1: zero, x2: zero, y1: top, y2: yEnd, class: 'zero' }, svg);

    GRADIENTS.forEach((d, i) => {
      const y0 = top + i * rowH;
      const cls = d.focus ? 's2' : 's1';
      const g = svgEl('g', {}, svg);
      svgEl('rect', { x: 0, y: y0, width: W, height: rowH, rx: 6, class: 'row-bg' }, g);
      svgEl('rect', { x: 0, y: y0, width: W, height: rowH, class: 'hit' }, g);
      const barY = stacked ? y0 + 22 : y0 + (rowH - barH) / 2;
      if (stacked) svgEl('line', { x1: zero, x2: zero, y1: barY - 4, y2: barY + barH + 4, class: 'zero' }, g);
      if (stacked) {
        svgEl('text', { x: 0, y: y0 + 14, class: 't-ink', text: d.label }, g);
      } else {
        const t = svgEl('text', { x: 0, y: y0 + rowH / 2 + 4, class: 't-ink' }, g);
        const lines = wrapText(t, d.label, 0, labelW, 13);
        if (lines > 1) t.setAttribute('y', y0 + rowH / 2 + 4 - (lines - 1) * 6.5);
      }
      const x1 = zero + d.v * unit;
      svgEl('path', {
        d: barPath(zero, x1, barY, barH),
        class: `bar lift f-${cls} ${d.v >= 0 ? 'from-left' : 'from-right'}`,
        style: `--d:${i * 70}ms`,
      }, g);
      svgEl('text', {
        x: d.v >= 0 ? x1 + 6 : x1 - 6,
        y: barY + barH / 2 + 4,
        'text-anchor': d.v >= 0 ? 'start' : 'end',
        class: 't-strong t-num fade',
        style: `--d:${450 + i * 70}ms`,
        text: signed(d.v),
      }, g);
      bindTip(g, [{ title: d.label }, { key: cls, value: `${signed(d.v)} pts`, label: d.type.toLowerCase() }]);
    });

    const ay = yEnd + 19;
    fitLabels([
      { node: svgEl('text', { x: zero - 8, y: ay, 'text-anchor': 'end', class: 't-muted t-small' }, svg), long: '← more use by lower SES', short: '← lower SES', maxW: zero - 8 },
      { node: svgEl('text', { x: zero + 8, y: ay, class: 't-muted t-small' }, svg), long: 'more use by higher SES →', short: 'higher SES →', maxW: W - zero - 8 },
    ]);
  };

  /* ------------------------------------------------------------------
     Same Degree — slope chart across SES terciles
     ------------------------------------------------------------------ */
  const renderSlope = (host, W) => {
    const m = { t: 18, r: W < 400 ? 100 : 118, b: 46, l: 40 };
    const H = 252;
    const iw = W - m.l - m.r;
    const ih = H - m.t - m.b;
    const yv = v => m.t + ih - ((v - 45) / 40) * ih;
    const inset = Math.min(28, iw * 0.08);
    const xv = i => m.l + inset + ((iw - 2 * inset) * i) / 2;
    const svg = newSvg(host, W, H, 'Slope chart. Among graduates who began at highly selective colleges, the share in a degree-requiring job rises from 53 percent in the bottom SES tercile to 67 and 79 percent. Among graduates who began elsewhere it stays near 59, 55, and 60 percent.');

    [50, 60, 70, 80].forEach(t => {
      svgEl('line', { x1: m.l, x2: m.l + iw, y1: yv(t), y2: yv(t), class: 'grid' }, svg);
      svgEl('text', { x: m.l - 10, y: yv(t) + 4, 'text-anchor': 'end', class: 't-muted t-num t-small', text: `${t}%` }, svg);
    });
    svgEl('line', { x1: m.l, x2: m.l + iw, y1: m.t + ih, y2: m.t + ih, class: 'axis' }, svg);
    SLOPE.x.forEach((lab, i) => {
      svgEl('text', { x: xv(i), y: m.t + ih + 20, 'text-anchor': 'middle', class: 't-muted', text: lab }, svg);
    });
    svgEl('text', { x: m.l + iw / 2, y: H - 4, 'text-anchor': 'middle', class: 't-muted t-small', text: 'Family SES tercile' }, svg);

    // Crosshair columns sit under the marks; marks ignore the pointer.
    SLOPE.x.forEach((lab, i) => {
      const left = i === 0 ? m.l : (xv(i - 1) + xv(i)) / 2;
      const right = i === SLOPE.x.length - 1 ? m.l + iw : (xv(i) + xv(i + 1)) / 2;
      const g = svgEl('g', { class: 'xhair' }, svg);
      svgEl('rect', { x: left, y: m.t - 6, width: right - left, height: ih + 12, class: 'hit' }, g);
      svgEl('line', { x1: xv(i), x2: xv(i), y1: m.t, y2: m.t + ih, class: 'xhair-line' }, g);
      bindTip(g, () => [
        { title: `${lab} SES tercile` },
        ...SLOPE.series.map(sr => ({ key: sr.cls, value: `${sr.v[i]}%`, label: sr.name.toLowerCase() })),
      ]);
    });

    SLOPE.series.forEach((sr, si) => {
      const d = sr.v.map((v, i) => `${i ? 'L' : 'M'}${xv(i).toFixed(1)},${yv(v).toFixed(1)}`).join('');
      svgEl('path', { d, pathLength: 1, class: `line draw k-${sr.cls}`, style: `--d:${si * 220}ms` }, svg);
    });
    SLOPE.series.forEach((sr, si) => {
      sr.v.forEach((v, i) => {
        svgEl('circle', { cx: xv(i), cy: yv(v), r: 5, class: `ring pop f-${sr.cls}`, style: `--d:${350 + si * 220 + i * 160}ms` }, svg);
      });
      const ex = xv(2) + 14;
      const ey = yv(sr.v[2]);
      const lateDelay = `--d:${950 + si * 200}ms`;
      svgEl('text', { x: ex, y: ey - 1, class: 't-strong t-num fade', style: lateDelay, text: `${sr.v[2]}%` }, svg);
      svgEl('text', { x: ex, y: ey + 14, class: 't-muted t-small fade', style: lateDelay, text: sr.short }, svg);
      const sy = si === 0 ? yv(sr.v[0]) + 21 : yv(sr.v[0]) - 12;
      svgEl('text', { x: xv(0), y: sy, 'text-anchor': 'middle', class: 't-strong t-num fade', style: `--d:${500 + si * 200}ms`, text: `${sr.v[0]}%` }, svg);
    });
  };

  /* ------------------------------------------------------------------
     Belonging — forest plot of average marginal effects
     ------------------------------------------------------------------ */
  const renderForest = (host, W) => {
    const stacked = W < 430;
    const labelW = stacked ? 0 : Math.min(176, Math.round(W * 0.38));
    const rowH = stacked ? 60 : 50;
    const top = 6;
    const yEnd = top + FOREST.length * rowH;
    const H = yEnd + 46;
    const x0 = stacked ? 12 : labelW + 16;
    const x1 = W - 12;
    const xv = v => x0 + ((v + 6) / 12) * (x1 - x0);
    const svg = newSvg(host, W, H, 'Forest plot of the change in persistence per one SD of pre-college belonging: selective four-year +2.8 points (95% CI 0.7 to 5.2); non-selective four-year −1.1 (−5.3 to 3.2); broad-access two-year +1.9 (−1.7 to 5.6).');

    [-6, -3, 0, 3, 6].forEach(t => {
      svgEl('line', { x1: xv(t), x2: xv(t), y1: top, y2: yEnd, class: t === 0 ? 'zero' : 'grid' }, svg);
      svgEl('text', { x: xv(t), y: yEnd + 18, 'text-anchor': 'middle', class: 't-muted t-num t-small', text: t === 0 ? '0' : signed(t, 0) }, svg);
    });
    svgEl('text', { x: (x0 + x1) / 2, y: yEnd + 38, 'text-anchor': 'middle', class: 't-muted t-small', text: 'Percentage points' }, svg);

    FOREST.forEach((d, i) => {
      const y0 = top + i * rowH;
      const cy = stacked ? y0 + 40 : y0 + rowH / 2;
      const cls = d.sig ? 's2' : 's1';
      const interval = `${signed(d.est)} [${bound(d.lo)}, ${bound(d.hi)}]`;
      const g = svgEl('g', {}, svg);
      svgEl('rect', { x: 0, y: y0, width: W, height: rowH, rx: 6, class: 'row-bg' }, g);
      svgEl('rect', { x: 0, y: y0, width: W, height: rowH, class: 'hit' }, g);
      if (stacked) {
        svgEl('text', { x: 0, y: y0 + 17, class: 't-ink t-halo', text: d.label }, g);
        svgEl('text', { x: W, y: y0 + 17, 'text-anchor': 'end', class: 't-muted t-mono t-halo', text: interval }, g);
      } else {
        svgEl('text', { x: 0, y: cy - 3, class: 't-ink', text: d.label }, g);
        svgEl('text', { x: 0, y: cy + 13, class: 't-muted t-mono', text: interval }, g);
      }
      svgEl('line', { x1: xv(d.lo), x2: xv(d.hi), y1: cy, y2: cy, class: `ci grow k-${cls}`, style: `--d:${i * 120}ms` }, g);
      [d.lo, d.hi].forEach(v => {
        svgEl('line', { x1: xv(v), x2: xv(v), y1: cy - 5, y2: cy + 5, class: `ci fade k-${cls}`, style: `--d:${550 + i * 120}ms` }, g);
      });
      svgEl('circle', { cx: xv(d.est), cy, r: 6, class: `ring pop f-${cls}`, style: `--d:${300 + i * 120}ms` }, g);
      bindTip(g, [
        { title: d.label },
        { key: cls, value: `${signed(d.est)} pp`, label: `95% CI ${bound(d.lo)} to ${bound(d.hi)}` },
        { value: `p = ${d.p}`, label: d.sig ? 'significant at .05' : 'not significant' },
      ]);
    });
  };

  /* ------------------------------------------------------------------
     AI degrees — coverage by status tier, with the all-institution share
     ------------------------------------------------------------------ */
  const renderTiers = (host, W) => {
    const rowH = 48;
    const barH = 12;
    const top = 2;
    const valueW = 46;
    const yEnd = top + TIERS.length * rowH;
    const H = yEnd + 30;
    const x1 = W - valueW;
    const xv = v => (v / 100) * x1;
    const rx = xv(TIER_ALL);
    const svg = newSvg(host, W, H, 'Bar chart of the share of institutions offering an AI programme by the 2024 cycle: world-class universities 88 percent, world-class-discipline universities 64 percent, other public institutions 47 percent, private institutions 45 percent; 49 percent of all institutions.');

    TIERS.forEach((d, i) => {
      const y0 = top + i * rowH;
      const by = y0 + 22;
      const g = svgEl('g', {}, svg);
      svgEl('rect', { x: 0, y: y0, width: W, height: rowH, rx: 6, class: 'row-bg' }, g);
      svgEl('rect', { x: 0, y: y0, width: W, height: rowH, class: 'hit' }, g);
      svgEl('text', { x: 0, y: y0 + 14, class: 't-ink', text: d.label }, g);
      svgEl('rect', { x: 0, y: by, width: x1, height: barH, rx: 3, class: 'f-track' }, g);
      svgEl('path', { d: barPath(0, xv(d.v), by, barH), class: 'bar lift from-left f-s1', style: `--d:${i * 90}ms` }, g);
      svgEl('line', { x1: rx, x2: rx, y1: by - 5, y2: by - 1, class: 'ref' }, g);
      svgEl('line', { x1: rx, x2: rx, y1: by + barH + 1, y2: by + barH + 5, class: 'ref' }, g);
      svgEl('text', { x: W, y: by + barH / 2 + 4, 'text-anchor': 'end', class: 't-strong t-num', text: `${d.v}%` }, g);
      bindTip(g, [{ title: d.label }, { key: 's1', value: `${d.v}%`, label: 'offered AI by the 2024 cycle' }]);
    });

    svgEl('text', { x: rx, y: yEnd + 14, 'text-anchor': 'middle', class: 't-muted t-small', text: `▲ All institutions: ${Math.round(TIER_ALL)}%` }, svg);
  };

  /* ------------------------------------------------------------------
     PROTEUS — path diagram of the three-factor EFA solution
     ------------------------------------------------------------------ */
  const renderSem = (host, W) => {
    const itemH = 22;
    const itemGap = 7;
    const groupGap = 18;
    const rows = [];
    const spans = [];
    let y = 4;
    FACTORS.forEach((f, fi) => {
      const start = y;
      f.items.forEach(code => {
        rows.push({ fi, code, y, rev: Boolean(f.rev) });
        y += itemH + itemGap;
      });
      spans.push({ y0: start, y1: y - itemGap });
      y += groupGap - itemGap;
    });
    const H = Math.ceil(y - groupGap + itemGap + 4);
    const ovalRx = Math.min(82, W * 0.28);
    const ovalRy = 27;
    const ovalCx = ovalRx + 2;
    const boxW = 60;
    const boxX = W - boxW - 1;
    const svg = newSvg(host, W, H, 'Path diagram of the Enjoyment of Mathematics scale: learning value (items E01, E02, E03, E05), comfort, reverse-coded (E04, E09, E10, E12), and intrinsic enjoyment (E06, E07, E08).');

    const markerId = `ah-${Math.random().toString(36).slice(2, 8)}`;
    const marker = svgEl('marker', { id: markerId, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto' }, svgEl('defs', {}, svg));
    svgEl('path', { d: 'M0,1 L9,5 L0,9 z', class: 'arrowhead' }, marker);

    const paths = [];
    const boxes = [];
    const lit = (fi, on) => {
      paths.forEach(p => p.classList.toggle('is-lit', on && Number(p.dataset.f) === fi));
      boxes.forEach(b => b.classList.toggle('is-lit', on && Number(b.dataset.f) === fi));
    };

    FACTORS.forEach((f, fi) => {
      const cy = (spans[fi].y0 + spans[fi].y1) / 2;
      rows.filter(r => r.fi === fi).forEach((r, k) => {
        const ty = r.y + itemH / 2;
        const sx = ovalCx + ovalRx;
        const bend = Math.max(24, (boxX - sx) * 0.45);
        const p = svgEl('path', {
          d: `M${sx},${cy} C${sx + bend},${cy} ${boxX - bend},${ty} ${boxX - 2},${ty}`,
          class: 'path fade',
          'marker-end': `url(#${markerId})`,
          style: `--d:${300 + fi * 150 + k * 60}ms`,
        }, svg);
        p.dataset.f = fi;
        paths.push(p);
      });
    });

    rows.forEach((r, k) => {
      const g = svgEl('g', { class: 'fade', style: `--d:${450 + k * 40}ms` }, svg);
      const box = svgEl('rect', { x: boxX, y: r.y, width: boxW, height: itemH, rx: 4, class: 'indicator' }, g);
      box.dataset.f = r.fi;
      boxes.push(box);
      const t = svgEl('text', { x: boxX + boxW / 2, y: r.y + itemH / 2 + 4, 'text-anchor': 'middle', class: 't-ink t-mono', text: r.code }, g);
      if (r.rev) svgEl('tspan', { dy: -4, style: 'font-size:8px', text: 'R' }, t);
    });

    FACTORS.forEach((f, fi) => {
      const cy = (spans[fi].y0 + spans[fi].y1) / 2;
      const g = svgEl('g', { class: 'factor' }, svg);
      svgEl('ellipse', { cx: ovalCx, cy, rx: ovalRx, ry: ovalRy, class: 'latent pop', style: `--d:${fi * 150}ms` }, g);
      svgEl('text', { x: ovalCx, y: cy + (f.sub ? -2 : 4), 'text-anchor': 'middle', class: 't-strong fade', style: `--d:${200 + fi * 150}ms`, text: f.name }, g);
      if (f.sub) svgEl('text', { x: ovalCx, y: cy + 12, 'text-anchor': 'middle', class: 't-muted t-small fade', style: `--d:${200 + fi * 150}ms`, text: f.sub }, g);
      bindTip(g, [{ title: f.name }, { value: f.items.join(' · ') }, { label: f.gloss }]);
      g.addEventListener('tipshow', () => lit(fi, true));
      g.addEventListener('tipclear', () => lit(fi, false));
    });
  };

  /* ------------------------------------------------------------------
     Home — two children, two eras (absolute vs. relative mobility)
     ------------------------------------------------------------------ */
  const renderLadder = (host, W) => {
    const narrow = W < 460;
    const labelW = Math.round(W * (narrow ? 0.4 : 0.38));
    const top = 40;
    const gap = narrow ? 66 : 62;
    const H = top + gap * 3 + 26;
    const colW = (W - labelW) / 2;
    const lx = [labelW + colW * 0.45, labelW + colW * 1.35];
    const rail = 12;
    const yv = level => top + (3 - level) * gap;
    const svg = newSvg(host, W, H, 'Schematic of two children in two eras. Before expansion, the village child stops after middle school while the professor’s child attends a key university. After expansion, the village child earns an ordinary bachelor’s degree while the professor’s child attends an elite university and then graduate school abroad. Both climb one rung; the distance between them stays the same.');

    const markerId = `lad-${Math.random().toString(36).slice(2, 8)}`;
    const defs = svgEl('defs', {}, svg);
    LADDER.kids.forEach(kid => {
      const mk = svgEl('marker', { id: `${markerId}-${kid.cls}`, viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 6, markerHeight: 6, orient: 'auto' }, defs);
      svgEl('path', { d: 'M0,1 L9,5 L0,9 z', class: `f-${kid.cls}` }, mk);
    });

    LADDER.rungs.forEach((label, i) => {
      const t = svgEl('text', { x: 0, y: yv(i) + 4, class: 't-ink' }, svg);
      const lines = wrapText(t, label, 0, labelW - 16, 14);
      if (lines > 1) t.setAttribute('y', yv(i) + 4 - (lines - 1) * 7);
      svgEl('line', { x1: labelW - 6, x2: W, y1: yv(i), y2: yv(i), class: 'grid' }, svg);
    });

    LADDER.eras.forEach((era, e) => {
      const x = lx[e];
      // Full era names need about 110px each; narrow layouts fall back to "Before" / "After".
      svgEl('text', { x, y: 14, 'text-anchor': 'middle', class: 't-strong', text: colW < 130 ? era.short : era.label }, svg);
      [x - rail, x + rail].forEach(rx => svgEl('line', { x1: rx, x2: rx, y1: yv(3) - 16, y2: yv(0) + 16, class: 'rail' }, svg));
      for (let i = 0; i < 4; i += 1) svgEl('line', { x1: x - rail, x2: x + rail, y1: yv(i), y2: yv(i), class: 'rail' }, svg);

      // The distance between the two children in this era
      const side = e === 0 ? -1 : 1;
      const bx = x + side * (rail + 14);
      const y1 = yv(era.professor);
      const y2 = yv(era.village);
      const g = svgEl('g', { class: 'fade', style: `--d:${950 + e * 200}ms` }, svg);
      svgEl('path', { d: `M${bx - side * 4},${y1}H${bx}V${y2}H${bx - side * 4}`, class: 'bracket' }, g);
      if (!narrow || e === 1) {
        svgEl('text', { x: bx + side * 6, y: (y1 + y2) / 2 + 4, 'text-anchor': side < 0 ? 'end' : 'start', class: 't-muted t-small', text: 'gap' }, g);
      }
    });

    LADDER.kids.forEach((kid, k) => {
      const [before, after] = LADDER.eras;
      const x1 = lx[0] + rail + 8;
      const y1 = yv(before[kid.key]);
      const x2 = lx[1] - rail - 12;
      const y2 = yv(after[kid.key]);
      const mx = (x1 + x2) / 2;
      svgEl('path', {
        d: `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`,
        class: `line fade k-${kid.cls}`,
        style: `--d:${550 + k * 160}ms; stroke-width:1.5`,
        'marker-end': `url(#${markerId}-${kid.cls})`,
      }, svg);
    });

    LADDER.eras.forEach((era, e) => {
      LADDER.kids.forEach((kid, k) => {
        const cy = yv(era[kid.key]);
        const g = svgEl('g', {}, svg);
        svgEl('circle', { cx: lx[e], cy, r: 16, class: 'hit' }, g);
        svgEl('circle', { cx: lx[e], cy, r: 7, class: `ring pop f-${kid.cls}`, style: `--d:${150 + e * 380 + k * 120}ms` }, g);
        bindTip(g, [{ title: era.label }, { key: kid.cls, value: kid.name, label: LADDER.rungs[era[kid.key]].toLowerCase() }]);
      });
    });
  };

  /* ------------------------------------------------------------------
     Experience — positions over time
     ------------------------------------------------------------------ */
  const renderGantt = (host, W) => {
    const narrow = W < 440;
    const labelW = narrow ? 112 : 196;
    const rowH = 30;
    const barH = 12;
    const top = 26;
    const yEnd = top + ROLES.length * rowH;
    const H = yEnd + 28;
    const x0 = labelW + 6;
    const x1 = W - 10;
    const t0 = 2021;
    const t1 = 2027;
    const xv = t => x0 + ((t - t0) / (t1 - t0)) * (x1 - x0);
    const svg = newSvg(host, W, H, `Timeline of seven positions from May 2021 to the present: ${ROLES.map(r => `${r.label}, ${r.when}`).join('; ')}.`);

    for (let yr = t0; yr <= t1; yr += 1) {
      svgEl('line', { x1: xv(yr), x2: xv(yr), y1: top - 4, y2: yEnd, class: 'grid' }, svg);
      if (yr < t1) {
        svgEl('text', { x: (xv(yr) + xv(yr + 1)) / 2, y: yEnd + 18, 'text-anchor': 'middle', class: 't-muted t-num t-small', text: narrow ? `’${String(yr).slice(2)}` : String(yr) }, svg);
      }
    }
    const nx = xv(NOW);
    svgEl('line', { x1: nx, x2: nx, y1: top - 8, y2: yEnd, class: 'ref' }, svg);
    svgEl('text', { x: nx, y: top - 12, 'text-anchor': 'middle', class: 't-muted t-small', text: 'Now' }, svg);

    ROLES.forEach((r, i) => {
      const y0 = top + i * rowH;
      const kind = ROLE_TYPES[r.type];
      const g = svgEl('g', {}, svg);
      svgEl('rect', { x: 0, y: y0, width: W, height: rowH, rx: 6, class: 'row-bg' }, g);
      svgEl('rect', { x: 0, y: y0, width: W, height: rowH, class: 'hit' }, g);
      svgEl('text', { x: 0, y: y0 + rowH / 2 + 4, class: 't-ink', text: narrow ? r.short : r.label }, g);
      const bx = xv(r.start);
      const bw = Math.max(3, xv(r.end) - bx);
      svgEl('rect', {
        x: bx.toFixed(1), y: y0 + (rowH - barH) / 2, width: bw.toFixed(1), height: barH, rx: Math.min(4, bw / 2).toFixed(1),
        class: `bar lift from-left ${kind.mark}`,
        style: `--d:${i * 90}ms`,
      }, g);
      bindTip(g, [{ title: r.label }, { key: kind.key, value: r.when, label: r.org }]);
    });
  };

  /* ------------------------------------------------------------------
     Data tables (the accessible twin of every figure)
     ------------------------------------------------------------------ */
  const fillTable = (name, head, rows, numeric) => {
    const holder = $(`[data-table="${name}"]`);
    if (!holder) return;
    const table = document.createElement('table');
    const headRow = table.createTHead().insertRow();
    head.forEach((h, i) => {
      const th = document.createElement('th');
      th.scope = 'col';
      th.textContent = h;
      if (numeric.includes(i)) th.className = 'num';
      headRow.append(th);
    });
    const body = table.createTBody();
    rows.forEach(r => {
      const tr = body.insertRow();
      r.forEach((cell, i) => {
        const td = tr.insertCell();
        td.textContent = cell;
        if (numeric.includes(i)) td.className = 'num';
      });
    });
    holder.append(table);
  };

  fillTable('hero', ['Residence', 'SES group', 'Sought course help'],
    HERO.flatMap(b => b.groups.map(d => [b.place, d.who === 'Lower SES' ? 'Lower SES (bottom two quintiles)' : 'Higher SES (more advantaged peers)', `${d.v}%`])), [2]);
  fillTable('gradients', ['Resource', 'Type', 'Gradient (pts)'],
    GRADIENTS.map(d => [d.label, d.type, signed(d.v)]), [2]);
  fillTable('slope', ['SES tercile', ...SLOPE.series.map(s => s.short)],
    SLOPE.x.map((lab, i) => [lab, ...SLOPE.series.map(s => `${s.v[i]}%`)]), [1, 2]);
  fillTable('forest', ['Institutional field', 'AME (pp)', '95% CI', 'p'],
    FOREST.map(d => [d.label, signed(d.est), `[${bound(d.lo)}, ${bound(d.hi)}]`, d.p]), [1, 2, 3]);
  fillTable('tiers', ['Status tier', 'Share offering AI by 2024'],
    [...TIERS.map(d => [d.label, `${d.v}%`]), ['All bachelor-granting institutions', `${TIER_ALL}%`]], [1]);
  fillTable('gantt', ['Position', 'Organization', 'Dates', 'Type'],
    ROLES.map(r => [r.label, r.org, r.when, ROLE_TYPES[r.type].label]), []);

  /* ------------------------------------------------------------------
     Toolkit — methods × projects matrix (an HTML table, with a list for phones)
     ------------------------------------------------------------------ */
  const buildMatrix = host => {
    const table = document.createElement('table');
    table.className = 'mx-table';
    const caption = table.createCaption();
    caption.className = 'sr-only';
    caption.textContent = 'Methods used in each project';

    const headRow = table.createTHead().insertRow();
    const corner = document.createElement('th');
    corner.scope = 'col';
    const kicker = document.createElement('span');
    kicker.className = 'mx-kicker';
    kicker.textContent = 'Method';
    corner.append(kicker);
    headRow.append(corner);
    PROJECTS.forEach((p, pi) => {
      const th = document.createElement('th');
      th.scope = 'col';
      th.dataset.col = pi;
      const a = document.createElement('a');
      a.href = p.href;
      a.textContent = p.label;
      th.append(a);
      headRow.append(th);
    });

    const body = table.createTBody();
    let order = 0;
    METHODS.forEach(m => {
      const tr = body.insertRow();
      const th = document.createElement('th');
      th.scope = 'row';
      th.textContent = m.label;
      tr.append(th);
      PROJECTS.forEach((p, pi) => {
        const td = tr.insertCell();
        td.dataset.col = pi;
        const used = m.uses.includes(p.id);
        const mark = document.createElement('span');
        mark.className = used ? 'mx-dot' : 'mx-empty';
        mark.setAttribute('role', 'img');
        mark.setAttribute('aria-label', used ? `Used in ${p.label}` : `Not used in ${p.label}`);
        if (used) { mark.style.setProperty('--d', `${order * 26}ms`); order += 1; }
        td.append(mark);
      });
    });

    const cells = () => $$('[data-col]', table);
    table.addEventListener('pointerover', e => {
      const cell = e.target.closest('[data-col]');
      const col = cell ? cell.dataset.col : null;
      cells().forEach(c => c.classList.toggle('col-hover', col !== null && c.dataset.col === col));
    });
    table.addEventListener('pointerleave', () => cells().forEach(c => c.classList.remove('col-hover')));

    const list = document.createElement('ul');
    list.className = 'mx-list';
    METHODS.forEach(m => {
      const li = document.createElement('li');
      const name = document.createElement('b');
      name.textContent = m.label;
      const tags = document.createElement('ul');
      tags.className = 'tags';
      m.uses.forEach(id => {
        const t = document.createElement('li');
        t.textContent = PROJECTS.find(p => p.id === id).label;
        tags.append(t);
      });
      li.append(name, tags);
      list.append(li);
    });

    host.replaceChildren(table, list);
    watchPlay(host);
  };
  const matrixHost = $('[data-matrix]');
  if (matrixHost) buildMatrix(matrixHost);

  /* ------------------------------------------------------------------
     Mount figures once the chart fonts are available (or after a short wait)
     ------------------------------------------------------------------ */
  const RENDERERS = {
    hero: renderHero, gradients: renderGradients, slope: renderSlope, forest: renderForest,
    tiers: renderTiers, sem: renderSem, ladder: renderLadder, gantt: renderGantt,
  };
  let fontsLoaded = false;
  const fontLoads = document.fonts
    ? Promise.all(['400 12px "IBM Plex Sans"', '600 12px "IBM Plex Sans"', '400 11px "IBM Plex Mono"'].map(f => document.fonts.load(f))).catch(() => {})
    : Promise.resolve();
  fontLoads.then(() => { fontsLoaded = true; });
  Promise.race([fontLoads, new Promise(resolve => setTimeout(resolve, 1800))]).then(() => {
    Object.entries(RENDERERS).forEach(([name, render]) => {
      $$(`[data-chart="${name}"]`).forEach(host => mountChart(host, render));
    });
    if (!fontsLoaded) fontLoads.then(() => charts.forEach(c => c.draw(true)));
  });

  /* ------------------------------------------------------------------
     Experience filter
     ------------------------------------------------------------------ */
  const chips = $$('.filter-row .chip');
  chips.forEach(chip => chip.addEventListener('click', () => {
    const filter = chip.dataset.filter;
    chips.forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
    $$('.tl-item').forEach(item => {
      item.classList.toggle('is-hidden', filter !== 'all' && item.dataset.type !== filter);
    });
  }));

  /* ------------------------------------------------------------------
     Lightbox for the poster, slides, and report pages
     ------------------------------------------------------------------ */
  const initLightbox = lightbox => {
    const lbImg = $('.lb-figure img', lightbox);
    const lbCaption = $('.lb-figure figcaption', lightbox);
    const galleries = new Map();
    let lbState = null;

    const renderLightbox = () => {
      const list = galleries.get(lbState.name);
      const item = list[lbState.index];
      lbImg.src = item.src;
      lbImg.alt = item.alt;
      lbCaption.textContent = list.length > 1 ? `${item.caption} · ${lbState.index + 1} of ${list.length}` : item.caption;
      lightbox.toggleAttribute('data-single', list.length < 2);
    };
    const openLightbox = (name, index, trigger) => {
      lbState = { name, index, trigger };
      renderLightbox();
      if (typeof lightbox.showModal === 'function') {
        lightbox.showModal();
        document.body.style.overflow = 'hidden';
      } else {
        window.open(lbImg.src, '_blank', 'noopener');
      }
    };
    const stepLightbox = delta => {
      const n = galleries.get(lbState.name).length;
      lbState.index = (lbState.index + delta + n) % n;
      renderLightbox();
    };

    $$('[data-lightbox]').forEach(trigger => {
      const name = trigger.dataset.lightbox;
      if (!galleries.has(name)) galleries.set(name, []);
      const list = galleries.get(name);
      const img = $('img', trigger);
      const source = $('source', trigger);
      list.push({ src: source ? source.getAttribute('srcset') : img.getAttribute('src'), alt: img.alt, caption: trigger.dataset.caption || '' });
      const index = list.length - 1;
      trigger.addEventListener('click', () => openLightbox(name, index, trigger));
    });

    $('.lb-prev', lightbox).addEventListener('click', () => stepLightbox(-1));
    $('.lb-next', lightbox).addEventListener('click', () => stepLightbox(1));
    $('.lb-close', lightbox).addEventListener('click', () => lightbox.close());
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox || e.target.classList.contains('lb-inner') || e.target.classList.contains('lb-figure')) lightbox.close();
    });
    lightbox.addEventListener('keydown', e => {
      if (!lbState) return;
      if (e.key === 'ArrowLeft') stepLightbox(-1);
      if (e.key === 'ArrowRight') stepLightbox(1);
    });
    lightbox.addEventListener('close', () => {
      document.body.style.overflow = '';
      lbState?.trigger?.focus();
    });
  };
  const lightboxEl = $('#lightbox');
  if (lightboxEl) initLightbox(lightboxEl);

  /* ------------------------------------------------------------------
     Essay page: English translation / Chinese original
     ------------------------------------------------------------------ */
  const langButtons = $$('.lang-toggle [data-lang]');
  if (langButtons.length) {
    const setLang = lang => {
      langButtons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
      $$('[data-lang-panel]').forEach(panel => { panel.hidden = panel.dataset.langPanel !== lang; });
      $$('[data-lang-show]').forEach(node => { node.hidden = node.dataset.langShow !== lang; });
    };
    langButtons.forEach(button => button.addEventListener('click', () => {
      setLang(button.dataset.lang);
      try { localStorage.setItem('essay-lang', button.dataset.lang); } catch (e) { /* remembered for this visit only */ }
    }));
    let saved = null;
    try { saved = localStorage.getItem('essay-lang'); } catch (e) { /* storage blocked */ }
    if (location.hash === '#zh') saved = 'zh';
    if (saved === 'zh' || saved === 'en') setLang(saved);
  }

  /* ------------------------------------------------------------------
     Copy email
     ------------------------------------------------------------------ */
  $$('[data-copy]').forEach(button => {
    const label = button.textContent;
    button.addEventListener('click', async () => {
      let copied = false;
      try {
        await navigator.clipboard.writeText(button.dataset.copy);
        copied = true;
      } catch (e) { /* clipboard blocked; the address stays visible to select */ }
      button.textContent = copied ? 'Copied ✓' : 'Select to copy';
      setTimeout(() => { button.textContent = label; }, 1800);
    });
  });
})();
