/* AwesomeTravelPlans.com — site behavior
   1. Mobile navigation
   2. Newsletter signup -> CRM form endpoint
   3. Scroll effects, reveal animations, filters
   No dependencies. */

(function () {
  "use strict";

  /* ------------------------------------------------------------------
     CRM configuration — the only place you should need to edit.
     Public form: https://my-crm-two-wheat.vercel.app/f/K25TqC0JChcZC5JwecRu
     ------------------------------------------------------------------ */
  var CRM_BASE = "https://my-crm-two-wheat.vercel.app";
  var CRM_FORM_ID = "K25TqC0JChcZC5JwecRu";
  var CRM_ENDPOINT = CRM_BASE + "/api/forms/" + CRM_FORM_ID + "/submit";
  var SUPPORT_EMAIL = "hello@awesometravelplans.com";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Mobile nav ---------- */
  var header = document.querySelector(".site-header");
  var navToggle = document.querySelector(".nav-toggle");
  var navLinks = document.getElementById("primary-nav");

  if (navToggle && navLinks) {
    var closeNav = function () {
      navToggle.setAttribute("aria-expanded", "false");
      navLinks.classList.remove("is-open");
    };

    navToggle.addEventListener("click", function () {
      var open = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!open));
      navLinks.classList.toggle("is-open", !open);
    });

    navLinks.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });

    document.addEventListener("click", function (e) {
      if (!header || !header.contains(e.target)) closeNav();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 820) closeNav();
    });
  }

  /* ---------- Header shadow on scroll ---------- */
  if (header) {
    var setHeaderState = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    setHeaderState();
    window.addEventListener("scroll", setHeaderState, { passive: true });
  }

  /* ---------- Newsletter forms ---------- */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setStatus(form, message) {
    var status = form.querySelector(".form-status");
    if (status) status.textContent = message || "";
  }

  function markInvalid(input, invalid) {
    if (!input) return;
    if (invalid) {
      input.setAttribute("aria-invalid", "true");
    } else {
      input.removeAttribute("aria-invalid");
    }
  }

  function showSuccess(form, name) {
    var first = (name || "").trim().split(/\s+/)[0];
    var panel = document.createElement("div");
    panel.className = "signup-success";
    panel.setAttribute("role", "status");

    var check = document.createElement("span");
    check.className = "check";
    check.setAttribute("aria-hidden", "true");
    check.textContent = "✓";

    var text = document.createElement("div");
    var strong = document.createElement("strong");
    strong.textContent = first ? "You're in, " + first + "." : "You're in.";
    var p = document.createElement("p");
    p.textContent =
      "The next Deals Brief lands in your inbox on Sunday. Add hello@awesometravelplans.com to your contacts so it doesn't get lost.";

    text.appendChild(strong);
    text.appendChild(p);
    panel.appendChild(check);
    panel.appendChild(text);

    form.innerHTML = "";
    form.appendChild(panel);
  }

  function bindNewsletter(form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (form.dataset.loading === "true") return;

      var nameInput = form.querySelector('input[name="name"]');
      var emailInput = form.querySelector('input[name="email"]');
      var honey = form.querySelector('input[name="company"]');
      var button = form.querySelector('button[type="submit"]');
      var name = nameInput ? nameInput.value.trim() : "";
      var email = emailInput ? emailInput.value.trim() : "";

      setStatus(form, "");
      markInvalid(nameInput, false);
      markInvalid(emailInput, false);

      // Honeypot: real people leave this empty.
      if (honey && honey.value.trim() !== "") return;

      if (name.length < 2) {
        markInvalid(nameInput, true);
        setStatus(form, "Please add your first name.");
        if (nameInput) nameInput.focus();
        return;
      }

      if (!EMAIL_RE.test(email)) {
        markInvalid(emailInput, true);
        setStatus(form, "That email doesn't look quite right — mind checking it?");
        if (emailInput) emailInput.focus();
        return;
      }

      form.dataset.loading = "true";
      if (button) {
        button.disabled = true;
        button.dataset.label = button.innerHTML;
        button.textContent = "Adding you…";
      }

      fetch(CRM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values: { name: name, email: email } })
      })
        .then(function (res) {
          return res
            .json()
            .catch(function () {
              return {};
            })
            .then(function (data) {
              if (!res.ok || data.ok === false) {
                throw new Error(data.error || "Signup failed");
              }
              return data;
            });
        })
        .then(function (data) {
          showSuccess(form, name);
        })
        .catch(function () {
          form.dataset.loading = "false";
          if (button) {
            button.disabled = false;
            if (button.dataset.label) button.innerHTML = button.dataset.label;
          }
          var status = form.querySelector(".form-status");
          if (status) {
            status.textContent = "We couldn't add you just now. ";
            var link = document.createElement("a");
            link.href = "mailto:" + SUPPORT_EMAIL + "?subject=Newsletter%20signup";
            link.textContent = "Email us";
            status.appendChild(link);
            status.appendChild(document.createTextNode(" and we'll add you by hand."));
          }
        });
    });

    // Clear validation styling as soon as the person starts fixing it.
    form.addEventListener("input", function (e) {
      if (e.target.matches("input")) {
        markInvalid(e.target, false);
        if (e.target.name === "email" || e.target.name === "name") setStatus(form, "");
      }
    });
  }

  document.querySelectorAll("[data-newsletter-form]").forEach(bindNewsletter);

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) {
        el.classList.add("is-visible");
      });
    } else {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
      );

      revealEls.forEach(function (el, i) {
        if (el.dataset.delay) el.style.transitionDelay = el.dataset.delay + "ms";
        else if (i % 3) el.style.transitionDelay = (i % 3) * 70 + "ms";
        observer.observe(el);
      });
    }
  }

  /* ---------- Category / region filters ---------- */
  document.querySelectorAll("[data-filter-group]").forEach(function (group) {
    var targetSelector = group.getAttribute("data-filter-target");
    var target = targetSelector ? document.querySelector(targetSelector) : null;
    if (!target) return;

    var buttons = group.querySelectorAll("[data-filter]");
    var items = target.querySelectorAll("[data-category]");

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var filter = btn.getAttribute("data-filter");
        buttons.forEach(function (b) {
          b.setAttribute("aria-pressed", String(b === btn));
        });
        items.forEach(function (item) {
          var match =
            filter === "all" || item.getAttribute("data-category") === filter;
          item.hidden = !match;
        });
      });
    });
  });

  /* ---------- Reading progress ---------- */
  var progress = document.querySelector(".read-progress");
  if (progress) {
    var updateProgress = function () {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var pct = max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0;
      progress.style.width = pct + "%";
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
