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
      link.closest(".hero,.pagehero,.hcs-hero,.persona-hero,.rcm-hero,.resource-hero") ? "hero" :
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
    ".section > .wrap, .cta > .wrap, .route, .resource, .service, .benefit, .module-card, .journey-card, .outcome, .support, .integration, .audience, .option, .feature, .stage, .problem-point, .loop-step"
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