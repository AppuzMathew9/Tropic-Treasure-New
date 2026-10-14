// Tropic Treasure - Interactive Website Script

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', !isExpanded);
      mobileMenu.classList.toggle('hidden');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
        mobileMenu.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close when clicking any link inside mobile menu
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 2. Header Scroll Glassmorphic Effect & Nav Mouse Responsiveness
  const header = document.querySelector('header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled', 'border-border/80', 'shadow-sm');
        header.classList.remove('border-transparent');
      } else {
        header.classList.remove('scrolled', 'border-border/80', 'shadow-sm');
        header.classList.add('border-transparent');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // Nav link mouse movement coordinate tracker for flowing light
  const navLinks = document.querySelectorAll('header nav a');
  navLinks.forEach(link => {
    link.classList.add('nav-link');
    link.addEventListener('mousemove', (e) => {
      const rect = link.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      link.style.setProperty('--nav-mouse-x', `${x}px`);
      link.style.setProperty('--nav-mouse-y', `${y}px`);
    });
    link.addEventListener('mouseleave', () => {
      link.style.setProperty('--nav-mouse-x', '50%');
      link.style.setProperty('--nav-mouse-y', '50%');
    });
  });

  // 3. Mouse-Responsive Flowing Color Effect on Buttons
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      btn.style.setProperty('--btn-mouse-x', `${x}px`);
      btn.style.setProperty('--btn-mouse-y', `${y}px`);
    });

    btn.addEventListener('mouseleave', () => {
      // Smoothly re-center when mouse leaves
      btn.style.setProperty('--btn-mouse-x', '50%');
      btn.style.setProperty('--btn-mouse-y', '50%');
    });
  });

  // 3b. Live World Office Clocks (Kochi & London)
  const updateOfficeClocks = () => {
    const kochiElements = document.querySelectorAll('.live-time-kochi');
    const londonElements = document.querySelectorAll('.live-time-london');

    const now = new Date();
    try {
      const kochiTime = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(now);

      const londonTime = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/London',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(now);

      kochiElements.forEach(el => el.textContent = `${kochiTime} IST`);
      londonElements.forEach(el => el.textContent = `${londonTime} GMT`);
    } catch (e) {
      // Fallback
      kochiElements.forEach(el => el.textContent = '16:45 IST');
      londonElements.forEach(el => el.textContent = '12:15 GMT');
    }
  };
  updateOfficeClocks();
  setInterval(updateOfficeClocks, 1000);

  // 4. Hero Background 3-Second Slideshow with Gentle Crossfade & Zero Blank Frames
  const heroContainer = document.querySelector('.hero-slideshow-container');
  const slides = document.querySelectorAll('.hero-slide');
  const indicatorPills = document.querySelectorAll('.slide-indicator-pill');
  const slideCaption = document.getElementById('hero-slide-caption');

  const captions = [
    "Kerala Cardamom Canopy · Western Ghats",
    "Munnar Mountain Slopes · Spice Terroirs",
    "Origin Black Pepper Vines · Ripening Crop",
    "Select India-Origin Harvest Spices"
  ];

  if (slides.length > 1) {
    let currentSlide = 0;
    let slideTimer = null;
    const slideDuration = 3000; // 3 seconds per slide

    const goToSlide = (nextIndex) => {
      if (nextIndex === currentSlide) return;

      const prevSlide = slides[currentSlide];
      const nextSlide = slides[nextIndex];

      // Keep previous slide fully visible on bottom layer during fade
      slides.forEach((s, idx) => {
        if (idx === currentSlide) {
          s.style.zIndex = '1';
          s.style.opacity = '1';
        } else if (idx === nextIndex) {
          s.style.zIndex = '2';
          s.style.opacity = '1';
          s.classList.add('active');
        } else {
          s.style.zIndex = '0';
          s.style.opacity = '0';
          s.classList.remove('active');
        }
      });

      // Update indicator pills
      indicatorPills.forEach((pill, idx) => {
        if (idx === nextIndex) {
          pill.classList.add('active');
        } else {
          pill.classList.remove('active');
        }
      });

      // Update caption if present
      if (slideCaption && captions[nextIndex]) {
        slideCaption.style.opacity = '0';
        setTimeout(() => {
          slideCaption.textContent = captions[nextIndex];
          slideCaption.style.opacity = '1';
        }, 300);
      }

      // After crossfade completes (1.3s), cleanup previous slide
      setTimeout(() => {
        if (prevSlide && slides[currentSlide] !== prevSlide) {
          prevSlide.classList.remove('active');
          prevSlide.style.opacity = '0';
          prevSlide.style.zIndex = '0';
        }
      }, 1300);

      currentSlide = nextIndex;
    };

    const nextSlide = () => {
      const nextIdx = (currentSlide + 1) % slides.length;
      goToSlide(nextIdx);
    };

    const startTimer = () => {
      stopTimer();
      slideTimer = setInterval(nextSlide, slideDuration);
    };

    const stopTimer = () => {
      if (slideTimer) {
        clearInterval(slideTimer);
        slideTimer = null;
      }
    };

    // Attach click events to indicator pills
    indicatorPills.forEach((pill, idx) => {
      pill.addEventListener('click', () => {
        goToSlide(idx);
        startTimer();
      });
    });

    // Pause on hover over controls or hero content if desired
    if (heroContainer) {
      heroContainer.addEventListener('mouseenter', () => {
        // Can let it run continuously or pause
      });
    }

    // Start automated cycle
    startTimer();
  }

  // 5. Pre-fill Product from URL Parameter (e.g. trade.html#enquiry?product=Spices or trade.html?product=Spices)
  const productInput = document.getElementById('product');
  if (productInput) {
    const searchParams = new URLSearchParams(window.location.search);
    let prodVal = searchParams.get('product');
    
    // Check hash for query params like #enquiry?product=Coffee
    if (!prodVal && window.location.hash.includes('?')) {
      const hashQuery = window.location.hash.split('?')[1];
      const hashParams = new URLSearchParams(hashQuery);
      prodVal = hashParams.get('product');
    }

    if (prodVal) {
      productInput.value = decodeURIComponent(prodVal);
      productInput.classList.add('border-primary');
    }
  }

  // 6. File Input Name Display for Trade RFQ Form
  const fileInput = document.querySelector('input[type="file"][name="file"]');
  if (fileInput) {
    const fileLabel = fileInput.closest('label');
    const labelText = fileLabel ? fileLabel.querySelector('.text-sm') : null;
    if (labelText) {
      const defaultText = labelText.textContent;
      fileInput.addEventListener('change', () => {
        if (fileInput.files && fileInput.files.length > 0) {
          const file = fileInput.files[0];
          labelText.textContent = `Selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
          labelText.classList.add('text-primary', 'font-medium');
        } else {
          labelText.textContent = defaultText;
          labelText.classList.remove('text-primary', 'font-medium');
        }
      });
    }
  }

  // 7. Trade Enquiry Form Submission (trade.html)
  const tradeForm = document.getElementById('enquiry');
  if (tradeForm) {
    tradeForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const requiredInputs = tradeForm.querySelectorAll('[required]');
      let isValid = true;
      let firstInvalid = null;

      requiredInputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.classList.add('border-destructive');
          if (!firstInvalid) firstInvalid = input;
        } else {
          input.classList.remove('border-destructive');
        }
      });

      if (!isValid && firstInvalid) {
        firstInvalid.focus();
        return;
      }

      const submitBtn = tradeForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Submit';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Submitting Enquiry...';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }

        let alertBox = document.getElementById('form-feedback');
        if (!alertBox) {
          alertBox = document.createElement('div');
          alertBox.id = 'form-feedback';
          alertBox.className = 'sm:col-span-2 mt-4 p-6 border border-primary/40 bg-secondary/70 text-foreground transition-all';
          tradeForm.appendChild(alertBox);
        }

        const nameVal = (tradeForm.querySelector('[name="name"]') || {}).value || 'there';
        const productVal = (tradeForm.querySelector('[name="product"]') || {}).value || 'your selected products';

        alertBox.innerHTML = `
          <div class="flex items-start gap-4">
            <span class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">✓</span>
            <div>
              <h4 class="font-bold text-lg text-foreground">Trade Enquiry Received</h4>
              <p class="mt-1 text-sm text-foreground/80 leading-relaxed">
                Thank you, <strong>${escapeHtml(nameVal)}</strong>. Your enquiry for <strong>${escapeHtml(productVal)}</strong> has been registered. Our trade desks in the United Kingdom and India will review your specifications and contact you shortly with availability, commercial proposal, and next steps.
              </p>
            </div>
          </div>
        `;
        alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        tradeForm.reset();
      }, 700);
    });
  }

  // 8. Contact Form Submission (contact.html)
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const requiredInputs = contactForm.querySelectorAll('[required]');
      let isValid = true;
      let firstInvalid = null;

      requiredInputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.classList.add('border-destructive');
          if (!firstInvalid) firstInvalid = input;
        } else {
          input.classList.remove('border-destructive');
        }
      });

      if (!isValid && firstInvalid) {
        firstInvalid.focus();
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Send Message';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending Message...';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }

        let alertBox = document.getElementById('contact-feedback');
        if (!alertBox) {
          alertBox = document.createElement('div');
          alertBox.id = 'contact-feedback';
          alertBox.className = 'sm:col-span-2 mt-4 p-6 border border-primary/40 bg-secondary/70 text-foreground transition-all';
          contactForm.appendChild(alertBox);
        }

        const nameVal = (contactForm.querySelector('[name="name"]') || {}).value || 'there';

        alertBox.innerHTML = `
          <div class="flex items-start gap-4">
            <span class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">✓</span>
            <div>
              <h4 class="font-bold text-lg text-foreground">Message Sent</h4>
              <p class="mt-1 text-sm text-foreground/80 leading-relaxed">
                Thank you, <strong>${escapeHtml(nameVal)}</strong>. Your message has been received by our coordination team. We will review your enquiry and respond to your email promptly.
              </p>
            </div>
          </div>
        `;
        alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        contactForm.reset();
      }, 600);
    });
  }

  // 9. Interactive Journey Laser Tracker (From Origin to Delivery / How We Work)
  const journeyCards = document.querySelectorAll('.journey-step-card');
  const laserGlow = document.querySelector('.journey-laser-glow');
  const dossierTitle = document.getElementById('journey-dossier-title');
  const dossierDesc = document.getElementById('journey-dossier-desc');
  const dossierBadge = document.getElementById('journey-dossier-badge');
  const dossierSpecs = document.getElementById('journey-dossier-specs');

  const journeyData = [
    {
      title: "1. Origin Sourcing & Estate Mapping",
      desc: "Direct farm-gate and cooperative estate relationships in Kerala's Western Ghats. Initial estate validation, harvest timing, and crop yield forecasting.",
      badge: "Estate Audits & Farm-Gate",
      specs: ["GPS Origin Geo-Tagging", "GAP Compliance", "Primary Farmer Network"]
    },
    {
      title: "2. Specification & Crop Alignment",
      desc: "Matching international buyer specifications (grade, moisture, volatile oil content, bulk density, packaging formats) with origin harvest capabilities.",
      badge: "Pre-Contract Alignment",
      specs: ["Grade Size (e.g. 8mm Cardamom)", "Moisture Limits (<10-12%)", "Buyer Custom Cut/Sift"]
    },
    {
      title: "3. Technical Sampling & Pre-Shipment",
      desc: "Dispatch of representative origin production lots for laboratory analysis, sensory tasting, and technical validation prior to container loading.",
      badge: "Commercial Representative Sample",
      specs: ["Airfreight Sample Dispatch", "Certificate of Analysis (COA)", "Sensory & Aroma Panel"]
    },
    {
      title: "4. Multi-Parameter Verification & Lab Testing",
      desc: "Mandatory third-party accredited lab testing covering pesticide MRLs, microbial parameters, aflatoxins, and Spices Board of India export clearance.",
      badge: "NABL / ISO 17025 Certified Testing",
      specs: ["Pesticide Residue Screen", "Moisture & Bulk Density", "Microbiological Safety"]
    },
    {
      title: "5. Export Packaging & Customs Dispatch",
      desc: "Food-grade barrier packaging (vacuum nitrogen-flush or multi-wall kraft liners), palletization, phytosanitary inspection, and port clearance at Cochin/JNPT.",
      badge: "Port Clearance & Container Loading",
      specs: ["Nitrogen Flush Barrier Bags", "Phytosanitary Certification", "Direct Ocean FCL / LCL"]
    },
    {
      title: "6. International Arrival & Customer Support",
      desc: "UK direct desk coordination, customs clearance documentation support, VAT/invoicing alignment, and reliable scheduled warehouse delivery.",
      badge: "Destination Coordination",
      specs: ["UK HMRC Clearance", "Direct Account Management", "End-to-End Traceability"]
    }
  ];

  if (journeyCards.length > 0) {
    journeyCards.forEach((card, idx) => {
      card.addEventListener('mouseenter', () => {
        journeyCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        if (laserGlow) {
          const percentage = ((idx + 1) / journeyCards.length) * 100;
          laserGlow.style.width = `${percentage}%`;
        }
        if (dossierTitle && journeyData[idx]) {
          const data = journeyData[idx];
          dossierTitle.textContent = data.title;
          if (dossierDesc) dossierDesc.textContent = data.desc;
          if (dossierBadge) dossierBadge.textContent = data.badge;
          if (dossierSpecs && data.specs) {
            dossierSpecs.innerHTML = data.specs.map(s => `<span class="inline-block bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 text-xs font-semibold rounded-xs">✓ ${s}</span>`).join(' ');
          }
        }
      });
    });
  }

  // 10. Verification Matrix Card Spotlight Tracker
  const verifyCards = document.querySelectorAll('.verification-card');
  verifyCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--card-mouse-x', `${x}px`);
      card.style.setProperty('--card-mouse-y', `${y}px`);
    });
  });

  // 11. 3D Card Tilt on Mouse Move (Products & Features)
  const tiltCards = document.querySelectorAll('.product-card-3d');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });

  // 12. Product Grade Drawer Toggles
  const drawerTriggers = document.querySelectorAll('.toggle-grade-drawer');
  drawerTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-target');
      const drawer = document.getElementById(targetId);
      if (drawer) {
        drawer.classList.toggle('open');
        btn.textContent = drawer.classList.contains('open') ? '▲ Hide Specifications' : '▼ View Specifications & Grades';
      }
    });
  });

  // 13. Products Category Filter Navigation (products.html)
  const filterTabs = document.querySelectorAll('.product-filter-btn');
  const productSections = document.querySelectorAll('.product-category-section');
  if (filterTabs.length > 0) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const category = tab.getAttribute('data-category');
        filterTabs.forEach(t => t.classList.remove('active', '!bg-primary', '!text-ivory'));
        tab.classList.add('active', '!bg-primary', '!text-ivory');

        if (category === 'all') {
          productSections.forEach(sec => sec.classList.remove('hidden'));
        } else {
          productSections.forEach(sec => {
            if (sec.id === category || sec.getAttribute('data-category') === category) {
              sec.classList.remove('hidden');
            } else {
              sec.classList.add('hidden');
            }
          });
        }
      });
    });
  }

  function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }
});
