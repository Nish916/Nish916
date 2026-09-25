(() => {
  window.dataLayer = window.dataLayer || [];

  const body = document.body;
  const context = {
    page_type: body.dataset.pageType || "page",
    product: body.dataset.product || "",
    solution: body.dataset.solution || "",
    persona: body.dataset.persona || "",
    content_group: body.dataset.contentGroup || "",
    environment: location.hostname.includes("vercel.app") ? "staging" : "production"
  };

  window.dataLayer.push({ event: "page_context", ...context });

  // Accessibility and responsive navigation.
  const header = document.querySelector("header");
  const nav = document.querySelector(".nav");
  const navlinks = document.querySelector(".navlinks");
  const main = document.querySelector("main");

  if (main && !main.id) main.id = "main-content";

  if (header && main && !document.querySelector(".skip-link")) {
    const skip = document.createElement("a");
    skip.className = "skip-link";
    skip.href = "#main-content";
    skip.textContent = "Skip to main content";
    document.body.insertBefore(skip, document.body.firstChild);
  }

  if (nav && navlinks && !document.querySelector(".menu-toggle")) {
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "menu-toggle";
    toggle.setAttribute("aria-label", "Open navigation");
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML = "☰";
    nav.insertBefore(toggle, navlinks);

    const closeMenu = () => {
      navlinks.classList.remove("mobile-open");
      document.body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation");
      toggle.innerHTML = "☰";
    };

    toggle.addEventListener("click", () => {
      const open = navlinks.classList.toggle("mobile-open");
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      toggle.innerHTML = open ? "×" : "☰";
    });

    navlinks.addEventListener("click", (e) => {
      if (e.target.closest("a") && window.matchMedia("(max-width: 980px)").matches) closeMenu();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (!window.matchMedia("(max-width: 980px)").matches) closeMenu();
    });
  }

  // Mark the current local page in navigation where possible.
  const currentFile = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll("a[href]").forEach((link) => {
    const raw = (link.getAttribute("href") || "").split("#")[0].toLowerCase();
    if (raw && raw === currentFile) link.setAttribute("aria-current", "page");
  });

  const push = (event, params = {}) => {
    window.dataLayer.push({ event, ...context, ...params });
  };

  const cleanText = (el) => (el?.textContent || "").replace(/\s+/g, " ").trim().slice(0, 120);

  document.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!link) return;

    const href = link.getAttribute("href") || "";
    const text = cleanText(link);
    const location = link.closest("header") ? "header" :
      link.closest("footer") ? "footer" :
      link.closest(".cta") ? "cta_section" :
      link.closest(".hero,.home-hero,.v9-hero,.pagehero,.hcs-hero,.hcs-v10-hero,.persona-hero,.rcm-hero,.resource-hero,.detail-hero,.product-v10-hero,.v2-hero") ? "hero" :
      "content";

    if (/persona-(cfo|him-manager|coder)\.html/i.test(href) && !link.closest("[data-audience-combobox]")) {
      const personaName = href.includes("cfo") ? "CFO" : href.includes("him-manager") ? "Health Information Manager" : "Coder";
      push("persona_select", { persona_name: personaName, source_component: location, link_text: text });
    }

    if (/resource-hub\.html/i.test(href)) {
      push("resource_click", { resource_title: text || "Resource Hub", source_component: location });
    }

    if (/hcs-v2\.html/i.test(href)) {
      push("hcs_v2_campaign_click", { cta_text: text, source_component: location });
    }

    if (/validate hcs|casemix|validation blueprint/i.test(text)) {
      push("casemix_validation_click", { cta_text: text, cta_location: location, destination: href });
    }

    if (/\.(pdf|docx?|xlsx?|pptx?)(\?|$)/i.test(href)) {
      push("file_download", { file_name: href.split("/").pop()?.split("?")[0] || "", link_text: text });
    }

    if (href.startsWith("tel:")) push("click_phone", { cta_location: location });
    if (href.startsWith("mailto:")) push("click_email", { cta_location: location });

    const isContact = /imedx\.com\.au\/contact/i.test(href);
    const isDemo = /demo|register/i.test(text);
    if (isContact && isDemo) {
      push("demo_cta_click", { cta_text: text, cta_location: location, destination: href });
    } else if (isContact) {
      push("contact_cta_click", { cta_text: text, cta_location: location, destination: href });
    }

    try {
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin && !href.startsWith("mailto:") && !href.startsWith("tel:")) {
        push("outbound_click", { destination_domain: url.hostname, link_text: text, cta_location: location });
      }
    } catch (_) {}
  });

  document.querySelectorAll("[data-audience-combobox]").forEach((box) => {
    const trigger = box.querySelector(".audience-trigger");
    const menu = box.querySelector(".audience-menu");
    const options = [...box.querySelectorAll(".audience-option")];
    if (!trigger || !menu) return;

    const close = () => {
      trigger.setAttribute("aria-expanded", "false");
      menu.hidden = true;
    };
    const open = () => {
      trigger.setAttribute("aria-expanded", "true");
      menu.hidden = false;
    };

    trigger.addEventListener("click", () => {
      const expanded = trigger.getAttribute("aria-expanded") === "true";
      expanded ? close() : open();
    });

    options.forEach((option) => {
      option.addEventListener("click", () => {
        push("persona_select", {
          persona_name: option.dataset.persona || cleanText(option),
          source_component: "hcs_modern_dropdown",
          link_text: cleanText(option)
        });
        close();
      });
    });

    document.addEventListener("click", (e) => {
      if (!box.contains(e.target)) close();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  });

  // Progressive reveal for sections/cards. Pure presentation; content is unchanged.
  const revealTargets = document.querySelectorAll(
    ".section > .wrap, .cta > .wrap, .v9-value-track > div, .v9-solution-row, .v9-role-shell, .v9-doc-grid, .v9-rcm-line article, .v9-outcome-grid article, .v9-resource-track article, .v9-final-grid, .neo-signal-grid article, .neo-bento-card, .neo-product-shell, .neo-module-rail article, .neo-docs-grid, .neo-rcm-flow article, .neo-audience-grid > a, .neo-resource-grid article, .neo-final-grid, .home-beliefs article, .home-solution-card, .home-product-grid, .home-documentation-grid, .home-rcm-grid, .home-audience-card, .home-resource-grid article, .home-final-cta-grid, .route, .resource, .service, .benefit, .module-card, .journey-card, .outcome, .support, .integration, .audience, .option, .feature, .stage, .problem-point, .loop-step"
  );
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
    revealTargets.forEach((el) => el.classList.add("reveal-ready"));
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("reveal-in");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -24px 0px" });
    revealTargets.forEach((el) => revealObserver.observe(el));
  }

  // Homepage HCS scrollytelling: real iMedX screens + existing product copy.
  const hcsSteps = [...document.querySelectorAll("[data-hcs-step]")];
  const hcsImage = document.getElementById("v9-hcs-screen-image");
  const hcsTitle = document.getElementById("v9-hcs-screen-title");
  const hcsCount = document.getElementById("v9-hcs-count");
  const hcsProgress = document.getElementById("v9-hcs-progress");
  if (hcsSteps.length && hcsImage && hcsTitle) {
    const seenHomepageHcsModules = new Set();
    const setHcsStep = (step) => {
      const index = Number(step.dataset.index || 0);
      hcsSteps.forEach((s) => s.classList.toggle("is-active", s === step));
      hcsImage.classList.add("is-changing");
      window.setTimeout(() => {
        hcsImage.src = step.dataset.image || hcsImage.src;
        hcsImage.alt = step.dataset.alt || hcsImage.alt;
        hcsTitle.textContent = step.dataset.title || "";
        if (hcsCount) hcsCount.textContent = String(index + 1).padStart(2, "0") + " / " + String(hcsSteps.length).padStart(2, "0");
        if (hcsProgress) hcsProgress.style.width = (((index + 1) / hcsSteps.length) * 100) + "%";
        hcsImage.classList.remove("is-changing");
      }, 110);
      const moduleName = step.dataset.title || "";
      if (!seenHomepageHcsModules.has(moduleName)) {
        seenHomepageHcsModules.add(moduleName);
        push("homepage_hcs_module_view", { module_name: moduleName, module_index: index + 1 });
      }
    };

    if ("IntersectionObserver" in window && !window.matchMedia("(max-width: 980px)").matches) {
      const hcsObserver = new IntersectionObserver((entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setHcsStep(visible.target);
      }, { threshold: [0.35, 0.55, 0.7], rootMargin: "-18% 0px -34% 0px" });
      hcsSteps.forEach((step) => hcsObserver.observe(step));
    } else {
      hcsSteps.forEach((step) => step.addEventListener("click", () => setHcsStep(step)));
    }
  }

  // HCS product-page scrollytelling.
  const hcsPageSteps = [...document.querySelectorAll("[data-hcs-page-step]")];
  const hcsPageImage = document.getElementById("hcs-page-screen-image");
  const hcsPageTitle = document.getElementById("hcs-page-screen-title");
  const hcsPageCount = document.getElementById("hcs-page-count");
  const hcsPageProgress = document.getElementById("hcs-page-progress");
  if (hcsPageSteps.length && hcsPageImage && hcsPageTitle) {
    const seenHcsPageModules = new Set();
    const setHcsPageStep = (step) => {
      const index = Number(step.dataset.index || 0);
      hcsPageSteps.forEach((s) => s.classList.toggle("is-active", s === step));
      hcsPageImage.classList.add("is-changing");
      window.setTimeout(() => {
        hcsPageImage.src = step.dataset.image || hcsPageImage.src;
        hcsPageImage.alt = step.dataset.alt || hcsPageImage.alt;
        hcsPageTitle.textContent = step.dataset.title || "";
        if (hcsPageCount) hcsPageCount.textContent = String(index + 1).padStart(2, "0") + " / " + String(hcsPageSteps.length).padStart(2, "0");
        if (hcsPageProgress) hcsPageProgress.style.width = (((index + 1) / hcsPageSteps.length) * 100) + "%";
        hcsPageImage.classList.remove("is-changing");
      }, 110);
      const moduleName = step.dataset.title || "";
      if (!seenHcsPageModules.has(moduleName)) {
        seenHcsPageModules.add(moduleName);
        push("hcs_page_module_view", { module_name: moduleName, module_index: index + 1 });
      }
    };
    if ("IntersectionObserver" in window && !window.matchMedia("(max-width: 1080px)").matches) {
      const observer = new IntersectionObserver((entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a,b) => b.intersectionRatio-a.intersectionRatio)[0];
        if (visible) setHcsPageStep(visible.target);
      }, { threshold:[0.35,0.55,0.7], rootMargin:"-18% 0px -34% 0px" });
      hcsPageSteps.forEach((step) => observer.observe(step));
    } else {
      hcsPageSteps.forEach((step) => step.addEventListener("click", () => setHcsPageStep(step)));
    }
  }

  // Homepage role switcher.
  document.querySelectorAll("[data-role-switcher]").forEach((switcher) => {
    const tabs = [...switcher.querySelectorAll("[data-role-tab]")];
    const panels = [...switcher.querySelectorAll("[data-role-panel]")];
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const key = tab.dataset.roleTab || "";
        tabs.forEach((t) => {
          const active = t === tab;
          t.classList.toggle("is-active", active);
          t.setAttribute("aria-selected", String(active));
        });
        panels.forEach((panel) => {
          const active = panel.dataset.rolePanel === key;
          panel.classList.toggle("is-active", active);
          panel.hidden = !active;
        });
        push("homepage_role_select", { role_key: key, role_label: cleanText(tab) });
      });
    });
  });

  // Homepage clinical documentation switcher.
  document.querySelectorAll("[data-doc-tabs]").forEach((group) => {
    const tabs = [...group.querySelectorAll("[data-doc-tab]")];
    const section = group.closest(".v9-doc-grid");
    const panels = section ? [...section.querySelectorAll("[data-doc-panel]")] : [];
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const key = tab.dataset.docTab || "";
        tabs.forEach((t) => t.classList.toggle("is-active", t === tab));
        panels.forEach((panel) => {
          const active = panel.dataset.docPanel === key;
          panel.classList.toggle("is-active", active);
          panel.hidden = !active;
        });
        push("homepage_documentation_select", { documentation_path: key, link_text: cleanText(tab) });
      });
    });
  });

  // Section-view analytics for homepage and future long-form pages.
  const trackedSections = [...new Set([...document.querySelectorAll("[data-track-section], main > section")])];
  if (trackedSections.length && "IntersectionObserver" in window) {
    const seenSections = new Set();
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const fallbackIndex = trackedSections.indexOf(entry.target) + 1;
        const name = entry.target.dataset.trackSection || (context.page_type + "_section_" + fallbackIndex);
        if (seenSections.has(name)) return;
        seenSections.add(name);
        push("section_view", { section_name: name, section_index: fallbackIndex });
      });
    }, { threshold: 0.35 });
    trackedSections.forEach((section) => sectionObserver.observe(section));
  }

  const thresholds = [50, 75, 90];
  const sent = new Set();
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (max <= 0) return;
    const pct = Math.round((window.scrollY / max) * 100);
    thresholds.forEach((threshold) => {
      if (pct >= threshold && !sent.has(threshold)) {
        sent.add(threshold);
        push("scroll_depth", { threshold });
      }
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  const filters = document.querySelectorAll("[data-filter]");
  const cards = document.querySelectorAll("[data-resource-type]");
  if (filters.length && cards.length) {
    filters.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.filter || "all";
        filters.forEach((b) => b.classList.toggle("active", b === button));
        let visible = 0;
        cards.forEach((card) => {
          const show = filter === "all" || card.dataset.resourceType === filter;
          card.hidden = !show;
          if (show) visible++;
        });
        push("resource_filter", { filter_name: "resource_type", filter_value: filter, result_count: visible });
      });
    });
  }
})();

