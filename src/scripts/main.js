    import * as THREE from "three";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Progress bar at top
    const bar = document.getElementById("progress");
    const onGlobalScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
    };
    window.addEventListener("scroll", onGlobalScroll, { passive: true });
    onGlobalScroll();

    // Theme toggle
    const themeBtn = document.getElementById("themeToggle");
    const rootEl = document.documentElement;
    const syncTheme = () => {
      const light = rootEl.dataset.theme === "light";
      themeBtn?.setAttribute("aria-pressed", String(light));
      themeBtn?.setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", light ? "#f4f3ec" : "#07080a");
    };
    themeBtn?.addEventListener("click", () => {
      rootEl.dataset.theme = rootEl.dataset.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", rootEl.dataset.theme);
      syncTheme();
    });
    syncTheme();

    // Portrait lightbox — expand from avatar with FLIP morph
    const portraitOpen = document.getElementById("portraitOpen");
    const portraitThumb = document.getElementById("portraitThumb");
    const portraitLightbox = document.getElementById("portraitLightbox");
    const portraitFull = document.getElementById("portraitFull");
    const portraitClose = document.getElementById("portraitClose");
    const portraitCloseBg = document.getElementById("portraitCloseBg");
    let portraitLastFocus = null;

    const closePortrait = () => {
      if (!portraitLightbox || portraitLightbox.hasAttribute("hidden")) return;
      if (!portraitLightbox.classList.contains("is-open")) return;
      portraitLightbox.classList.remove("is-open");
      portraitLightbox.setAttribute("aria-hidden", "true");

      if (!reduceMotion && portraitThumb && portraitFull) {
        const thumb = portraitThumb.getBoundingClientRect();
        const full = portraitFull.getBoundingClientRect();
        const dx = thumb.left + thumb.width / 2 - (full.left + full.width / 2);
        const dy = thumb.top + thumb.height / 2 - (full.top + full.height / 2);
        const sx = thumb.width / full.width;
        const sy = thumb.height / full.height;
        portraitFull.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
        portraitFull.style.borderRadius = "50%";
      }

      const finish = () => {
        portraitLightbox.hidden = true;
        document.documentElement.classList.remove("portrait-open");
        if (portraitFull) {
          portraitFull.style.transform = "";
          portraitFull.style.borderRadius = "";
          portraitFull.style.width = "";
          portraitFull.style.height = "";
        }
        portraitLastFocus?.focus?.();
      };
      if (reduceMotion) finish();
      else setTimeout(finish, 420);
    };

    const openPortrait = () => {
      if (!portraitLightbox || !portraitThumb || !portraitFull) return;
      portraitLastFocus = document.activeElement;
      portraitLightbox.hidden = false;
      portraitLightbox.setAttribute("aria-hidden", "false");
      document.documentElement.classList.add("portrait-open");

      const thumb = portraitThumb.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const targetW = Math.min(420, vw * 0.82);
      const targetH = targetW * (5 / 4);
      const targetLeft = (vw - targetW) / 2;
      const targetTop = Math.max(48, (vh - targetH) / 2 - 12);

      portraitFull.style.width = targetW + "px";
      portraitFull.style.height = targetH + "px";

      if (!reduceMotion) {
        const dx = thumb.left + thumb.width / 2 - (targetLeft + targetW / 2);
        const dy = thumb.top + thumb.height / 2 - (targetTop + targetH / 2);
        const sx = thumb.width / targetW;
        const sy = thumb.height / targetH;
        portraitFull.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
        portraitFull.style.borderRadius = "50%";
        // force reflow then animate to rest
        portraitFull.getBoundingClientRect();
      } else {
        portraitFull.style.transform = "none";
        portraitFull.style.borderRadius = "22px";
      }

      requestAnimationFrame(() => {
        portraitLightbox.classList.add("is-open");
        if (!reduceMotion) {
          portraitFull.style.transform = "translate(0, 0) scale(1)";
          portraitFull.style.borderRadius = "22px";
        }
        portraitClose?.focus();
      });
    };

    portraitOpen?.addEventListener("click", openPortrait);
    portraitClose?.addEventListener("click", closePortrait);
    portraitCloseBg?.addEventListener("click", closePortrait);

    // Resume viewer — blob URL so download managers don't intercept .pdf links
    const resumeOpen = document.getElementById("resumeOpen");
    const resumeLightbox = document.getElementById("resumeLightbox");
    const resumeFrame = document.getElementById("resumeFrame");
    const resumeStatus = document.getElementById("resumeStatus");
    const resumeClose = document.getElementById("resumeClose");
    const resumeCloseBg = document.getElementById("resumeCloseBg");
    const resumeDownload = document.getElementById("resumeDownload");
    const resumeSrc = `${import.meta.env.BASE_URL.replace(/\/?$/, "/")}resume/Amir_Mohammad_Kahfi_Resume`;
    let resumeBlobUrl = "";
    let resumeLastFocus = null;
    let resumeLoading = null;

    const closeResume = () => {
      if (!resumeLightbox || resumeLightbox.hasAttribute("hidden")) return;
      resumeLightbox.classList.remove("is-open");
      resumeLightbox.setAttribute("aria-hidden", "true");
      const finish = () => {
        resumeLightbox.hidden = true;
        document.documentElement.classList.remove("resume-open");
        resumeLastFocus?.focus?.();
      };
      if (reduceMotion) finish();
      else setTimeout(finish, 280);
    };

    const ensureResumeBlob = () => {
      if (resumeBlobUrl) return Promise.resolve(resumeBlobUrl);
      if (resumeLoading) return resumeLoading;
      resumeStatus && (resumeStatus.hidden = false);
      resumeStatus && (resumeStatus.textContent = "Loading resume…");
      resumeLoading = fetch(resumeSrc)
        .then((res) => {
          if (!res.ok) throw new Error("Resume fetch failed");
          return res.arrayBuffer();
        })
        .then((buf) => {
          resumeBlobUrl = URL.createObjectURL(
            new Blob([buf], { type: "application/pdf" }),
          );
          if (resumeFrame) resumeFrame.src = resumeBlobUrl;
          resumeStatus && (resumeStatus.hidden = true);
          return resumeBlobUrl;
        })
        .catch(() => {
          resumeStatus && (resumeStatus.textContent = "Couldn’t load resume. Try again.");
          resumeLoading = null;
          return "";
        });
      return resumeLoading;
    };

    const openResume = () => {
      if (!resumeLightbox) return;
      resumeLastFocus = document.activeElement;
      resumeLightbox.hidden = false;
      resumeLightbox.setAttribute("aria-hidden", "false");
      document.documentElement.classList.add("resume-open");
      requestAnimationFrame(() => {
        resumeLightbox.classList.add("is-open");
        resumeClose?.focus();
      });
      ensureResumeBlob();
    };

    resumeOpen?.addEventListener("click", openResume);
    resumeClose?.addEventListener("click", closeResume);
    resumeCloseBg?.addEventListener("click", closeResume);
    resumeDownload?.addEventListener("click", async () => {
      const url = await ensureResumeBlob();
      if (!url) return;
      const a = document.createElement("a");
      a.href = url;
      a.download = "Amir_Mohammad_Kahfi_Resume.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
    });

    window.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (resumeLightbox && !resumeLightbox.hasAttribute("hidden")) closeResume();
      else closePortrait();
    });

    // Custom mouse HUD
    if (window.matchMedia("(pointer: fine)").matches && !reduceMotion) {
      const ring = document.querySelector(".cursor-hud__ring");
      const dot = document.querySelector(".cursor-hud__dot");
      const coords = document.querySelector(".cursor-hud__coords");
      if (ring && dot && coords) {
        ring.style.opacity = "0";
        dot.style.opacity = "0";
        coords.style.opacity = "0";
        let mx = window.innerWidth / 2;
        let my = window.innerHeight / 2;
        window.addEventListener("pointermove", (e) => {
          document.documentElement.classList.add("has-cursor");
          mx = e.clientX;
          my = e.clientY;
          ring.style.opacity = "1";
          dot.style.opacity = "1";
          coords.style.opacity = "0.85";
          coords.textContent =
            String(Math.round(mx)).padStart(4, "0") +
            " · " +
            String(Math.round(my)).padStart(4, "0");
        });
        document.addEventListener("pointerleave", () => {
          ring.style.opacity = "0";
          dot.style.opacity = "0";
          coords.style.opacity = "0";
        });
        window.addEventListener("pointerdown", () => ring.classList.add("is-down"));
        window.addEventListener("pointerup", () => ring.classList.remove("is-down"));
        document.querySelectorAll("a, button").forEach((el) => {
          el.addEventListener("pointerenter", () => ring.classList.add("is-active"));
          el.addEventListener("pointerleave", () => ring.classList.remove("is-active"));
        });
        const trail = () => {
          ring.style.transform = "translate3d(" + mx + "px," + my + "px,0)";
          dot.style.transform = "translate3d(" + mx + "px," + my + "px,0)";
          coords.style.transform = "translate3d(" + (mx + 16) + "px," + (my + 18) + "px,0)";
          requestAnimationFrame(trail);
        };
        trail();
      }
    }

    // Impact counters trigger
    let countersAnimated = false;
    const triggerCounters = () => {
      if (countersAnimated || reduceMotion) return;
      countersAnimated = true;
      const counters = document.querySelectorAll("[data-count]");
      counters.forEach((el) => {
        const target = Number(el.dataset.count);
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / 1200, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = String(Math.round(target * eased));
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = String(target);
        };
        requestAnimationFrame(tick);
      });
    };

    // Scrollytelling Pinned 7-Chapter Controller
    const journeyTrack = document.getElementById("journeyTrack");
    const hudFill = document.getElementById("hudProgressFill");
    const hudItems = document.querySelectorAll(".hud__item");
    const chapters = [
      document.getElementById("ch-0"),
      document.getElementById("ch-1"),
      document.getElementById("ch-2"),
      document.getElementById("ch-3"),
      document.getElementById("ch-4"),
      document.getElementById("ch-5"),
      document.getElementById("ch-6"),
    ];

    let currentChapter = 0;
    let targetProgress = 0;
    let scrollProgress = 0;

    const isStackedLayout = () => window.matchMedia("(max-width: 1100px)").matches;

    const syncChapterScrollability = (ch) => {
      if (!ch || isStackedLayout()) {
        ch?.classList.remove("chapter--scrollable");
        return;
      }
      const wrap = ch.querySelector(".chapter__wrap");
      if (!wrap) return;
      const styles = getComputedStyle(ch);
      const padY =
        (parseFloat(styles.paddingTop) || 0) + (parseFloat(styles.paddingBottom) || 0);
      const needsScroll = wrap.scrollHeight + padY > ch.clientHeight + 8;
      ch.classList.toggle("chapter--scrollable", needsScroll);
      if (!needsScroll) ch.scrollTop = 0;
    };

    const syncStackedChapters = () => {
      chapters.forEach((ch) => {
        ch?.classList.add("is-active");
        ch?.classList.remove("chapter--scrollable");
      });
      hudItems.forEach((btn) => btn.classList.remove("is-active"));
    };

    // Keep wheel/trackpad on tall chapters until content ends, then continue page scroll
    chapters.forEach((ch) => {
      if (!ch) return;
      ch.addEventListener(
        "wheel",
        (e) => {
          if (isStackedLayout() || !ch.classList.contains("is-active")) return;
          if (!ch.classList.contains("chapter--scrollable")) return;

          let delta = e.deltaY;
          if (e.deltaMode === 1) delta *= 16; // lines
          if (e.deltaMode === 2) delta *= ch.clientHeight; // pages

          const atTop = ch.scrollTop <= 0;
          const atBottom = ch.scrollTop + ch.clientHeight >= ch.scrollHeight - 2;
          const scrollingDown = delta > 0;

          if ((scrollingDown && !atBottom) || (!scrollingDown && !atTop)) {
            e.preventDefault();
            e.stopPropagation();
            ch.scrollTop += delta;
          }
        },
        { passive: false, capture: true },
      );
    });

    const updateScrollytelling = () => {
      if (!journeyTrack) return;

      // Mobile/tablet: chapters are a normal stacked page
      if (isStackedLayout()) {
        syncStackedChapters();
        const contact = document.getElementById("ch-6");
        if (contact) {
          const r = contact.getBoundingClientRect();
          if (r.top < window.innerHeight * 0.72) triggerCounters();
        }
        return;
      }

      const rect = journeyTrack.getBoundingClientRect();
      const scrollDist = rect.height - window.innerHeight;
      if (scrollDist <= 0) return;
      const p = Math.max(0, Math.min(1, -rect.top / scrollDist));
      targetProgress = p;

      if (hudFill) hudFill.style.height = (p * 100).toFixed(1) + "%";

      // 7 chapters partitioned across [0, 1]
      const step = 1 / 7;
      let nextChapter = Math.min(6, Math.floor(p / step));

      if (nextChapter !== currentChapter) {
        currentChapter = nextChapter;
        chapters.forEach((ch, idx) => {
          if (ch) {
            ch.classList.toggle("is-active", idx === currentChapter);
            ch.scrollTop = 0;
            if (idx === currentChapter) {
              requestAnimationFrame(() => syncChapterScrollability(ch));
            } else {
              ch.classList.remove("chapter--scrollable");
            }
          }
        });
        hudItems.forEach((btn, idx) => {
          btn.classList.toggle("is-active", idx === currentChapter);
        });
        if (currentChapter === 6) {
          triggerCounters();
        }
      } else {
        syncChapterScrollability(chapters[currentChapter]);
      }
    };

    window.addEventListener("scroll", updateScrollytelling, { passive: true });
    window.addEventListener("resize", () => {
      updateScrollytelling();
      if (!isStackedLayout()) syncChapterScrollability(chapters[currentChapter]);
    }, { passive: true });
    updateScrollytelling();

    // Side HUD Jump Navigation
    hudItems.forEach((btn) => {
      btn.addEventListener("click", () => {
        const chapterIdx = Number(btn.dataset.chapter || 0);
        jumpToChapter(chapterIdx);
      });
    });

    const jumpToChapter = (idx) => {
      const target = chapters[idx];
      if (!target) return;

      if (isStackedLayout()) {
        const top = window.scrollY + target.getBoundingClientRect().top - 72;
        window.scrollTo({ top, behavior: "smooth" });
        return;
      }

      if (!journeyTrack) return;
      const rect = journeyTrack.getBoundingClientRect();
      const trackTop = window.scrollY + rect.top;
      const scrollDist = rect.height - window.innerHeight;
      const targetY = trackTop + (idx / 6) * scrollDist;
      window.scrollTo({ top: targetY, behavior: "smooth" });
    };

    // Top Navigation Links smoothly jump to chapters
    const navLinkMap = {
      "#top": 0,
      "#about": 1,
      "#stack": 2,
      "#experience": 3,
      "#work": 4,
      "#education": 5,
      "#contact": 6,
    };

    document.querySelectorAll(".nav__links a, .brand__name, [data-nav]").forEach((link) => {
      link.addEventListener("click", (e) => {
        const targetHref = link.getAttribute("href");
        const dataNav = link.getAttribute("data-nav");
        let chapterIdx = null;

        if (dataNav !== null) {
          chapterIdx = Number(dataNav);
        } else if (targetHref && navLinkMap[targetHref] !== undefined) {
          chapterIdx = navLinkMap[targetHref];
        }

        if (chapterIdx !== null) {
          e.preventDefault();
          jumpToChapter(chapterIdx);
        }
      });
    });

    // Chapter 4: Interactive Project Tabs Switcher
    const workButtons = document.querySelectorAll(".work-btn");
    const workCards = document.querySelectorAll(".work-card");
    workButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.dataset.pindex || 0);
        workButtons.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        workCards.forEach((c, cidx) => {
          c.classList.toggle("is-active", cidx === idx);
        });
      });
    });

    // 3D Three.js Quantum Journey Engine (WebGL)
    const canvas = document.getElementById("threeCanvas");
    if (canvas && !reduceMotion) {
      let w = canvas.clientWidth;
      let h = canvas.clientHeight;

      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(w, h, false);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
      camera.position.set(0, 0, 7.8);

      const clock = new THREE.Clock();
      const worldGroup = new THREE.Group();
      scene.add(worldGroup);

      // Generate glowing circular sprite texture
      const createParticleTexture = () => {
        const c = document.createElement("canvas");
        c.width = 64;
        c.height = 64;
        const ctx = c.getContext("2d");
        const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        g.addColorStop(0, "rgba(255,255,255,1)");
        g.addColorStop(0.25, "rgba(255,255,255,0.92)");
        g.addColorStop(0.55, "rgba(255,255,255,0.3)");
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 64, 64);
        const tex = new THREE.CanvasTexture(c);
        tex.needsUpdate = true;
        return tex;
      };

      const particleTexture = createParticleTexture();
      const count = 1600;

      // 7 Distinct 3D Geometric Morphing Targets
      const t0_sphere = new Float32Array(count * 3);
      const t1_polyhedron = new Float32Array(count * 3);
      const t2_constellation = new Float32Array(count * 3);
      const t3_pipeline = new Float32Array(count * 3);
      const t4_pedestal = new Float32Array(count * 3);
      const t5_helix = new Float32Array(count * 3);
      const t6_supernova = new Float32Array(count * 3);

      const currentPositions = new Float32Array(count * 3);
      const velocities = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);

      const phi = Math.PI * (3 - Math.sqrt(5));

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;

        // 0. Quantum Fibonacci Sphere (Chapter 0)
        const yS = 1 - (i / (count - 1)) * 2;
        const rS = Math.sqrt(Math.max(0, 1 - yS * yS)) * 2.2;
        const thetaS = phi * i;
        t0_sphere[i3] = Math.cos(thetaS) * rS;
        t0_sphere[i3 + 1] = yS * 2.2;
        t0_sphere[i3 + 2] = Math.sin(thetaS) * rS;

        // 1. Crystalline Polyhedron Matrix (Chapter 1)
        const rP = 2.0 + 0.35 * Math.sin(thetaS * 3);
        t1_polyhedron[i3] = Math.cos(thetaS) * rP;
        t1_polyhedron[i3 + 1] = yS * rP;
        t1_polyhedron[i3 + 2] = Math.sin(thetaS) * rP;

        // 2. Semantic Vector Constellation / Galaxy (Chapter 2)
        const cluster = i % 3;
        const clusterCenters = [
          [-1.7, 0.5, 0.3],
          [1.6, -0.4, -0.5],
          [0.1, 1.3, 0.7],
        ];
        const center = clusterCenters[cluster];
        const rad = Math.cbrt(Math.random()) * 1.5;
        const u = Math.random() * Math.PI * 2;
        const v = Math.acos(2 * Math.random() - 1);
        t2_constellation[i3] = center[0] + rad * Math.sin(v) * Math.cos(u);
        t2_constellation[i3 + 1] = center[1] + rad * Math.sin(v) * Math.sin(u);
        t2_constellation[i3 + 2] = center[2] + rad * Math.cos(v);

        // 3. Dual-Pipeline Streaming Conduit (Chapter 3)
        const strand = i % 2 === 0 ? 1 : -1;
        const tPipe = (i / count) * Math.PI * 6 - Math.PI * 3;
        t3_pipeline[i3] = Math.cos(tPipe) * 0.75 + strand * 0.35;
        t3_pipeline[i3 + 1] = (i / count - 0.5) * 4.6;
        t3_pipeline[i3 + 2] = Math.sin(tPipe) * 0.75;

        // 4. Holographic Torus Accelerator Pedestal (Chapter 4)
        const uT = (i / count) * Math.PI * 4;
        const vT = (((i * 17) % count) / count) * Math.PI * 2;
        const R_torus = 2.3;
        const r_torus = 0.8;
        t4_pedestal[i3] = (R_torus + r_torus * Math.cos(vT)) * Math.cos(uT);
        t4_pedestal[i3 + 1] = (R_torus + r_torus * Math.cos(vT)) * Math.sin(uT);
        t4_pedestal[i3 + 2] = r_torus * Math.sin(vT);

        // 5. Academic Neural Double-Helix (Chapter 5 - Education & Research)
        const uH = (i / count) * Math.PI * 8;
        const strandH = i % 2 === 0 ? 1 : -1;
        const rH = 1.35;
        t5_helix[i3] = Math.cos(uH) * rH + strandH * 0.45;
        t5_helix[i3 + 1] = (i / count - 0.5) * 4.4;
        t5_helix[i3 + 2] = Math.sin(uH) * rH;

        // 6. Supernova Singularity (Chapter 6 - Scale & Contact)
        const rSuper = 2.6 + Math.random() * 0.8;
        t6_supernova[i3] = Math.cos(thetaS) * rSuper;
        t6_supernova[i3 + 1] = yS * rSuper;
        t6_supernova[i3 + 2] = Math.sin(thetaS) * rSuper;

        // Start at Target 0
        currentPositions[i3] = t0_sphere[i3];
        currentPositions[i3 + 1] = t0_sphere[i3 + 1];
        currentPositions[i3 + 2] = t0_sphere[i3 + 2];
      }

      const particleGeometry = new THREE.BufferGeometry();
      particleGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(currentPositions, 3),
      );
      particleGeometry.setAttribute(
        "color",
        new THREE.BufferAttribute(colors, 3),
      );

      const particleMaterial = new THREE.PointsMaterial({
        size: 0.13,
        map: particleTexture,
        transparent: true,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const particlePoints = new THREE.Points(particleGeometry, particleMaterial);
      worldGroup.add(particlePoints);

      // Theme update helper
      const updateThemeVisuals = () => {
        const isLight = document.documentElement.dataset.theme === "light";
        if (isLight) {
          particleMaterial.blending = THREE.NormalBlending;
          particleMaterial.opacity = 0.85;
        } else {
          particleMaterial.blending = THREE.AdditiveBlending;
          particleMaterial.opacity = 0.92;
        }

        const colorAttr = particleGeometry.getAttribute("color");
        for (let i = 0; i < count; i++) {
          const ratio = i / count;
          let r = 0.8, g = 1.0, b = 0.3;
          if (isLight) {
            r = 0.15 + 0.1 * ratio;
            g = 0.35 + 0.12 * Math.sin(ratio * Math.PI);
            b = 0.12 + 0.35 * ratio;
          } else {
            if (ratio < 0.6) {
              const t = ratio / 0.6;
              r = 0.78 * (1 - t) + 0.0 * t;
              g = 1.0 * (1 - t) + 0.92 * t;
              b = 0.3 * (1 - t) + 1.0 * t;
            } else {
              const t = (ratio - 0.6) / 0.4;
              r = 0.0 * (1 - t) + 0.62 * t;
              g = 0.92 * (1 - t) + 0.35 * t;
              b = 1.0;
            }
          }
          colorAttr.setXYZ(i, r, g, b);
        }
        colorAttr.needsUpdate = true;
      };

      updateThemeVisuals();

      const themeObserver = new MutationObserver((mutations) => {
        for (const m of mutations) {
          if (m.attributeName === "data-theme") {
            updateThemeVisuals();
            break;
          }
        }
      });
      themeObserver.observe(document.documentElement, { attributes: true });

      // Interaction: Mouse Gyro & Drag-to-Rotate
      const pointer = { x: 0, y: 0, isDown: false, prevX: 0, prevY: 0 };
      let dragVelX = 0;
      let dragVelY = 0;
      const shockwaves = [];

      window.addEventListener("pointermove", (e) => {
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = -(e.clientY / window.innerHeight) * 2 + 1;
        pointer.x = nx;
        pointer.y = ny;

        if (pointer.isDown) {
          const dx = e.clientX - pointer.prevX;
          const dy = e.clientY - pointer.prevY;
          dragVelX += dy * 0.003;
          dragVelY += dx * 0.003;
          pointer.prevX = e.clientX;
          pointer.prevY = e.clientY;
        }
      });

      canvas.addEventListener("pointerdown", (e) => {
        pointer.isDown = true;
        pointer.prevX = e.clientX;
        pointer.prevY = e.clientY;

        shockwaves.push({
          radius: 0,
          speed: 0.14,
          maxR: 4.8,
          strength: 1.6,
          life: 1,
        });
        if (shockwaves.length > 4) shockwaves.shift();
      });

      window.addEventListener("pointerup", () => {
        pointer.isDown = false;
      });

      const smoothstep = (t) => {
        const c = Math.max(0, Math.min(1, t));
        return c * c * (3 - 2 * c);
      };

      const handleResize = () => {
        w = canvas.clientWidth;
        h = canvas.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      };
      window.addEventListener("resize", handleResize);

      // Render Loop
      const animate = () => {
        scrollProgress += (targetProgress - scrollProgress) * 0.08;
        const time = clock.getElapsedTime();

        const isMobile = window.innerWidth < 1100;

        // Calculate Chapter Spatial Coordinate Target
        // 7 chapters with distinct spatial staging
        let targetGroupX = 0;
        let targetGroupY = 0;
        let targetGroupZ = 0;
        let targetScale = 1.0;

        // Spatial trajectory across 7 chapters
        const chProgress = scrollProgress * 6; // [0, 6]
        const baseChapter = Math.min(5, Math.floor(chProgress));
        const chapterBlend = smoothstep(chProgress - baseChapter);

        // Chapter spatial coordinates (Desktop vs Mobile)
        const coordsDesktop = [
          { x: 1.85, y: 0.05, z: 0, s: 1.05 },     // 0: Origin (Right of terminal)
          { x: 1.55, y: -0.15, z: -0.6, s: 1.15 }, // 1: About (Center-right framing)
          { x: 1.7, y: -0.15, z: -0.5, s: 1.2 },   // 2: Stack (Right of stack grid)
          { x: 1.75, y: 0.1, z: 0.2, s: 1.1 },     // 3: Experience (Right of jobs)
          { x: 2.1, y: 0.0, z: -0.6, s: 1.25 },    // 4: Work (Right of active project card)
          { x: 1.95, y: 0.0, z: -0.5, s: 1.2 },    // 5: Education (Right of education cards)
          { x: 0.0, y: 0.25, z: -0.6, s: 1.15 },   // 6: Contact (Centered)
        ];

        const coordsMobile = [
          { x: 0, y: -0.32, z: 0, s: 0.75 },
          { x: 0, y: -0.35, z: -0.6, s: 0.78 },
          { x: 0, y: -0.35, z: -0.5, s: 0.78 },
          { x: 0, y: -0.3, z: 0, s: 0.78 },
          { x: 0, y: -0.3, z: -0.6, s: 0.8 },
          { x: 0, y: -0.3, z: -0.5, s: 0.78 },
          { x: 0, y: 0.1, z: -0.5, s: 0.82 },
        ];

        const coords = isMobile ? coordsMobile : coordsDesktop;
        const cA = coords[baseChapter];
        const cB = coords[baseChapter + 1];

        targetGroupX = cA.x + (cB.x - cA.x) * chapterBlend;
        targetGroupY = cA.y + (cB.y - cA.y) * chapterBlend;
        targetGroupZ = cA.z + (cB.z - cA.z) * chapterBlend;
        targetScale = cA.s + (cB.s - cA.s) * chapterBlend;

        worldGroup.position.x += (targetGroupX - worldGroup.position.x) * 0.08;
        worldGroup.position.y += (targetGroupY - worldGroup.position.y) * 0.08;
        worldGroup.position.z += (targetGroupZ - worldGroup.position.z) * 0.08;

        const currentScale = worldGroup.scale.x;
        const newScale = currentScale + (targetScale - currentScale) * 0.08;
        worldGroup.scale.set(newScale, newScale, newScale);

        // Gyro Tilt & Drag momentum
        dragVelX *= 0.92;
        dragVelY *= 0.92;
        worldGroup.rotation.x += dragVelX;
        worldGroup.rotation.y += dragVelY;

        const targetTiltX = -pointer.y * 0.35;
        const targetTiltY = pointer.x * 0.45;
        worldGroup.rotation.x += (targetTiltX - worldGroup.rotation.x) * 0.04;
        worldGroup.rotation.y += (targetTiltY - worldGroup.rotation.y) * 0.04;

        // Base rotation acceleration
        const spinSpeed = 0.005 + scrollProgress * 0.015;
        worldGroup.rotation.y += spinSpeed;

        // 7-Target Morphing Calculation
        const targets = [
          t0_sphere,
          t1_polyhedron,
          t2_constellation,
          t3_pipeline,
          t4_pedestal,
          t5_helix,
          t6_supernova,
        ];
        const tA = targets[baseChapter];
        const tB = targets[baseChapter + 1];

        // Update shockwaves
        for (let s = shockwaves.length - 1; s >= 0; s--) {
          const sw = shockwaves[s];
          sw.radius += sw.speed;
          sw.life = 1 - sw.radius / sw.maxR;
          if (sw.radius >= sw.maxR) {
            shockwaves.splice(s, 1);
          }
        }

        // Deform positions with 3D harmonic noise
        const posAttr = particleGeometry.getAttribute("position");
        const posArr = posAttr.array;
        const waveFreq = 2.2 + scrollProgress * 1.5;
        const waveAmp = 0.16 + scrollProgress * 0.12;

        for (let i = 0; i < count; i++) {
          const i3 = i * 3;

          const tx = tA[i3] + (tB[i3] - tA[i3]) * chapterBlend;
          const ty = tA[i3 + 1] + (tB[i3 + 1] - tA[i3 + 1]) * chapterBlend;
          const tz = tA[i3 + 2] + (tB[i3 + 2] - tA[i3 + 2]) * chapterBlend;

          const nx = Math.sin(ty * waveFreq + time * 2.0);
          const ny = Math.cos(tz * waveFreq + time * 1.7);
          const nz = Math.sin(tx * waveFreq + time * 1.9);
          const wave = (nx + ny + nz) * 0.333 * waveAmp;

          const targetX = tx * (1 + wave);
          const targetY = ty * (1 + wave);
          const targetZ = tz * (1 + wave);

          const fx = (targetX - posArr[i3]) * 0.085;
          const fy = (targetY - posArr[i3 + 1]) * 0.085;
          const fz = (targetZ - posArr[i3 + 2]) * 0.085;

          velocities[i3] = (velocities[i3] + fx) * 0.82;
          velocities[i3 + 1] = (velocities[i3 + 1] + fy) * 0.82;
          velocities[i3 + 2] = (velocities[i3 + 2] + fz) * 0.82;

          posArr[i3] += velocities[i3];
          posArr[i3 + 1] += velocities[i3 + 1];
          posArr[i3 + 2] += velocities[i3 + 2];

          // Shockwave impulse
          for (let s = 0; s < shockwaves.length; s++) {
            const sw = shockwaves[s];
            const dist = Math.hypot(posArr[i3], posArr[i3 + 1], posArr[i3 + 2]);
            const waveDist = Math.abs(dist - sw.radius);
            if (waveDist < 0.6 && dist > 0.1) {
              const push = (1 - waveDist / 0.6) * sw.strength * sw.life;
              posArr[i3] += (posArr[i3] / dist) * push;
              posArr[i3 + 1] += (posArr[i3 + 1] / dist) * push;
              posArr[i3 + 2] += (posArr[i3 + 2] / dist) * push;
            }
          }
        }

        posAttr.needsUpdate = true;
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      };

      animate();
    }
