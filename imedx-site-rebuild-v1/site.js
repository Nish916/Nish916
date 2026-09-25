(() => {
  window.dataLayer = window.dataLayer || [];

  const body = document.body;
  const context = {
    page_type: body.dataset.pageType || "page",
    product: body.dataset.product || "",
    solution: body.dataset.solution || "",
    persona: body.dataset.persona || "",
    content_group: body.dataset.contentGroup || "",
    environment: "prototype"
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
      link.closest(".hero,.home-hero,.pagehero,.hcs-hero,.persona-hero,.rcm-hero,.resource-hero,.detail-hero,.v2-hero") ? "hero" :
      "content";

    if (/persona-(cfo|him-manager|coder)\.html/i.test(href)) {
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
      push("homepage_hcs_module_view", {
        module_name: step.dataset.title || "",
        module_index: index + 1
      });
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
  const trackedSections = [...document.querySelectorAll("[data-track-section]")];
  if (trackedSections.length && "IntersectionObserver" in window) {
    const seenSections = new Set();
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const name = entry.target.dataset.trackSection || "";
        if (!entry.isIntersecting || seenSections.has(name)) return;
        seenSections.add(name);
        push("section_view", { section_name: name });
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