/* v17 restrained motion + numeric emphasis */
(() => {
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealTargets = [
    '.v16-head','.v13-heading','.v13-split',
    '.v16-step','.v16-choice article','.v16-output','.v16-security article',
    '.v13-card','.v13-dark-card','.v13-stat','.v16-metric',
    '.v16-control','.v16-panel-card'
  ];

  const targets = [...document.querySelectorAll(revealTargets.join(','))];
  if (reduceMotion || !('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('is-inview'));
  } else {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const siblings = [...(el.parentElement?.children || [])];
        const index = Math.max(0, siblings.indexOf(el));
        el.style.transitionDelay = Math.min(index * 45, 180) + 'ms';
        el.classList.add('is-inview');
        obs.unobserve(el);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -5% 0px' });
    targets.forEach(el => io.observe(el));
  }

  const numberEls = [...document.querySelectorAll('.v13-stat strong, .v16-metric strong')];
  const animateNumber = (el) => {
    if (el.dataset.counted === '1') return;
    const original = el.textContent.trim();
    const match = original.match(/^(.*?)(\d+(?:\.\d+)?)(.*)$/);
    if (!match) return;
    const [, prefix, numStr, suffix] = match;
    const target = Number(numStr);
    if (!Number.isFinite(target) || target <= 0) return;
    el.dataset.counted = '1';
    if (reduceMotion) return;
    const decimals = (numStr.split('.')[1] || '').length;
    const duration = Math.min(1200, Math.max(650, target * 4));
    const start = performance.now();
    const frame = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const value = target * eased;
      el.textContent = prefix + value.toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = original;
    };
    requestAnimationFrame(frame);
  };

  if ('IntersectionObserver' in window && !reduceMotion) {
    const nio = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        animateNumber(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.45 });
    numberEls.forEach(el => nio.observe(el));
  }
})();


