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
    if (!kochiElements.length && !londonElements.length) return;

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

  // Detailed trade enquiry: open a draft, without claiming delivery.
  const tradeForm = document.getElementById('trade-enquiry-form');
  if (tradeForm) tradeForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!tradeForm.reportValidity()) return;
    const data = new FormData(tradeForm);
    const body = Array.from(data, ([key, value]) => key + ': ' + value).join('\n');
    const uri = 'mailto:contact@tropictreasure.com?subject=' + encodeURIComponent('Trade enquiry: ' + data.get('product')) + '&body=' + encodeURIComponent(body);
    let feedback = document.getElementById('form-feedback');
    if (!feedback) { feedback = document.createElement('p'); feedback.id = 'form-feedback'; feedback.setAttribute('role', 'status'); tradeForm.append(feedback); }
    feedback.textContent = 'Your email draft is ready. Please review and send it in your email app. Attach supporting files there.';
    window.location.href = uri;
  });

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
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-controls', 'journey-dossier-card');
      card.setAttribute('aria-pressed', String(idx === 0));
      const selectStep = () => {
        const detailPanel = document.getElementById('journey-dossier-card');
        if (detailPanel) { card.appendChild(detailPanel); detailPanel.hidden = false; }
        journeyCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        journeyCards.forEach(c => c.setAttribute('aria-pressed', String(c === card)));
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
      };
      card.addEventListener('mouseenter', selectStep);
      card.addEventListener('focus', selectStep);
      card.addEventListener('click', selectStep);
      card.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectStep(); }
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

// Reference hero: three backgrounds with clickable, keyboard-accessible dots.
document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.forest-hero');
  if (!hero) return;
  const slides = [...hero.querySelectorAll('.forest-backdrop')];
  const dots = [...hero.querySelectorAll('.forest-dots button')];
  const pause = hero.querySelector('.forest-pause');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0, timer = null, paused = motion.matches;
  const show = (next) => {
    index = next;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
    dots.forEach((dot, i) => dot.setAttribute('aria-pressed', String(i === index)));
  };
  const restart = () => {
    clearInterval(timer);
    if (!paused && !document.hidden && !hero.matches(':hover') && !hero.contains(document.activeElement)) {
      timer = setInterval(() => show((index + 1) % slides.length), 6500);
    }
    pause.textContent = paused ? 'Play slideshow' : 'Pause slideshow';
    pause.setAttribute('aria-label', paused ? 'Play background slideshow' : 'Pause background slideshow');
  };
  dots.forEach((dot, i) => dot.addEventListener('click', () => { show(i); restart(); }));
  pause.addEventListener('click', () => { paused = !paused; restart(); });
  hero.addEventListener('mouseenter', restart);
  hero.addEventListener('mouseleave', restart);
  hero.addEventListener('focusin', restart);
  hero.addEventListener('focusout', () => setTimeout(restart, 0));
  document.addEventListener('visibilitychange', restart);
  motion.addEventListener('change', () => { paused = motion.matches; restart(); });
  restart();
});

