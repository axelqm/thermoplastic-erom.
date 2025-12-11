// main.js
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".main-header");
  const nav = document.querySelector(".main-nav");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelectorAll(".main-nav a[href^='#']");
  const sections = document.querySelectorAll("section[id]");
  const statNumbers = document.querySelectorAll(".stat-number");

  /* ==========================================================
     1. HEADER STICKY (SOMBRA AL HACER SCROLL)
     ========================================================== */
  const handleHeaderShadow = () => {
    if (window.scrollY > 10) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  };
  handleHeaderShadow();
  window.addEventListener("scroll", handleHeaderShadow);

  /* ==========================================================
     2. MENÚ MÓVIL (HAMBURGUESA)
     ========================================================== */
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.classList.toggle("is-open");
      nav.classList.toggle("is-open", isOpen);
    });
  }

  const closeNavMobile = () => {
    if (window.innerWidth <= 850 && nav.classList.contains("is-open")) {
      nav.classList.remove("is-open");
      navToggle?.classList.remove("is-open");
    }
  };

  /* ==========================================================
     3. SMOOTH SCROLL EN TODOS LOS LINKS INTERNOS
     ========================================================== */
  const smoothLinks = document.querySelectorAll("a[href^='#']");

  smoothLinks.forEach(link => {
    link.addEventListener("click", evt => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;

      const targetEl = document.querySelector(href);
      if (!targetEl) return;

      evt.preventDefault();

      // altura del header para que no tape el título
      const headerOffset = header ? header.offsetHeight + 10 : 0;
      const rect = targetEl.getBoundingClientRect();
      const targetY = rect.top + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: targetY,
        behavior: "smooth"
      });

      closeNavMobile(); // cerrar menú en móvil
    });
  });

  /* ==========================================================
     4. MARCAR LINK ACTIVO SEGÚN SECCIÓN VISIBLE
     ========================================================== */
  const setActiveLink = (id) => {
    navLinks.forEach(link => {
      const href = link.getAttribute("href");
      if (href === `#${id}`) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  };

  const sectionObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveLink(entry.target.id);
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(section => sectionObserver.observe(section));

  /* ==========================================================
     5. REVEAL ANIMADO AL HACER SCROLL
     ========================================================== */
  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  /* ==========================================================
     6. CONTADORES EN LAS STATS
     ========================================================== */
  const animateNumber = (el) => {
    const target = parseInt(el.dataset.target, 10) || 0;
    let current = 0;
    const duration = 1200;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      current = Math.floor(target * progress);
      el.textContent = current.toString();
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  if (statNumbers.length) {
    const statsObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateNumber(entry.target);
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    statNumbers.forEach(num => statsObserver.observe(num));
  }

  /* ==========================================================
     7. PEQUEÑO PARALLAX DEL ORBIT EN EL HERO (OPCIONAL)
     ========================================================== */
  const heroOrbit = document.querySelector(".hero-orbit");
  if (heroOrbit) {
    window.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      heroOrbit.style.transform =
        `translate(-50%, -50%) translate(${x}px, ${y}px)`;
    });
  }
});
