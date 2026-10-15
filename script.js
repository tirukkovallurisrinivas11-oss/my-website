/**
 * The Kadai Story - Luxury Restaurant Website Interactivity
 * High-performance, vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Hero Carousel Setup
  initHeroCarousel();

  // 2. Navigation & Scroll Effects
  initNavigation();

  // 3. Menu Category Filtering
  initMenuFilters();

  // 4. Modals (Reservation & Full Menu)
  initModals();

  // 5. FAQ Accordion
  initFaqAccordion();

  // 6. Menu Search Functionality
  initMenuSearch();

  // 7. Dynamic Status Check
  updateLiveStatus();
});

/* ==========================================================================
   Hero Carousel
   ========================================================================== */
function initHeroCarousel() {
  const slides = document.querySelectorAll('.carousel-slide');
  const indicators = document.querySelectorAll('.indicator-dot');
  if (!slides.length) return;

  let currentSlide = 0;
  const slideInterval = 5500; // 5.5 seconds per slide
  let timer = null;

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');

    currentSlide = (index + slides.length) % slides.length;

    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function startAutoplay() {
    stopAutoplay();
    timer = setInterval(nextSlide, slideInterval);
  }

  function stopAutoplay() {
    if (timer) clearInterval(timer);
  }

  // Indicator click handlers
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      goToSlide(index);
      startAutoplay();
    });
  });

  // Pause on hover
  const heroSection = document.querySelector('.hero-section');
  if (heroSection) {
    heroSection.addEventListener('mouseenter', stopAutoplay);
    heroSection.addEventListener('mouseleave', startAutoplay);
  }

  startAutoplay();
}

/* ==========================================================================
   Navigation & Scroll Effects
   ========================================================================== */