// User-requested pointer movement remains available with reduced-motion enabled.
(() => {
  const init = () => {
    const hero = document.querySelector('.forest-hero');
    if (!hero) return;
    const leaves = [...hero.querySelectorAll('.forest-leaf')];
    let tx = 0, ty = 0, x = 0, y = 0, frame = 0;
    function draw() {
      x += (tx - x) * .065;
      y += (ty - y) * .065;
      leaves.forEach((leaf, i) => {
        const depth = i === 0 ? 80 : 115;
        const angle = (i === 0 ? 60 : -20) + x * (i === 0 ? 14 : -18);
        leaf.style.transform = `translate3d(${(x * depth).toFixed(2)}px, ${(y * depth).toFixed(2)}px, 0) rotate(${angle.toFixed(2)}deg)`;
      });
      frame = Math.abs(tx - x) + Math.abs(ty - y) > .001 ? requestAnimationFrame(draw) : 0;
    }
    function start() { if (!frame) frame = requestAnimationFrame(draw); }
    hero.addEventListener('pointermove', event => {
      if (event.pointerType === 'touch') return;
      const rect = hero.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
      ty = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
      start();
    }, { passive: true });
    function reset() { tx = ty = 0; start(); }
    hero.addEventListener('pointerleave', reset);
    hero.addEventListener('pointercancel', reset);
    window.addEventListener('blur', reset);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

// Product category buttons filter the rail without leaving the homepage.
(() => {
  const rail = document.querySelector('.tt-product-rail');
  if (!rail) return;
  const cards = [...rail.querySelectorAll('.tt-product-item')];
  const prev = document.querySelector('.tt-product-prev');
  const next = document.querySelector('.tt-product-next');
  const buttons = [...document.querySelectorAll('[data-product-category]')];
  const update = () => {
    prev.disabled = rail.scrollLeft < 3;
    next.disabled = rail.scrollWidth - rail.clientWidth - rail.scrollLeft < 3;
  };
  buttons.forEach(button => button.addEventListener('click', () => {
    const category = button.dataset.productCategory;
    buttons.forEach(tab => tab.setAttribute('aria-pressed', String(tab === button)));
    cards.forEach(card => { card.hidden = card.dataset.category !== category; });
    rail.scrollTo({ left: 0, behavior: 'instant' });
    rail.setAttribute('aria-label', button.textContent.replace('→', '').trim() + ' products');
    update();
  }));
  const move = direction => {
    const visible = cards.filter(card => !card.hidden);
    const step = visible.length > 1 ? visible[1].offsetLeft - visible[0].offsetLeft : rail.clientWidth;
    rail.scrollBy({ left: direction * step, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };
  prev.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  rail.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

// Connected lines respond to pointer position and keyboard focus.
(() => {
  document.querySelectorAll('.tt-line-flow').forEach(flow => {
    const reset = () => flow.style.setProperty('--flow-x', '0%');
    flow.addEventListener('pointermove', event => {
      if (event.pointerType === 'touch') return;
      const rect = flow.getBoundingClientRect();
      flow.style.setProperty('--flow-x', Math.max(0, Math.min(100, (event.clientX - rect.left) / rect.width * 100)) + '%');
    }, { passive: true });
    flow.addEventListener('pointerleave', () => { if (!flow.contains(document.activeElement)) reset(); });
    flow.querySelectorAll('li').forEach((item, index, items) => item.addEventListener('focus', () => flow.style.setProperty('--flow-x', ((index + 1) / items.length * 100) + '%')));
    flow.addEventListener('focusout', event => { if (!flow.contains(event.relatedTarget)) reset(); });
  });
})();

// Homepage enquiry creates an email draft; it never reports delivery.
(() => {
  const form = document.getElementById('tt-home-enquiry');
  if (!form) return;
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const body = ['Trade enquiry — Tropic Treasure', '', ...Array.from(data, ([key, value]) => key.replace(/_/g, ' ') + ': ' + String(value).trim())].join('\n');
    const uri = 'mailto:contact@tropictreasure.com?subject=' + encodeURIComponent('Trade enquiry: ' + data.get('product')) + '&body=' + encodeURIComponent(body);
    const feedback = document.getElementById('tt-home-feedback');
    feedback.replaceChildren(document.createTextNode('Your enquiry is ready. Review and send it in your email app. If it did not open, '));
    const link = document.createElement('a'); link.href = uri; link.textContent = 'open your prepared email'; link.style.textDecoration = 'underline'; feedback.append(link);
    window.location.href = uri;
  });
})();

// Coffee selection preserves a clear, product-specific enquiry path.
(() => {
  const descriptions = {
    green: 'Explore India-origin green coffee. Discuss origin, grade, processing, quantity and packaging requirements with our team.',
    roasted: 'Explore India-origin roasted coffee. Discuss roast preference, whole bean or ground format, packaging and intended application.'
  };
  const coffee = document.getElementById('flagship-coffee');
  if (coffee) {
    let selected = 'green';
    const enquire = coffee.querySelector('[data-coffee-enquire]');
    enquire.href = 'trade.html?product=Indian%20Green%20Coffee#enquiry';
    coffee.querySelectorAll('[data-coffee-format]').forEach(button => button.addEventListener('click', () => {
      selected = button.dataset.coffeeFormat;
      coffee.querySelectorAll('[data-coffee-format]').forEach(option => option.setAttribute('aria-pressed', String(option === button)));
      document.getElementById('tt-coffee-description').textContent = descriptions[selected];
      enquire.textContent = selected === 'green' ? 'Enquire About Green Coffee →' : 'Enquire About Roasted Coffee →';
      enquire.href = 'trade.html?product=' + encodeURIComponent(selected === 'green' ? 'Indian Green Coffee' : 'Indian Roasted Coffee') + '#enquiry';
    }));
    enquire.addEventListener('click', () => {
      const input = document.getElementById('tt-product');
      if (input) input.value = selected === 'green' ? 'Indian Green Coffee' : 'Indian Roasted Coffee';
    });
  }
  const process = document.getElementById('how-we-work');
  if (process) {
    const details = [
      'Start with your product, intended use and destination. These guide the sourcing discussion.',
      'We review specifications, supplier capability and available evidence. Samples and relevant testing can be discussed where suitable.',
      'We review available technical, commercial and shipment documentation against the agreed requirement.',
      'We coordinate communication between the buyer, supplier and relevant service partners around agreed responsibilities.',
      'Shipment preparation and delivery coordination follow the agreed commercial terms and arrangements.',
      'Buyer feedback and supply performance help identify practical improvements for future orders.'
    ];
    const panel = document.getElementById('tt-process-detail');
    process.querySelectorAll('[data-process-step]').forEach(button => button.addEventListener('click', () => {
      process.querySelectorAll('[data-process-step]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
      const index = Number(button.dataset.processStep);
      panel.querySelector('span').textContent = String(index + 1).padStart(2, '0') + ' · ' + ['SOURCE', 'VERIFY', 'DOCUMENT', 'COORDINATE', 'DELIVER', 'IMPROVE'][index];
      panel.querySelector('p').textContent = details[index];
    }));
  }
  // Product cards carry their selection into the detailed enquiry form.
  document.querySelectorAll('.tt-product-item').forEach(card => {
    const title = card.querySelector('h3');
    if (title) card.setAttribute('aria-label', title.textContent.trim() + ' — view product');
  });
})();

// Process selection responds to pointer hover, keyboard focus and touch/click.
(() => {
  const process = document.getElementById('how-we-work');
  if (!process) return;
  const controls = [...process.querySelectorAll('[data-process-step]')];
  const sync = () => controls.forEach(button => button.closest('li').classList.toggle('is-selected', button.getAttribute('aria-pressed') === 'true'));
  controls.forEach(button => {
    button.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') button.click(); });
    button.addEventListener('focus', () => button.click());
    button.addEventListener('click', sync);
  });
  sync();
})();

// Coffee entrance: normal page scroll, no pinning and no image scaling.
(() => {
  const init = () => {
    const section = document.getElementById('flagship-coffee');
    if (!section) return;
    const scene = section.querySelector('.tt-coffee-scene');
    const image = section.querySelector('.tt-coffee-visual');
    const copy = section.querySelector('.tt-coffee-content');
    if (!scene || !image || !copy) return;
    const desktop = window.matchMedia('(min-width:761px)');
    const reduced = window.matchMedia('(prefers-reduced-motion:reduce)');
    let pending = false;
    const render = () => {
      pending = false;
      const box = scene.getBoundingClientRect();
      const viewport = window.innerHeight;
      // Finish before the slide reaches the upper third of the viewport.
      const start = viewport * 0.95;
      const end = viewport * 0.30;
      const progress = Math.max(0, Math.min(1, (start - box.top) / Math.max(1, start - end)));
      const distance = desktop.matches && !reduced.matches
        ? Math.min(box.width * 0.55, 620) * (1 - progress) : 0;
      image.style.setProperty('--coffee-enter-x', -distance + 'px');
      copy.style.setProperty('--coffee-enter-x', distance + 'px');
    };
    const schedule = () => {
      if (pending) return;
      pending = true;
      window.requestAnimationFrame(render);
    };
    // Capture also observes scroll events from an enclosing scroll container.
    window.addEventListener('scroll', schedule, { passive: true, capture: true });
    window.addEventListener('resize', schedule, { passive: true });
    window.addEventListener('pageshow', schedule);
    [desktop, reduced].forEach(query => {
      if (query.addEventListener) query.addEventListener('change', schedule);
      else if (query.addListener) query.addListener(schedule);
    });
    if (window.ResizeObserver) new ResizeObserver(schedule).observe(scene);
    section.querySelectorAll('img').forEach(img => img.addEventListener('load', schedule));
    if (document.fonts) document.fonts.ready.then(schedule);
    render();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();

// Botanical movement is decorative; native links and details remain fully usable.
(() => {
  const initBotanical = () => {
    const motion = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    document.querySelectorAll('[data-botanical-motion]').forEach(section => {
      let frame = 0;
      const reset = () => {
        cancelAnimationFrame(frame);
        section.style.removeProperty('--botanical-x');
        section.style.removeProperty('--botanical-y');
      };
      section.addEventListener('pointermove', event => {
        if (!motion.matches || event.pointerType === 'touch') return;
        const rect = section.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - .5) * 14;
        const y = ((event.clientY - rect.top) / rect.height - .5) * 10;
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          section.style.setProperty('--botanical-x', `${x.toFixed(2)}px`);
          section.style.setProperty('--botanical-y', `${y.toFixed(2)}px`);
        });
      }, { passive: true });
      section.addEventListener('pointerleave', reset);
      section.addEventListener('pointercancel', reset);
      if (motion.addEventListener) motion.addEventListener('change', reset);
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initBotanical, { once: true });
  else initBotanical();
})();
;
// Integrated products-page interactions.
/* Product explorer: all product content remains available without JavaScript. */
(() => {
  const init = () => {
    const root = document.querySelector('#product-portfolio');
    if (!root) return;
    const tools = root.querySelector('.pt-tools');
    const input = root.querySelector('#pt-search');
    const categories = [...root.querySelectorAll('[data-category]')];
    const buttons = [...root.querySelectorAll('[data-filter]')];
    const status = root.querySelector('#pt-result-count');
    const empty = root.querySelector('.pt-empty');
    const searchable = new Map(categories.map(section => [section, section.textContent.toLowerCase()]));
    let filter = 'coffee';
    tools.hidden = false;
    const apply = () => {
      const terms = input.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
      let count = 0;
      categories.forEach(section => {
        const matches = (filter === 'all' || section.dataset.category === filter) && terms.every(term => searchable.get(section).includes(term));
        section.hidden = !matches;
        if (matches) count++;
      });
      buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === filter)));
      status.textContent = `${count} product collection${count === 1 ? '' : 's'}${input.value.trim() ? ` matching “${input.value.trim()}”` : ''}`;
      empty.hidden = count !== 0;
    };
    buttons.forEach(button => button.addEventListener('click', () => { filter = button.dataset.filter; apply(); }));
    input.addEventListener('input', apply);
    root.addEventListener('pt:collectionchange', event => {
      if (!categories.some(section => section.id === event.detail.id)) return;
      filter = event.detail.id; input.value = ''; apply();
    });
    root.querySelectorAll('.pt-reset').forEach(button => button.addEventListener('click', () => { input.value = ''; apply(); }));
    root.querySelectorAll('[data-filter-link]').forEach(link => link.addEventListener('click', () => {
      filter = link.dataset.filterLink; input.value = ''; apply();
    }));
    // Restore a category when navigating through a footer or external hash link.
    const syncHash = () => {
      const key = location.hash.slice(1);
      if (categories.some(section => section.id === key)) {
        filter = key; input.value = ''; apply();
      }
    };
    window.addEventListener('hashchange', syncHash);
    syncHash(); apply();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();

// Collection stage: category previews, arrow controls and touch swipes.
(() => {
  const init = () => {
    const stage=document.querySelector('.pt-showcase');if(!stage)return;
    const collections=[
      {id:'coffee',title:['Indian','Coffee.'],label:'01 / FLAGSHIP COLLECTION',image:'assets/coffee-monsooned-malabar.jpg',description:'Explore Monsooned Malabar, washed Arabica, Robusta and roasted coffee formats.',tags:['Green beans','Roasted formats','Grade selection'],cta:'Explore coffee'},
      {id:'spices',title:['Origin','Spices.'],label:'02 / ORIGIN SPICES',image:'assets/cat-spices.jpg',description:'Explore pepper, cardamom, ginger, turmeric, chilli, cloves and nutmeg in the formats your business needs.',tags:['Whole spices','Dried formats','Ground selections'],cta:'Explore spices'},
      {id:'nuts',title:['Cashew','Kernels.'],label:'03 / ORIGIN NUTS',image:'assets/cat-nuts.jpg',description:'Find whole kernel grades, splits, butts and pieces for retail, roasting and food manufacturing.',tags:['Whole kernels','Splits & pieces','Grade selection'],cta:'Explore cashews'},
      {id:'oleoresins',title:['Spice','Extracts.'],label:'04 / OLEORESINS',image:'assets/cat-oleoresins.jpg',description:'Explore turmeric, clove, ginger and black pepper extracts, with specifications reviewed for each enquiry.',tags:['Concentrated formats','Application review','Buyer specifications'],cta:'Explore oleoresins'}
    ];
    let current=0;const tabs=[...stage.querySelectorAll('[data-preview]')];
    const image=stage.querySelector('#pt-stage-image');
    const select=index=>{
      current=(index+collections.length)%collections.length;const item=collections[current];
      image.src=item.image;image.alt=item.title.join(' ');
      const title=stage.querySelector('h2');title.replaceChildren();
      title.append(document.createTextNode(item.title[0]),document.createElement('br'));
      const em=document.createElement('em');em.textContent=item.title[1];title.append(em);
      stage.querySelector('.pt-stage-eyebrow').textContent=item.label;
      stage.querySelector('#pt-stage-description').textContent=item.description;
      const tags=stage.querySelector('.pt-stage-tags');tags.replaceChildren();item.tags.forEach(text=>{const span=document.createElement('span');span.textContent=text;tags.append(span);});
      stage.querySelector('.pt-stage-number').textContent=String(current+1).padStart(2,'0');
      stage.style.setProperty('--stage-position',`${current*100}%`);
      tabs.forEach((tab,i)=>{if(i===current)tab.setAttribute('aria-current','true');else tab.removeAttribute('aria-current');});
      stage.querySelector('.pt-stage-live').textContent=`Previewing ${item.title.join(' ')}`;
      document.querySelector('#product-portfolio').dispatchEvent(new CustomEvent('pt:collectionchange',{detail:{id:item.id}}));
    };
    tabs.forEach((tab,i)=>{
      tab.addEventListener('click',event=>{event.preventDefault();select(i);});
      tab.addEventListener('keydown',event=>{
        if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();
        const next=event.key==='Home'?0:event.key==='End'?3:i+(event.key==='ArrowRight'?1:-1);
        select(next);tabs[current].focus();
      });
    });
    stage.querySelector('.pt-stage-arrows').hidden=false;
    stage.querySelector('.pt-stage-prev').addEventListener('click',()=>select(current-1));
    stage.querySelector('.pt-stage-next').addEventListener('click',()=>select(current+1));
    // Category filters and hash links select the matching visual collection.
    document.querySelectorAll('#product-portfolio [data-filter]').forEach(button=>button.addEventListener('click',()=>{
      const index=collections.findIndex(item=>item.id===button.dataset.filter);
      if(index>=0)select(index);
    }));
    const matchHash=()=>{
      const index=collections.findIndex(item=>'#'+item.id===location.hash);
      if(index>=0)select(index);
    };
    window.addEventListener('hashchange',matchHash);matchHash();
    const surface=stage.querySelector('.pt-stage-art');let down=null;
    surface.addEventListener('pointerdown',event=>{if(event.pointerType==='touch')down={x:event.clientX,y:event.clientY};},{passive:true});
    surface.addEventListener('pointerup',event=>{
      if(!down)return;const dx=event.clientX-down.x,dy=event.clientY-down.y;down=null;
      if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.4)select(current+(dx<0?1:-1));
    },{passive:true});
    surface.addEventListener('pointercancel',()=>{down=null;});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

// Neighbour previews and responsive detail imagery.
(() => {
  const init = () => {
    const stage=document.querySelector('.pt-showcase');
    if(!stage)return;
    const tabs=[...stage.querySelectorAll('[data-preview]')];
    const data=[['Indian Coffee','assets/coffee-monsooned-malabar.jpg'],['Origin Spices','assets/cat-spices.jpg'],['Cashew Kernels','assets/cat-nuts.jpg'],['Oleoresins','assets/cat-oleoresins.jpg']];
    const reduced=matchMedia('(prefers-reduced-motion:reduce)');
    const current=()=>Math.max(0,tabs.findIndex(tab=>tab.getAttribute('aria-current')==='true'));
    let last=current();
    const update=()=>{
      const index=current();
      for(const [selector,offset] of [['.pt-peek-prev',-1],['.pt-peek-next',1]]){
        const button=stage.querySelector(selector);if(!button)continue;
        const item=data[(index+offset+data.length)%data.length];
        button.hidden=false;button.querySelector('img').src=item[1];
        button.querySelector('.pt-peek-label').textContent=item[0];
        button.setAttribute('aria-label',`Preview ${item[0]}`);
      }
      if(index!==last&&!reduced.matches){
        const panel=stage.querySelector('.pt-stage');
        if(panel.animate)panel.animate([{opacity:.65,transform:`translateX(${index>last?14:-14}px)`},{opacity:1,transform:'translateX(0)'}],{duration:360,easing:'cubic-bezier(.2,.7,.3,1)'});
      }
      last=index;
    };
    stage.querySelector('.pt-peek-prev')?.addEventListener('click',()=>tabs[(current()+3)%4].click());
    stage.querySelector('.pt-peek-next')?.addEventListener('click',()=>tabs[(current()+1)%4].click());
    const observer=new MutationObserver(update);
    tabs.forEach(tab=>observer.observe(tab,{attributes:true,attributeFilter:['aria-current']}));
    update();
    document.querySelectorAll('.pt-immersive-category').forEach(section=>{
      const badge=section.querySelector('.pt-active-product');
      const art=section.querySelector('.pt-tall-photo');
      const details=[...section.querySelectorAll('.pt-spec')];
      if(!badge||!art)return;
      const heading=section.querySelector('h2').textContent.trim();badge.textContent=heading;
      details.forEach((detail,i)=>detail.addEventListener('toggle',()=>{
        if(detail.open){
          details.forEach(other=>{if(other!==detail)other.open=false;});
          badge.textContent=detail.querySelector('summary').textContent.trim();
          art.style.setProperty('--pt-focal',`${38+(i%3)*12}% ${35+(i%4)*10}%`);
        } else if(!details.some(other=>other.open))badge.textContent=heading;
      }));
    });
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

// Flagship coffee: select a grade to open its complete profile.
(() => {
  const init = () => {
    const board=document.querySelector('.pt-coffee-grades');if(!board)return;
    const cards=[...board.querySelectorAll('.pt-grade-card')];if(!cards.length)return;
    const nav=document.createElement('nav');nav.className='pt-grade-navigation';nav.setAttribute('aria-label','Choose a flagship coffee grade');
    const controls=[];
    const reduced=matchMedia('(prefers-reduced-motion:reduce)');
    const select=index=>{
      cards.forEach((card,i)=>{card.hidden=i!==index;controls[i].setAttribute('aria-pressed',String(i===index));});
      const card=cards[index];
      if(!reduced.matches&&card.animate)card.animate([{opacity:.45,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:280,easing:'ease-out'});
    };
    cards.forEach((card,i)=>{
      card.id=`pt-grade-profile-${i+1}`;card.setAttribute('role','region');
      const title=card.querySelector('h4');title.id=`pt-grade-heading-${i+1}`;card.setAttribute('aria-labelledby',title.id);
      const details=card.querySelector('details');if(details)details.open=true;
      const button=document.createElement('button');button.type='button';button.setAttribute('aria-controls',card.id);
      const number=document.createElement('span');number.textContent=`${String(i+1).padStart(2,'0')} / ${['Monsooned','Washed Arabica','Fine Robusta','Roasted formats'][i]||'Green coffee'}`;
      const label=document.createElement('strong');label.textContent=title.textContent;
      button.append(number,label);button.addEventListener('click',()=>select(i));
      button.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch')select(i);});button.addEventListener('focus',()=>select(i));
      button.addEventListener('keydown',event=>{
        if(!['ArrowDown','ArrowUp','ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();
        const next=event.key==='Home'?0:event.key==='End'?cards.length-1:(i+(event.key==='ArrowDown'||event.key==='ArrowRight'?1:-1)+cards.length)%cards.length;
        select(next);controls[next].focus();
      });
      controls.push(button);nav.append(button);
    });
    board.insertBefore(nav,board.querySelector('.pt-grade-grid'));board.classList.add('pt-grade-enhanced');select(0);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

// Timed collection browsing, with explicit pause and interaction-aware playback.
(() => {
  const init = () => {
    const stage=document.querySelector('.pt-showcase');if(!stage)return;
    const next=stage.querySelector('.pt-stage-next');if(!next)return;
    const reduced=matchMedia('(prefers-reduced-motion:reduce)');
    const button=document.createElement('button');button.type='button';button.className='pt-playback';
    const heading=stage.querySelector('.pt-showcase-heading');heading.append(button);
    const line=stage.querySelector('.pt-stage-meter');
    line.classList.add('pt-autoplay-track');line.innerHTML='<span></span>';
    const countdown=document.createElement('p');countdown.className='pt-countdown-label';
    countdown.setAttribute('aria-hidden','true');line.before(countdown);
    let playing=false,hovered=false,focused=false,inView=false,timer=0,clock=0;
    const stop=()=>{clearTimeout(timer);clearInterval(clock);timer=0;stage.classList.remove('pt-is-playing');countdown.textContent=playing?'Slideshow paused':'Press Play to browse collections';};
    const schedule=()=>{
      stop();
      button.textContent=playing?'Ⅱ Pause':'▶ Play';
      button.setAttribute('aria-label',playing?'Pause automatic collection changes':'Play automatic collection changes');
      if(!playing||hovered||focused||!inView||document.hidden)return;
      void line.offsetWidth;stage.classList.add('pt-is-playing');
      const deadline=performance.now()+6500;
      const tick=()=>{countdown.textContent=`Next collection · ${Math.max(1,Math.ceil((deadline-performance.now())/1000))}s`;};
      tick();clock=setInterval(tick,200);
      timer=setTimeout(()=>{next.click();schedule();},6500);
    };
    button.addEventListener('click',()=>{playing=!playing;hovered=false;focused=false;schedule();});
    stage.querySelector('.pt-stage').addEventListener('pointerenter',event=>{if(event.pointerType!=='touch'){hovered=true;schedule();}});
    stage.querySelector('.pt-stage').addEventListener('pointerleave',()=>{hovered=false;schedule();});
    stage.addEventListener('focusin',event=>{focused=event.target!==button;schedule();});
    stage.addEventListener('focusout',event=>{if(!stage.contains(event.relatedTarget)){focused=false;schedule();}});
    stage.addEventListener('click',event=>{if(event.target.closest('.pt-stage-prev,.pt-stage-next,[data-preview],.pt-peek'))schedule();});
    document.addEventListener('visibilitychange',schedule);
    if(window.IntersectionObserver)new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;schedule();},{threshold:.35}).observe(stage);
    else {inView=true;schedule();}
    if(reduced.addEventListener)reduced.addEventListener('change',()=>{if(reduced.matches)playing=false;schedule();});
    // Give the image and copy their own gentle entrance on each selected slide.
    const tabs=[...stage.querySelectorAll('[data-preview]')];let last=tabs.findIndex(tab=>tab.getAttribute('aria-current')==='true');
    new MutationObserver(()=>{
      const index=tabs.findIndex(tab=>tab.getAttribute('aria-current')==='true');if(index===last)return;last=index;
      if(!reduced.matches){
        const image=stage.querySelector('#pt-stage-image'),copy=stage.querySelector('.pt-stage-copy');
        if(image.animate)image.animate([{opacity:.35,transform:'scale(1.055)'},{opacity:1,transform:'scale(1)'}],{duration:650,easing:'ease-out'});
        if(copy.animate)copy.animate([{opacity:.35,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:440,easing:'ease-out'});
      }
      schedule();
    }).observe(stage.querySelector('.pt-collection-tabs'),{subtree:true,attributes:true,attributeFilter:['aria-current']});
    schedule();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

// Simple product lists: hover to preview, click or focus to keep a product open.
(() => {
 const init=()=>{
  document.querySelectorAll('.pt-spice-products,.pt-product-stories').forEach(list=>{
   const products=[...list.children].filter(el=>el.matches('article'));if(!products.length)return;
   const nav=document.createElement('nav');nav.className='pt-product-list';nav.setAttribute('aria-label','Choose a product');
   const buttons=[];
   const choose=index=>{
    products.forEach((product,i)=>{product.hidden=i!==index;buttons[i].setAttribute('aria-pressed',String(i===index));});
   };
   products.forEach((product,i)=>{
    product.id=product.id||`${list.closest('[data-category]').id}-product-${i+1}`;
    const button=document.createElement('button');button.type='button';button.textContent=product.querySelector('h3').textContent.trim();button.setAttribute('aria-controls',product.id);
    button.addEventListener('click',()=>choose(i));button.addEventListener('focus',()=>choose(i));
    button.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch')choose(i);});
    button.addEventListener('keydown',event=>{
     if(!['ArrowDown','ArrowUp','ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();
     const next=event.key==='Home'?0:event.key==='End'?buttons.length-1:(i+(event.key==='ArrowDown'||event.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;
     choose(next);buttons[next].focus();
    });buttons.push(button);nav.append(button);
   });
   list.before(nav);list.classList.add('pt-single-product');choose(0);
  });
  // Mouse previews on the collection controls share the same selection behaviour.
  document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch')button.click();}));
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

// Pointer polish: subtle depth and local light, without moving reading text.
(() => {
 const init=()=>{
  const page=document.querySelector('.products-page');if(!page)return;
  const enabled=matchMedia('(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)');
  const tags=page.querySelector('.pt-stage-tags');
  if(tags){
   let tagFrame=0;
   tags.addEventListener('pointermove',event=>{
    const tag=event.target.closest('span');if(!tag||!enabled.matches||event.pointerType==='touch')return;
    const box=tag.getBoundingClientRect();const x=(event.clientX-box.left)/box.width*100,y=(event.clientY-box.top)/box.height*100;
    cancelAnimationFrame(tagFrame);tagFrame=requestAnimationFrame(()=>{tag.style.setProperty('--pointer-x',`${x}%`);tag.style.setProperty('--pointer-y',`${y}%`);});
   },{passive:true});
   tags.addEventListener('pointerleave',()=>cancelAnimationFrame(tagFrame));
  }
  const targets=new Set(page.querySelectorAll('.pt-stage-art,.pt-peek,.pt-coffee-photo .pt-image-button,.pt-coffee-feature-copy>.grid>div,.pt-trade-card,.pt-product-list button,.pt-grade-navigation button,.pt-filter-group button,.pt-playback,.pt-spice-art,.pt-story-image,.pt-grade-card,.pt-spice-enquire,.pt-coffee-feature-copy .btn'));
  // These interactive image buttons already sit inside the independently moving artwork.
  const artwork=new Set(page.querySelectorAll('.pt-stage-art,.pt-coffee-photo .pt-image-button,.pt-spice-art,.pt-story-image'));
  targets.forEach(el=>{
   el.classList.add('pt-pointer-surface');if(artwork.has(el))el.classList.add('pt-pointer-art');
   let frame=0;
   const reset=()=>{cancelAnimationFrame(frame);el.style.removeProperty('--pointer-x');el.style.removeProperty('--pointer-y');el.style.removeProperty('--pointer-rx');el.style.removeProperty('--pointer-ry');el.classList.remove('pt-pointer-active');};
   el.addEventListener('pointermove',event=>{
    if(!enabled.matches||event.pointerType==='touch')return;
    const rect=el.getBoundingClientRect();
    const x=Math.max(0,Math.min(1,(event.clientX-rect.left)/rect.width));
    const y=Math.max(0,Math.min(1,(event.clientY-rect.top)/rect.height));
    cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{
     el.style.setProperty('--pointer-x',`${x*100}%`);el.style.setProperty('--pointer-y',`${y*100}%`);
     el.style.setProperty('--pointer-rx',`${(y-.5)*-2.4}deg`);el.style.setProperty('--pointer-ry',`${(x-.5)*2.4}deg`);
     el.classList.add('pt-pointer-active');
    });
   },{passive:true});
   el.addEventListener('pointerleave',reset);el.addEventListener('pointercancel',reset);
   if(enabled.addEventListener)enabled.addEventListener('change',reset);
  });
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

/* Shared current-page navigation and Quality pointer response. */
(() => {
  const init = () => {
    const pageName = path => {
      const name = path.split('/').filter(Boolean).pop() || 'index';
      return name.replace(/\.html?$/i, '').toLowerCase();
    };
    const current = pageName(location.pathname);
    document.querySelectorAll('header nav a[href]').forEach(link => {
      const url = new URL(link.getAttribute('href'), location.href);
      if (url.origin !== location.origin || link.classList.contains('btn')) return;
      link.classList.add('tt-page-link');
      const selected = pageName(url.pathname) === current;
      if (selected) link.setAttribute('aria-current', 'page');
      else if (link.getAttribute('aria-current') === 'page') link.removeAttribute('aria-current');
    });
    if (!document.body.classList.contains('quality-page')) return;
    const motion = matchMedia('(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)');
    document.querySelectorAll('.qy-hero-visual,.qy-origin-study,.qy-pillar summary,.qy-route-panels,.qy-cta .btn,.qy-hero-link').forEach(el => {
      el.classList.add('qy-pointer-surface');
      let frame = 0;
      const reset = () => {
        cancelAnimationFrame(frame);
        el.classList.remove('qy-pointer-active');
        ['--qy-x','--qy-y','--qy-rx','--qy-ry'].forEach(prop => el.style.removeProperty(prop));
      };
      el.addEventListener('pointermove', event => {
        if (!motion.matches || event.pointerType === 'touch') return;
        const box = el.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (event.clientX - box.left) / box.width));
        const y = Math.max(0, Math.min(1, (event.clientY - box.top) / box.height));
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          el.style.setProperty('--qy-x', `${x * 100}%`);
          el.style.setProperty('--qy-y', `${y * 100}%`);
          el.style.setProperty('--qy-rx', `${(0.5 - y) * 2}deg`);
          el.style.setProperty('--qy-ry', `${(x - 0.5) * 2}deg`);
          el.classList.add('qy-pointer-active');
        });
      }, {passive:true});
      el.addEventListener('pointerleave', reset);
      el.addEventListener('pointercancel', reset);
      motion.addEventListener('change', reset);
    });
    document.querySelectorAll('.qy-route-next').forEach(label => {
      label.tabIndex = 0;
      label.setAttribute('role', 'button');
      label.addEventListener('keydown', event => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        label.click();
        document.getElementById(label.htmlFor)?.focus({preventScroll:true});
      });
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();

/* Contact correspondence desk: enquiry routing and honest email handoff. */
(() => {
 const init = () => {
  const form=document.getElementById('ct-message-form'); if(!form)return;
  const topics=[...document.querySelectorAll('.ct-topic')],select=document.getElementById('ct-topic');
  const sync=()=>{
   topics.forEach(button=>{const selected=button.dataset.topic===select.value;button.classList.toggle('is-selected',selected);button.setAttribute('aria-pressed',String(selected));});
   const themes={'Trade Enquiry':['trade','Tell us what you are looking to source.'],'Order & Product Support':['support','Tell us about your product or support question.'],'General Enquiry':['general','Share your idea, question or partnership enquiry.']};
   const theme=themes[select.value]||themes['General Enquiry'];
   document.body.dataset.contactTheme=theme[0];
   const context=document.getElementById('ct-story-context'),category=document.getElementById('ct-postcard-category');
   if(context)context.textContent=theme[1];if(category)category.textContent=select.value.toUpperCase();
  };
  topics.forEach(button=>button.addEventListener('click',()=>{select.value=button.dataset.topic;sync();}));
  select.addEventListener('change',sync);sync();
  const enabled=matchMedia('(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)');
  document.querySelectorAll('.ct-topic,.ct-routing').forEach(el=>{
   let frame=0;
   const reset=()=>{cancelAnimationFrame(frame);el.style.removeProperty('--ct-x');el.style.removeProperty('--ct-y');};
   el.addEventListener('pointermove',event=>{
    if(!enabled.matches||event.pointerType==='touch')return;
    const box=el.getBoundingClientRect(),x=(event.clientX-box.left)/box.width*100,y=(event.clientY-box.top)/box.height*100;
    cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{el.style.setProperty('--ct-x',`${x}%`);el.style.setProperty('--ct-y',`${y}%`);});
   },{passive:true});el.addEventListener('pointerleave',reset);el.addEventListener('pointercancel',reset);enabled.addEventListener('change',reset);
  });
  const panel=document.getElementById('ct-fallback'),status=document.getElementById('ct-status'),copy=document.getElementById('ct-email-text'),open=document.getElementById('ct-open-email');
  form.addEventListener('submit',event=>{
   event.preventDefault();if(!form.reportValidity())return;
   const data=new FormData(form),get=key=>String(data.get(key)||'').trim();
   const subject='Tropic Treasure — '+get('topic');
   const body='Name: '+get('name')+'\r\nEmail: '+get('email')+'\r\nCompany: '+(get('company')||'Not specified')+'\r\nEnquiry type: '+get('topic')+'\r\n\r\n'+get('message');
   const mail='mailto:contact@tropictreasure.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body),long=mail.length>1800;
   open.href=long?'mailto:contact@tropictreasure.com?subject='+encodeURIComponent(subject):mail;
   copy.value='To: contact@tropictreasure.com\nSubject: '+subject+'\n\n'+body;panel.hidden=false;
   status.textContent=long?'Your message is ready. Copy the details below and paste them into your email app, then review and send.':'Your email app has been requested. Review and send your message there. If it did not open, use the link or copy your message below. This website has not sent your message.';
   if(!long)open.click();
   panel.scrollIntoView({block:'nearest',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});
  });
  document.getElementById('ct-copy-message').addEventListener('click',async()=>{
   try{await navigator.clipboard.writeText(copy.value);status.textContent='Message copied. Paste it into an email to contact@tropictreasure.com, then send.';}
   catch{copy.focus();copy.select();status.textContent='Text selected. Copy it and paste it into your email app.';}
  });
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

/* Selecting Home again restarts the homepage. */
document.addEventListener('click', event => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = event.target.closest('a[href]');
  if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
  const target = new URL(link.href, window.location.href);
  if (target.origin !== window.location.origin || !/\/index\.html$/.test(target.pathname) || target.search || target.hash) return;
  const here = window.location.pathname;
  const directory = target.pathname.slice(0, -'index.html'.length);
  if (here === target.pathname || here === directory) {
    event.preventDefault();
    window.location.reload();
  }
});
