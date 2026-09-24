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