function initNavigation() {
  const header = document.getElementById('mainHeader');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const closeMobileBtn = document.getElementById('closeMobileMenuBtn');
  const mobileOverlay = document.getElementById('mobileMenuOverlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  // Header scroll appearance
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Update active nav link based on scroll position
    updateActiveNavLink();
  });

  function updateActiveNavLink() {
    const sections = ['home', 'menu', 'experience', 'reviews', 'faqs', 'location'];
    let currentSection = 'home';

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 250 && rect.bottom >= 150) {
          currentSection = id;
        }
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      if (href === currentSection) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Mobile menu open / close
  if (mobileToggle && mobileOverlay) {
    mobileToggle.addEventListener('click', () => {
      mobileOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  function closeMobileMenu() {
    if (mobileOverlay) {
      mobileOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (closeMobileBtn) {
    closeMobileBtn.addEventListener('click', closeMobileMenu);
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', (e) => {
      if (e.target === mobileOverlay) closeMobileMenu();
    });
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
}

/* ==========================================================================
   Menu Category Filtering
   ========================================================================== */
function initMenuFilters() {
  const filterBtns = document.querySelectorAll('.menu-tab-btn');
  const dishCards = document.querySelectorAll('.dish-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      dishCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeIn 0.35s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ==========================================================================
   Modals (Reservation & Full Menu)
   ========================================================================== */
function initModals() {
  const reserveModal = document.getElementById('reserveModal');
  const openReserveBtn = document.getElementById('openReserveModalBtn');
  const closeReserveBtn = document.getElementById('closeReserveModalBtn');
  const reservationForm = document.getElementById('reservationForm');
  const successBox = document.getElementById('reservationSuccess');

  const menuModal = document.getElementById('menuModal');
  const openMenuBtn = document.getElementById('viewFullMenuBtn');
  const closeMenuBtn = document.getElementById('closeMenuModalBtn');

  // Set default reservation date to today
  const resDateInput = document.getElementById('resDate');
  if (resDateInput) {
    const today = new Date().toISOString().split('T')[0];
    resDateInput.value = today;
    resDateInput.min = today;
  }

  // Global functions to open modals
  window.openReservationModal = function(prefillDish = '') {
    if (menuModal) menuModal.classList.remove('open');
    if (reserveModal) {
      reserveModal.classList.add('open');
      document.body.style.overflow = 'hidden';

      if (prefillDish) {
        const notesInput = document.getElementById('resNotes');
        if (notesInput) {
          notesInput.value = `Table reservation with pre-order for: ${prefillDish}`;
        }
      }
    }
  };

  window.closeReservationModal = function() {
    if (reserveModal) {
      reserveModal.classList.remove('open');
      document.body.style.overflow = '';
      // Reset form view after delay
      setTimeout(() => {
        if (reservationForm) reservationForm.style.display = 'flex';
        if (successBox) successBox.style.display = 'none';
      }, 300);
    }
  };

  window.openFullMenuModal = function() {
    if (reserveModal) reserveModal.classList.remove('open');
    if (menuModal) {
      menuModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeFullMenuModal = function() {
    if (menuModal) {
      menuModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  window.switchToReservationFromMenu = function() {
    closeFullMenuModal();
    setTimeout(() => {
      openReservationModal();
    }, 200);
  };

  // Button clicks
  if (openReserveBtn) openReserveBtn.addEventListener('click', () => openReservationModal());
  if (closeReserveBtn) closeReserveBtn.addEventListener('click', closeReservationModal);
  if (openMenuBtn) openMenuBtn.addEventListener('click', openFullMenuModal);
  if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeFullMenuModal);

  // Close when clicking outside backdrop
  [reserveModal, menuModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          if (modal === reserveModal) closeReservationModal();
          if (modal === menuModal) closeFullMenuModal();
        }
      });
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeReservationModal();
      closeFullMenuModal();
    }
  });

  // Handle Reservation Form Submit
  if (reservationForm) {
    reservationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const guests = document.getElementById('resGuests').value;
      const date = document.getElementById('resDate').value;
      const time = document.getElementById('resTime').value;
      const name = document.getElementById('resName').value;
      const seating = document.getElementById('resSeating').value;

      // Generate randomized booking code
      const randomCode = 'TKS-' + Math.floor(10000 + Math.random() * 90000);
      const bookingCodeEl = document.getElementById('bookingCode');
      const summaryEl = document.getElementById('successSummary');

      if (bookingCodeEl) bookingCodeEl.textContent = randomCode;
      if (summaryEl) {
        summaryEl.textContent = `Confirmed for ${name}: Table for ${guests} guests on ${date} at ${time} (${seating}).`;
      }

      reservationForm.style.display = 'none';
      if (successBox) successBox.style.display = 'block';
    });
  }
}

/* ==========================================================================
   FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const currentItem = header.parentElement;
      const isActive = currentItem.classList.contains('active');

      // Close other accordions
      document.querySelectorAll('.accordion-item').forEach(item => {
        item.classList.remove('active');
        item.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isActive) {
        currentItem.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   Live Menu Search
   ========================================================================== */
function initMenuSearch() {
  const searchInput = document.getElementById('menuSearchInput');
  const menuRows = document.querySelectorAll('.menu-item-row');
  const sections = document.querySelectorAll('.menu-section-block');

  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    menuRows.forEach(row => {
      const text = row.textContent.toLowerCase();
      if (text.includes(query)) {
        row.style.display = 'flex';
      } else {
        row.style.display = 'none';
      }
    });

    // Hide section blocks if all items in them are hidden
    sections.forEach(sec => {
      const visibleRows = sec.querySelectorAll('.menu-item-row[style="display: flex;"]');
      const allRows = sec.querySelectorAll('.menu-item-row');
      
      if (query && visibleRows.length === 0 && allRows.length > 0) {
        sec.style.display = 'none';
      } else {
        sec.style.display = 'flex';
      }
    });
  });
}

/* ==========================================================================
   Live Status Calculation
   ========================================================================== */
function updateLiveStatus() {
  const statusBadge = document.getElementById('liveStatusBadge');
  if (!statusBadge) return;

  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentTimeVal = hours + minutes / 60;

  // Restaurant is open 12:00 PM (12.0) to 12:30 AM (0.5 next day)
  // That means: (currentTimeVal >= 12.0) OR (currentTimeVal <= 0.5)
  const isOpen = (currentTimeVal >= 12.0) || (currentTimeVal <= 0.5);

  const statusText = statusBadge.querySelector('.status-text');
  const statusDot = statusBadge.querySelector('.status-dot');

  if (statusText && statusDot) {
    if (isOpen) {
      statusText.innerHTML = '<strong>NOW OPEN</strong> — Closes at 12:30 AM · Table Service Ready';
      statusDot.style.backgroundColor = '#2ecc71';
      statusDot.style.boxShadow = '0 0 10px #2ecc71';
    } else {
      statusText.innerHTML = '<strong>OPENS AT 12:00 PM</strong> — Accepting Advance Reservations';
      statusDot.style.backgroundColor = '#f39c12';
      statusDot.style.boxShadow = '0 0 10px #f39c12';
    }
  }
}