/* v18 HCS contextual sticky navigation */
(() => {
  const nav = document.querySelector('.hcs-context-nav');
  if (!nav) return;

  const links = [...nav.querySelectorAll('[data-hcs-target]')];
  const targets = links
    .map(link => document.getElementById(link.dataset.hcsTarget))
    .filter(Boolean);

  const setActive = (id) => {
    links.forEach(link => {
      const active = link.dataset.hcsTarget === id;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current','location');
      else link.removeAttribute('aria-current');
    });
  };

  links.forEach(link => {
    link.addEventListener('click', () => setActive(link.dataset.hcsTarget));
  });

  if ('IntersectionObserver' in window) {
    const ratios = new Map();
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0));
      const visible = [...ratios.entries()].sort((a,b) => b[1]-a[1])[0];
      if (visible && visible[1] > 0) setActive(visible[0]);
    }, {
      rootMargin:'-150px 0px -58% 0px',
      threshold:[0,.08,.18,.35,.55]
    });
    targets.forEach(el => io.observe(el));
  }

  const initial = location.hash.replace('#','');
  if (links.some(l => l.dataset.hcsTarget === initial)) setActive(initial);
  else setActive('modules');
})();

/* v19 HCS Readiness Assessment */
(() => {
  const form=document.querySelector('[data-readiness-tool]');
  const result=document.querySelector('[data-readiness-result]');
  if(!form||!result) return;
  const push=(event,data={})=>{window.dataLayer=window.dataLayer||[];window.dataLayer.push({event,...data})};
  let started=false;
  form.addEventListener('change',()=>{if(!started){started=true;push('tool_start',{tool_name:'hcs_readiness_assessment',product:'HIM Companion Suite'})}});
  form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const fd=new FormData(form); let score=0; let answered=0;
    for(const v of fd.values()){score+=Number(v)||0;answered++}
    if(answered<8) return;
    let title,copy,band;
    if(score<=6){band='foundation';title='Foundation stage';copy='Your organisation may benefit from clarifying governance, baselines and workflow ownership before progressing to a structured HCS validation discussion.'}
    else if(score<=12){band='developing';title='Developing readiness';copy='Several foundations appear to be in place. Focus next on the weaker dimensions, especially governance, data quality, integration and assurance before scaling evaluation.'}
    else{band='validation_ready';title='Ready for structured validation';copy='Your responses suggest a stronger foundation for a governed evaluation. The next step is to validate assumptions against your own casemix, workflow, controls and measurable baselines.'}
    result.hidden=false;result.querySelector('[data-result-title]').textContent=title;result.querySelector('[data-result-copy]').textContent=copy;result.querySelector('[data-result-score]').textContent=score;
    result.scrollIntoView({behavior:'smooth',block:'center'});
    push('tool_complete',{tool_name:'hcs_readiness_assessment',score,readiness_band:band,product:'HIM Companion Suite'});
  });
  form.addEventListener('reset',()=>{result.hidden=true;started=false});
})();
