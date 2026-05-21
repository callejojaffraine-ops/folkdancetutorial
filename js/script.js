const startApp = () => {
  const preloader = document.getElementById('preloader');
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const themeToggle = document.getElementById('themeToggle');
  const musicToggle = document.getElementById('musicToggle');
  const backToTop = document.getElementById('backToTop');
  const bgMusic = document.getElementById('bgMusic');
  const typingText = document.getElementById('typingText');

  if (preloader) {
    window.addEventListener('load', () => {
      preloader.classList.add('preloader--hidden');
      setTimeout(() => preloader.remove(), 600);
    });
  }

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      mobileNav.classList.toggle('active');
    });
  }

  const pageLinks = document.querySelectorAll('.nav__link');
  pageLinks.forEach((link) => {
    if (link.href === window.location.href || link.href === window.location.pathname) {
      link.classList.add('active');
    }
  });

  const smoothLinks = document.querySelectorAll('a[href^="#"]');
  smoothLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  if (themeToggle) {
    const activeTheme = localStorage.getItem('folk-theme');
    if (activeTheme === 'dark') document.documentElement.classList.add('dark-mode');

    themeToggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark-mode');
      const mode = document.documentElement.classList.contains('dark-mode') ? 'dark' : 'light';
      localStorage.setItem('folk-theme', mode);
    });
  }

  if (musicToggle && bgMusic) {
    const activeMusic = localStorage.getItem('folk-music');
    if (activeMusic === 'playing') {
      bgMusic.play().catch(() => {});
      musicToggle.classList.add('active');
    }
    musicToggle.addEventListener('click', () => {
      if (bgMusic.paused) {
        bgMusic.play().catch(() => {});
        musicToggle.classList.add('active');
        localStorage.setItem('folk-music', 'playing');
      } else {
        bgMusic.pause();
        musicToggle.classList.remove('active');
        localStorage.setItem('folk-music', 'paused');
      }
    });
  }

  if (typingText) {
    const phrases = ['Carinosa.', 'Itik-Itik.'];
    let current = 0;
    let charIndex = 0;
    let deleting = false;
    const type = () => {
      const displayed = phrases[current];
      if (!deleting) {
        typingText.textContent = displayed.slice(0, charIndex + 1);
        charIndex += 1;
        if (charIndex === displayed.length) {
          deleting = true;
          setTimeout(type, 1500);
          return;
        }
      } else {
        typingText.textContent = displayed.slice(0, charIndex - 1);
        charIndex -= 1;
        if (charIndex === 0) {
          deleting = false;
          current = (current + 1) % phrases.length;
        }
      }
      setTimeout(type, deleting ? 80 : 120);
    };
    type();
  }

  const counters = document.querySelectorAll('.counter');
  const runCounters = () => {
    counters.forEach((counter) => {
      const target = parseInt(counter.dataset.target, 10);
      let value = 0;
      const speed = Math.max(target / 150, 10);
      const updateCount = () => {
        value += Math.ceil(target / speed);
        if (value > target) value = target;
        counter.textContent = value;
        if (value < target) requestAnimationFrame(updateCount);
      };
      updateCount();
    });
  };

  const counterSection = document.querySelector('.stats');
  if (counterSection && counters.length) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runCounters();
          obs.disconnect();
        }
      });
    }, { threshold: 0.4 });
    observer.observe(counterSection);
  }

  const slider = document.getElementById('testimonialSlider');
  if (slider) {
    const slides = slider.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    let currentIndex = 0;
    const updateSlides = () => {
      slides.forEach((slide, index) => {
        slide.style.transform = `translateX(${100 * (index - currentIndex)}%)`;
      });
    };
    const nextSlide = () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateSlides();
    };
    prevBtn?.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateSlides();
    });
    nextBtn?.addEventListener('click', nextSlide);
    updateSlides();
    setInterval(nextSlide, 6500);
  }

  const accordion = document.getElementById('accordion');
  if (accordion) {
    accordion.querySelectorAll('.accordion-item').forEach((item) => {
      const trigger = item.querySelector('.accordion-trigger');
      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        accordion.querySelectorAll('.accordion-item').forEach((row) => {
          row.classList.remove('open');
          const rowPanel = row.querySelector('.accordion-panel');
          if (rowPanel) rowPanel.style.maxHeight = '0';
        });
        if (!isOpen) {
          item.classList.add('open');
          const panel = item.querySelector('.accordion-panel');
          if (panel) panel.style.maxHeight = panel.scrollHeight + 'px';
        }
      });
    });
  }

  const tutorialSection = document.getElementById('tutorialCards');
  if (tutorialSection) {
    const searchInput = document.getElementById('searchInput');
    const filterChips = document.querySelectorAll('[data-filter]');
    const difficultyChips = document.querySelectorAll('[data-difficulty]');
    let regionFilter = 'all';
    let difficultyFilter = 'all';
    const cards = tutorialSection.querySelectorAll('.tutorial-card');

    const filterCards = () => {
      const query = searchInput?.value.trim().toLowerCase() || '';
      cards.forEach((card) => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        const region = card.dataset.region;
        const difficulty = card.dataset.difficulty;
        const matchesQuery = title.includes(query) || description.includes(query);
        const matchesRegion = regionFilter === 'all' || region === regionFilter;
        const matchesDifficulty = difficultyFilter === 'all' || difficulty === difficultyFilter;
        card.style.display = matchesQuery && matchesRegion && matchesDifficulty ? 'grid' : 'none';
      });
    };

    searchInput?.addEventListener('input', filterCards);
    filterChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        filterChips.forEach((item) => item.classList.remove('active'));
        chip.classList.add('active');
        regionFilter = chip.dataset.filter;
        filterCards();
      });
    });
    difficultyChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        difficultyChips.forEach((item) => item.classList.remove('active'));
        chip.classList.add('active');
        difficultyFilter = chip.dataset.difficulty;
        filterCards();
      });
    });
  }

  const galleryGrid = document.getElementById('galleryGrid');
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = document.getElementById('lightboxContent');
  const lightboxClose = document.getElementById('lightboxClose');

  const closeLightbox = () => {
    lightbox?.classList.remove('active');
    if (lightboxContent) {
      lightboxContent.innerHTML = '';
    }
  };

  if (galleryGrid && lightbox && lightboxContent) {
    galleryGrid.querySelectorAll('.gallery-item').forEach((item) => {
      item.addEventListener('click', () => {
        const type = item.dataset.type;
        const src = item.dataset.src;
        if (!src) return;
        lightboxContent.innerHTML = type === 'video'
          ? `<video controls autoplay src="${src}" class="lightbox-media"></video>`
          : `<img src="${src}" alt="Gallery preview" class="lightbox-media" />`;
        lightbox.classList.add('active');
      });
    });
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) closeLightbox();
    });
  }

  const detailVideo = document.getElementById('detailVideo');
  const playPauseBtn = document.getElementById('playPause');
  const progressBar = document.getElementById('videoProgress');
  const progressFill = progressBar?.querySelector('.progress-filled');
  const speedSelect = document.getElementById('speedSelect');
  const fullscreenBtn = document.getElementById('fullscreenBtn');

  if (detailVideo) {
    detailVideo.addEventListener('timeupdate', () => {
      const percent = (detailVideo.currentTime / detailVideo.duration) * 100;
      if (progressFill) progressFill.style.width = `${percent}%`;
    });
    playPauseBtn?.addEventListener('click', () => {
      if (detailVideo.paused) {
        detailVideo.play();
        playPauseBtn.textContent = 'Pause';
      } else {
        detailVideo.pause();
        playPauseBtn.textContent = 'Play';
      }
    });
    progressBar?.addEventListener('click', (event) => {
      const rect = progressBar.getBoundingClientRect();
      const clickPosition = event.clientX - rect.left;
      const percentage = clickPosition / rect.width;
      detailVideo.currentTime = detailVideo.duration * percentage;
    });
    speedSelect?.addEventListener('change', () => {
      detailVideo.playbackRate = parseFloat(speedSelect.value);
    });
    fullscreenBtn?.addEventListener('click', () => {
      if (detailVideo.requestFullscreen) {
        detailVideo.requestFullscreen();
      } else if (detailVideo.webkitRequestFullscreen) {
        detailVideo.webkitRequestFullscreen();
      }
    });
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) backToTop?.classList.add('show');
    else backToTop?.classList.remove('show');
  });

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const revealItems = document.querySelectorAll('.glass-card, .section__header, .hero__content, .detail-info, .figure-card, .contact-panel, .gallery-item');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  revealItems.forEach((item) => revealObserver.observe(item));
};

startApp();
