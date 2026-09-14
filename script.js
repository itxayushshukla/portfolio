/* =========================================================
   AYUSH SHUKLA — DIGITAL PROFILE — script.js
   ========================================================= */
(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(pointer: coarse)").matches;

  /* ---------------------------------------------------
     1. LOADING SCREEN
  --------------------------------------------------- */
  const loader = document.getElementById("loader");
  const loaderFill = document.getElementById("loaderFill");
  const loaderPct = document.getElementById("loaderPct");

  function runLoader() {
    let pct = 0;
    const finish = () => {
      loaderFill.style.width = "100%";
      loaderPct.textContent = "100%";
      setTimeout(() => {
        loader.classList.add("done");
        document.body.classList.add("loaded");
      }, 350);
    };
    if (prefersReducedMotion) { finish(); return; }
    const step = () => {
      pct += Math.random() * 18 + 6;
      if (pct >= 100) { finish(); return; }
      loaderFill.style.width = pct + "%";
      loaderPct.textContent = Math.floor(pct) + "%";
      setTimeout(step, 140 + Math.random() * 160);
    };
    step();
  }
  window.addEventListener("load", () => setTimeout(runLoader, 250));
  setTimeout(runLoader, 2600);

  /* ---------------------------------------------------
     2. NAVBAR — scroll state + active link + mobile menu
  --------------------------------------------------- */
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");

  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  }, { passive: true });

  hamburger.addEventListener("click", () => {
    const open = hamburger.classList.toggle("open");
    mobileMenu.classList.toggle("open", open);
    hamburger.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
  });
  mobileMenu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    hamburger.classList.remove("open");
    mobileMenu.classList.remove("open");
    document.body.style.overflow = "";
  }));

  const navLinks = document.querySelectorAll(".nav-link[data-section]");
  const sections = Array.from(navLinks).map(l => document.getElementById(l.dataset.section)).filter(Boolean);
  if (sections.length) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(l => l.classList.toggle("active", l.dataset.section === entry.target.id));
        }
      });
    }, { rootMargin: "-40% 0px -50% 0px", threshold: 0 });
    sections.forEach(s => navObserver.observe(s));
  }

  /* ---------------------------------------------------
     3. SCROLL REVEAL (single, lightweight)
  --------------------------------------------------- */
  const revealEls = document.querySelectorAll(".reveal");
  if (prefersReducedMotion) {
    revealEls.forEach(el => el.classList.add("in"));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* ---------------------------------------------------
     4. CUSTOM CURSOR (desktop only)
  --------------------------------------------------- */
  if (!isTouch) {
    document.body.classList.add("has-cursor");
    const dot = document.getElementById("cursorDot");
    const ring = document.getElementById("cursorRing");
    const cursorText = document.getElementById("cursorText");
    const glow = document.getElementById("cursorGlow");

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;

    window.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + "px"; dot.style.top = my + "px";
      glow.style.left = mx + "px"; glow.style.top = my + "px";
    });

    function animateRing() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.left = rx + "px"; ring.style.top = ry + "px";
      requestAnimationFrame(animateRing);
    }
    animateRing();

    const hoverTargets = "a, button, .tilt, [data-cursor]";
    document.addEventListener("mouseover", (e) => {
      const target = e.target.closest(hoverTargets);
      if (target) {
        document.body.classList.add("cursor-active");
        cursorText.textContent = target.dataset.cursor || "";
      }
    });
    document.addEventListener("mouseout", (e) => {
      const target = e.target.closest(hoverTargets);
      if (target) {
        document.body.classList.remove("cursor-active");
        cursorText.textContent = "";
      }
    });
  }

  /* ---------------------------------------------------
     5. BACKGROUND PARTICLE FIELD (canvas, lightweight)
  --------------------------------------------------- */
  const canvas = document.getElementById("bgCanvas");
  const ctx = canvas.getContext("2d");
  let particles = [];
  let W, H;

  function resizeCanvas() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = document.documentElement.scrollHeight;
  }

  function initParticles() {
    const count = isTouch ? 26 : Math.min(70, Math.floor((W * H) / 34000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      hue: Math.random() > 0.7 ? "cyan" : "gold"
    }));
  }

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.hue === "cyan" ? "rgba(85,214,224,0.5)" : "rgba(205,164,94,0.55)";
      ctx.fill();
    });
    if (!prefersReducedMotion) requestAnimationFrame(drawParticles);
  }

  resizeCanvas();
  initParticles();
  drawParticles();
  window.addEventListener("resize", () => { resizeCanvas(); initParticles(); }, { passive: true });

  /* ---------------------------------------------------
     6. TILT ON CARDS (desktop only)
  --------------------------------------------------- */
  if (!isTouch && !prefersReducedMotion) {
    document.querySelectorAll(".tilt").forEach(card => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(900px) rotateY(${px * 8}deg) rotateX(${-py * 8}deg) translateY(-4px)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(900px) rotateY(0) rotateX(0) translateY(0)";
      });
    });
  }

  /* ---------------------------------------------------
     7. TABS — PROJECTS / EXPERIMENTS / RESOURCES
  --------------------------------------------------- */
  const tabsSection = document.getElementById("tabs");
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");
  const tabIndicator = document.getElementById("tabIndicator");
  const tabsBar = document.querySelector(".tabs-bar");

  function moveIndicator(btn) {
    if (!btn || !tabIndicator || !tabsBar) return;
    const barRect = tabsBar.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    tabIndicator.style.width = btnRect.width + "px";
    tabIndicator.style.left = (btnRect.left - barRect.left) + "px";
  }

  function setTab(name, { scroll = false } = {}) {
    const btn = document.querySelector(`.tab-btn[data-tab="${name}"]`);
    if (!btn) return;
    tabButtons.forEach(b => { b.classList.toggle("active", b === btn); b.setAttribute("aria-selected", b === btn ? "true" : "false"); });
    tabPanels.forEach(p => p.classList.toggle("active", p.dataset.panel === name));
    moveIndicator(btn);
    if (scroll && tabsSection) {
      tabsSection.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
    }
  }

  tabButtons.forEach(btn => btn.addEventListener("click", () => setTab(btn.dataset.tab)));
  document.querySelectorAll("[data-tab-link]").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      setTab(link.dataset.tabLink, { scroll: true });
    });
  });
  window.addEventListener("load", () => moveIndicator(document.querySelector(".tab-btn.active")));
  window.addEventListener("resize", () => moveIndicator(document.querySelector(".tab-btn.active")), { passive: true });

  /* ---------------------------------------------------
     8. PROJECT DATA (shared by modal, experiments, lab)
  --------------------------------------------------- */
  const projectData = {
    pothole: {
      cat: "Computer Vision · AI",
      title: "Pothole Finder",
      img: "assets/projects/pothole.jpg",
      built: "An AI-powered road damage detection system that identifies potholes directly from road images and video. Damaged roads are often reported too late — manually surveying road conditions is slow and inconsistent, so this gives a fast, repeatable way to flag damage.",
      how: "Camera or image input is preprocessed, passed through a YOLO-based detection model, and the resulting bounding boxes highlight detected road damage in real time.",
      pipeline: ["Camera / Image", "Preprocessing", "YOLO Model", "Detection", "Bounding Box", "Road Damage Result"],
      tech: ["YOLOv12", "Computer Vision", "Python", "Deep Learning"],
      future: "Planned improvements include severity scoring, GPS-tagged reporting, and a public dashboard for municipal road audits.",
      code: "https://github.com/itxayushshukla/pothole"
    },
    jarvis: {
      cat: "Generative AI · Voice Assistant",
      title: "JARVIS — AI Voice Assistant",
      img: "assets/projects/jarvis.jpg",
      built: "An intelligent voice-based assistant that understands spoken commands, generates responses, and performs useful tasks through AI and automation — built to speed up repetitive, hands-free workflows.",
      how: "Voice input is captured and converted to text via speech recognition, processed by an AI layer to understand intent, and mapped to a response or an automated action.",
      pipeline: ["Voice Input", "Speech Recognition", "AI Processing", "Command Understanding", "Response", "Automation"],
      tech: ["Python", "AI", "Voice Recognition", "Generative AI", "Automation"],
      future: "Future work includes wake-word detection, offline speech recognition, and a plugin system for custom voice commands.",
      code: "https://github.com/itxayushshukla/jarvis-mark3"
    },
    callsystem: {
      cat: "Automation · Education Technology",
      title: "Call System — Automated Absence Follow-Up",
      img: "assets/projects/call-system.jpg",
      built: "A dashboard that pulls the day's roster, lets a staff member flag absentees, places automated follow-up calls to parents, and tracks every conversation to a clear outcome — replacing manual roster-checking and phone calls.",
      how: "The roster is loaded with each student's parent and subject-teacher details. Selected absentees are queued for an automated call; the system records call status (initiated, completed, awaiting outcome) and keeps a searchable call-history log with reason and follow-up notes.",
      pipeline: ["Today's Roster", "Mark Absentees", "Queue Calls", "Automated Call", "Call Status", "Logged Outcome"],
      tech: ["Python", "Automation", "Dashboard UI"],
      future: "Planned additions include SMS fallback when a call isn't answered and a weekly attendance-trend summary per batch.",
      code: "https://github.com/itxayushshukla/call_assistant"
    },
    resultmaker: {
      cat: "Education Technology · Data Management",
      title: "Result Maker",
      img: "assets/projects/result-maker.jpg",
      built: "A local web app for entering each student's monthly marks, remarks and attendance, organized by batch, that generates the official progress-report layout as a Word document automatically — replacing hand-built monthly reports.",
      how: "Students are organized into batches (12th Regular, 12th Repeater, 11th Regular, Crash Course). Each entry captures date, topic, marks and attendance; a single click generates a per-student or whole-batch .docx report matching the institute's existing report format.",
      pipeline: ["Select Batch", "Add / Search Student", "Enter Monthly Data", "Generate Report", "Download .docx"],
      tech: ["Python", "Flask", "python-docx", "Word Automation"],
      future: "Planned additions include a printable batch summary sheet and year-over-year performance comparison per student.",
      code: "https://github.com/itxayushshukla/result_system"
    },
    mcad: {
      cat: "Finance · Data · AI",
      title: "MC/AD — Monte Carlo Greeks via Automatic Differentiation",
      img: "assets/projects/mc-ad-greeks.jpg",
      built: "A quant-terminal-styled web app that prices options via Monte Carlo and computes Greeks directly through automatic differentiation, sidestepping the noisy, biased trade-offs of finite-difference bumping used to compute Delta, Gamma and Vega.",
      how: "A Flask backend exposes pricing, a Gamma bump-size error sweep, and a Vega surface endpoint. The pricer implements an MC pricer, AD-based Greeks, likelihood-ratio-method Gamma, a finite-difference baseline, and the closed-form Black-Scholes price for comparison.",
      pipeline: ["Monte Carlo Pricer", "Automatic Differentiation", "AD Greeks (Delta / Gamma / Vega)", "FD Baseline Comparison", "Interactive Surface / Sweep Plots"],
      tech: ["Python", "Flask", "Monte Carlo", "Automatic Differentiation"],
      future: "Planned additions include American-option Greeks and a batched multi-asset Vega surface.",
      code: "https://github.com/itxayushshukla/mc_ad_greeks_project-"
    },
    academy: {
      cat: "Frontend Development",
      title: "National Academy Website",
      img: "assets/projects/academy.jpg",
      built: "A fully responsive marketing and information website for a coaching institute, covering course details, the admission process, results, testimonials and contact functionality — giving the academy a professional online presence.",
      how: "Built with a component-based structure covering the homepage, admissions inquiry flow, results, testimonials and a contact section — all responsive across devices.",
      pipeline: null,
      tech: ["HTML", "CSS", "JavaScript", "Responsive Web Design"],
      future: "Planned additions include a student login portal and an automated admissions-inquiry pipeline.",
      link: "https://nationalacademyclasses.com"
    }
  };

  /* ---------------------------------------------------
     9. MODAL — projects + highlights (shared overlay)
  --------------------------------------------------- */
  const modalOverlay = document.getElementById("modalOverlay");
  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modalContent");
  const modalClose = document.getElementById("modalClose");

  function openModalWith(html, { compact = false } = {}) {
    modal.classList.toggle("modal-compact", compact);
    modalContent.innerHTML = html;
    modalOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    modalOverlay.classList.remove("open");
    document.body.style.overflow = "";
  }
  modalClose.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (e) => { if (e.target === modalOverlay) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  function likeButtonHTML(key) {
    const liked = isLiked(key);
    return `<button class="ig-like modal-like-btn${liked ? " liked" : ""}" data-like="${key}" aria-label="Like this project">
      <svg class="heart-icon" viewBox="0 0 24 24"><path d="M12 21s-6.7-4.35-9.33-8.02C.86 10.2 1.2 6.9 3.6 5.06 5.6 3.53 8.3 3.9 9.9 5.8L12 8.2l2.1-2.4c1.6-1.9 4.3-2.27 6.3-.74 2.4 1.84 2.74 5.14.93 7.92C18.7 16.65 12 21 12 21z"/></svg>
    </button>`;
  }

  function openProjectModal(key) {
    const p = projectData[key];
    if (!p) return;
    let pipelineHTML = "";
    if (p.pipeline) {
      pipelineHTML = `<div class="modal-section"><h4>Process</h4><div class="pipeline">` +
        p.pipeline.map((step, i) => `<span>${step}</span>` + (i < p.pipeline.length - 1 ? `<span class="arrow">→</span>` : "")).join("") +
        `</div></div>`;
    }
    openModalWith(`
      <span class="modal-cat">${p.cat}</span>
      <h2>${p.title}</h2>
      <img src="${p.img}" alt="${p.title} screenshot" class="modal-img">
      <div class="modal-like-row">${likeButtonHTML(key)}<span style="font-size:12.5px;color:var(--text-faint);font-family:'JetBrains Mono',monospace;">Like this project</span></div>
      <div class="modal-section"><h4>What I Built</h4><p>${p.built}</p></div>
      <div class="modal-section"><h4>How It Works</h4><p>${p.how}</p></div>
      ${pipelineHTML}
      <div class="modal-section"><h4>Tech</h4><div class="modal-tech">${p.tech.map(t => `<span>${t}</span>`).join("")}</div></div>
      <div class="modal-section"><h4>Future Improvements</h4><p>${p.future}</p></div>
      <div class="modal-actions">
        ${p.link ? `<a href="${p.link}" target="_blank" rel="noopener" class="btn btn-solid">View Project</a>` : ""}
        ${p.code ? `<a href="${p.code}" target="_blank" rel="noopener" class="btn btn-outline" data-cursor="CODE">GitHub</a>` : ""}
      </div>
    `);
    wireLikeButtons();
  }
  document.querySelectorAll("[data-open]").forEach(btn => {
    btn.addEventListener("click", () => openProjectModal(btn.dataset.open));
  });

  /* ---------------------------------------------------
     10. STORY HIGHLIGHTS — small modal per highlight
  --------------------------------------------------- */
  const highlightData = {
    build: {
      title: "Build",
      html: `<p>Six projects across AI, automation and the web — each one solving a real, specific problem.</p>
        <div class="pill-group" style="justify-content:center;margin-top:16px;">
          <span>Pothole Finder</span><span>JARVIS</span><span>Call System</span><span>Result Maker</span><span>MC/AD Greeks</span><span>National Academy</span>
        </div>
        <div class="modal-actions" style="justify-content:center;margin-top:22px;"><button class="btn btn-solid" id="eggGoProjects">View Projects</button></div>`
    },
    ai: {
      title: "AI",
      html: `<p>Working across generative AI, computer vision and machine learning — from a voice assistant to a road-damage detector.</p>
        <div class="pill-group" style="justify-content:center;margin-top:16px;">
          <span>Generative AI</span><span>Computer Vision</span><span>Machine Learning</span>
        </div>
        <div class="modal-actions" style="justify-content:center;margin-top:22px;">
          <button class="btn btn-outline" data-open="jarvis">JARVIS</button>
          <button class="btn btn-outline" data-open="pothole">Pothole Finder</button>
        </div>`
    },
    robotics: {
      title: "Robotics",
      html: `<p>Exploring Arduino, circuit design and sensors as hands-on hardware experiments alongside the software work.</p>
        <div class="pill-group" style="justify-content:center;margin-top:16px;">
          <span>Arduino</span><span>Circuit Design</span><span>Sensors</span>
        </div>
        <p class="about-sub" style="margin-top:16px;">No public hardware build yet — this is an active learning area.</p>`
    },
    math: {
      title: "Math",
      html: `<ul class="teach-list" style="text-align:left;">
          <li><strong>PCM Doubt Solver</strong> — National Academy <span>Feb 2025 – Present</span></li>
          <li><strong>Mathematics Teacher</strong> — Infinity Academy <span>Jun 2025 – Present</span></li>
          <li><strong>Mathematics Teacher</strong> — Skyline Tutorial <span>May 2025 – Oct 2025</span></li>
        </ul>
        <p class="about-quote" style="margin-top:14px;">Concept first. Practice with purpose. Build confidence.</p>
        <div class="modal-actions" style="justify-content:center;margin-top:22px;"><button class="btn btn-solid" id="eggGoResources">Question Banks</button></div>`
    },
    resume: {
      title: "Resume",
      html: `<p>Two sides of what I do.</p>
        <div class="modal-actions" style="justify-content:center;margin-top:18px;flex-direction:column;">
          <a href="assets/resumes/Ayush_Shukla_Engineering_Resume.pdf" download class="btn btn-solid">Download Engineering Resume</a>
          <a href="assets/resumes/Ayush_Shukla_Teaching_Resume.pdf" download class="btn btn-outline">Download Teaching Resume</a>
        </div>`
    }
  };

  document.querySelectorAll("[data-highlight]").forEach(btn => {
    btn.addEventListener("click", () => {
      const h = highlightData[btn.dataset.highlight];
      if (!h) return;
      openModalWith(`<h2 style="margin-bottom:16px;">${h.title}</h2>${h.html}`, { compact: true });
      const goProjects = document.getElementById("eggGoProjects");
      if (goProjects) goProjects.addEventListener("click", () => { closeModal(); setTab("projects", { scroll: true }); });
      const goResources = document.getElementById("eggGoResources");
      if (goResources) goResources.addEventListener("click", () => { closeModal(); setTab("resources", { scroll: true }); });
      document.querySelectorAll("#modalContent [data-open]").forEach(b => {
        b.addEventListener("click", () => openProjectModal(b.dataset.open));
      });
    });
  });

  /* ---------------------------------------------------
     11. PROJECT LIKES (localStorage) + heart animations
  --------------------------------------------------- */
  const LIKES_KEY = "as-project-likes";
  function getLikes() {
    try { return JSON.parse(localStorage.getItem(LIKES_KEY)) || {}; } catch (e) { return {}; }
  }
  function isLiked(key) { return !!getLikes()[key]; }
  function setLiked(key, val) {
    const likes = getLikes();
    if (val) likes[key] = true; else delete likes[key];
    try { localStorage.setItem(LIKES_KEY, JSON.stringify(likes)); } catch (e) {}
  }
  function syncLikeButtons(key) {
    document.querySelectorAll(`[data-like="${key}"]`).forEach(b => b.classList.toggle("liked", isLiked(key)));
  }
  function toggleLike(key, btn) {
    const newVal = !isLiked(key);
    setLiked(key, newVal);
    syncLikeButtons(key);
    if (newVal && btn) {
      btn.classList.remove("pop"); void btn.offsetWidth; btn.classList.add("pop");
    }
  }
  function wireLikeButtons() {
    document.querySelectorAll("[data-like]").forEach(btn => {
      if (btn.dataset.wired) return;
      btn.dataset.wired = "1";
      btn.classList.toggle("liked", isLiked(btn.dataset.like));
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleLike(btn.dataset.like, btn);
      });
    });
  }
  wireLikeButtons();

  function spawnHeartBurst(x, y) {
    if (prefersReducedMotion) return;
    const heart = document.createElement("div");
    heart.className = "heart-burst";
    heart.textContent = "♥";
    heart.style.left = x + "px";
    heart.style.top = y + "px";
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 850);
  }

  document.querySelectorAll(".ig-media").forEach(media => {
    media.addEventListener("dblclick", (e) => {
      const key = media.dataset.open;
      if (!key) return;
      setLiked(key, true);
      syncLikeButtons(key);
      const rect = media.getBoundingClientRect();
      spawnHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2 + window.scrollY);
    });
  });

  /* ---------------------------------------------------
     12. KEYBOARD SHORTCUTS
  --------------------------------------------------- */
  document.addEventListener("keydown", (e) => {
    if (document.activeElement && ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return;
    if (e.key === "1") setTab("projects", { scroll: true });
    if (e.key === "2") setTab("experiments", { scroll: true });
    if (e.key === "3") setTab("resources", { scroll: true });
  });

  /* ---------------------------------------------------
     13. EASTER EGG — click the AS logo 5 times
  --------------------------------------------------- */
  const navBrand = document.getElementById("navBrand");
  let eggCount = 0;
  let eggTimer = null;
  navBrand.addEventListener("click", () => {
    eggCount++;
    clearTimeout(eggTimer);
    eggTimer = setTimeout(() => { eggCount = 0; }, 1200);
    if (eggCount >= 5) {
      eggCount = 0;
      openModalWith(`
        <div class="egg-emoji">🕵️</div>
        <h2>You found the secret lab.</h2>
        <p>A quiet corner of the site, reserved for the curious.</p>
        <div class="egg-terminal">
          <span>&gt; whoami</span>
          <span>ayush_shukla</span>
          <span>&gt; status</span>
          <span>building × teaching × exploring</span>
        </div>
      `, { compact: true });
    }
  });

  /* ---------------------------------------------------
     14. GITHUB API — profile stats
  --------------------------------------------------- */
  const GH_USER = "itxayushshukla";

  async function loadGitHub() {
    const ghFallback = document.getElementById("ghFallback");
    try {
      const userRes = await fetch(`https://api.github.com/users/${GH_USER}`);
      if (!userRes.ok) throw new Error("GitHub API unavailable");
      const user = await userRes.json();

      document.getElementById("ghAvatar").src = user.avatar_url || "assets/logo.png";
      document.getElementById("ghName").textContent = user.name || GH_USER;
      document.getElementById("ghBio").textContent = user.bio || "AI/ML engineer & developer";
      document.getElementById("ghRepos").textContent = user.public_repos ?? "—";
      document.getElementById("ghFollowers").textContent = user.followers ?? "—";
      document.getElementById("ghFollowing").textContent = user.following ?? "—";

      const reposRes = await fetch(`https://api.github.com/users/${GH_USER}/repos?per_page=100&sort=updated`);
      if (reposRes.ok) {
        const repos = await reposRes.json();
        const langs = new Set(repos.map(r => r.language).filter(Boolean));
        document.getElementById("ghLangs").textContent = langs.size || "—";
      }
    } catch (err) {
      ghFallback.hidden = false;
    }
  }
  loadGitHub();

  /* ---------------------------------------------------
     15. PWA — SERVICE WORKER + INSTALL PROMPT
  --------------------------------------------------- */
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    });
  }

  let deferredPrompt = null;
  const installToast = document.getElementById("installToast");
  const installYes = document.getElementById("installYes");
  const installNo = document.getElementById("installNo");
  const DISMISS_KEY = "as-install-dismissed";

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (!localStorage.getItem(DISMISS_KEY)) {
      setTimeout(() => installToast.classList.add("show"), 2500);
    }
  });
  installYes.addEventListener("click", async () => {
    installToast.classList.remove("show");
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
    }
  });
  installNo.addEventListener("click", () => {
    installToast.classList.remove("show");
    localStorage.setItem(DISMISS_KEY, "1");
  });

})();
