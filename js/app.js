/**
 * AgriLocal Application Core Logic
 * Handles:
 * - Theme toggle (Light/Dark) with persistence
 * - Language switcher (English/Telugu) with persistence
 * - Mobile navigation menu with focus trap & outside-click handling
 * - Shop directory live search, filtering by category and area, sorting
 * - Price comparison matrix calculation & lowest rate highlighting
 * - Responsive gallery rendering with accessible lightbox modal
 * - Client-side form validation and localStorage caching
 * - Scroll-to-top button
 * - Service worker safe registration
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initLanguage();
  initNavigation();
  initScrollToTop();
  registerServiceWorker();

  // Route-specific initializers
  const path = window.location.pathname.toLowerCase();
  if (path.endsWith('shops.html') || document.getElementById('shops-grid')) {
    initShopsDirectory();
  }
  if (path.endsWith('compare.html') || document.getElementById('price-table')) {
    initPriceComparison();
  }
  if (path.endsWith('gallery.html') || document.getElementById('gallery-grid')) {
    initGallery();
  }
  if (path.endsWith('feedback.html') || document.getElementById('feedback-form')) {
    initFeedbackForms();
  }
});

/* ==========================================================================
   1. Theme Management (Light / Dark)
   ========================================================================== */
function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  const savedTheme = getStorageItem('agrilocal_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

  applyTheme(initialTheme);

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    setStorageItem('agrilocal_theme', nextTheme);
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    const icon = toggleBtn.querySelector('.theme-icon');
    if (icon) {
      icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
    toggleBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }
}

/* ==========================================================================
   2. Language Management (English / Telugu)
   ========================================================================== */
function initLanguage() {
  const langBtn = document.getElementById('lang-toggle');
  const savedLang = getStorageItem('agrilocal_lang') || 'en';
  applyLanguage(savedLang);

  if (langBtn) {
    langBtn.addEventListener('click', () => {
      const currentLang = document.documentElement.getAttribute('lang') || 'en';
      const nextLang = currentLang === 'te' ? 'en' : 'te';
      applyLanguage(nextLang);
      setStorageItem('agrilocal_lang', nextLang);
    });
  }
}

function applyLanguage(lang) {
  document.documentElement.setAttribute('lang', lang);
  if (lang === 'te') {
    document.documentElement.classList.add('lang-te');
  } else {
    document.documentElement.classList.remove('lang-te');
  }

  const langBtn = document.getElementById('lang-toggle');
  if (langBtn) {
    const langText = langBtn.querySelector('.lang-text');
    if (langText) {
      langText.textContent = lang === 'te' ? 'English' : 'తెలుగు';
    }
    langBtn.setAttribute('aria-label', lang === 'te' ? 'Switch to English' : 'Switch to Telugu');
  }

  // Update text contents based on data-i18n
  const elements = document.querySelectorAll('[data-i18n]');
  const dict = (typeof I18N_TRANSLATIONS !== 'undefined') ? I18N_TRANSLATIONS[lang] || I18N_TRANSLATIONS.en : null;
  if (!dict) return;

  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  // Update attributes like placeholders
  const attrElements = document.querySelectorAll('[data-i18n-attr]');
  attrElements.forEach(el => {
    const spec = el.getAttribute('data-i18n-attr'); // e.g., "placeholder:searchPlaceholder"
    const [attr, key] = spec.split(':');
    if (dict[key]) {
      el.setAttribute(attr, dict[key]);
    }
  });
}

/* ==========================================================================
   3. Mobile Navigation & Accessibility
   ========================================================================== */
function initNavigation() {
  const navToggle = document.getElementById('nav-toggle');
  const primaryNav = document.getElementById('primary-nav');
  if (!navToggle || !primaryNav) return;

  function closeMenu() {
    navToggle.setAttribute('aria-expanded', 'false');
    primaryNav.classList.remove('is-open');
    document.removeEventListener('keydown', handleNavKeydown);
  }

  function openMenu() {
    navToggle.setAttribute('aria-expanded', 'true');
    primaryNav.classList.add('is-open');
    document.addEventListener('keydown', handleNavKeydown);
  }

  function handleNavKeydown(e) {
    if (e.key === 'Escape') {
      closeMenu();
      navToggle.focus();
    }
  }

  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!primaryNav.contains(e.target) && !navToggle.contains(e.target)) {
      closeMenu();
    }
  });

  // Close on link click
  const navLinks = primaryNav.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });
}

/* ==========================================================================
   4. Shop Directory (Search, Filter, Sort, URL params)
   ========================================================================== */
function initShopsDirectory() {
  const searchInput = document.getElementById('shop-search-input');
  const categoryFilter = document.getElementById('category-filter');
  const areaFilter = document.getElementById('area-filter');
  const sortSelect = document.getElementById('sort-select');
  const clearBtn = document.getElementById('clear-filters-btn');
  const emptyResetBtn = document.getElementById('reset-empty-btn');
  const grid = document.getElementById('shops-grid');
  const countEl = document.getElementById('result-count');
  const emptyState = document.getElementById('shops-empty-state');

  if (!grid || typeof SHOPS_DATA === 'undefined') return;

  // Read URL params (q and cat)
  const params = new URLSearchParams(window.location.search);
  const qParam = params.get('q');
  const catParam = params.get('cat');

  if (qParam && searchInput) {
    searchInput.value = qParam;
  }
  if (catParam && categoryFilter) {
    for (let opt of categoryFilter.options) {
      if (opt.value.toLowerCase() === catParam.toLowerCase()) {
        categoryFilter.value = opt.value;
        break;
      }
    }
  }

  function renderShops() {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const selectedCategory = categoryFilter ? categoryFilter.value : 'All';
    const selectedArea = areaFilter ? areaFilter.value : 'All';
    const selectedSort = sortSelect ? sortSelect.value : 'name';

    let filtered = SHOPS_DATA.filter(shop => {
      // Area match
      const areaMatch = selectedArea === 'All' || shop.area.toLowerCase() === selectedArea.toLowerCase();

      // Search match
      const textMatch = !query ||
        shop.name.toLowerCase().includes(query) ||
        shop.address.toLowerCase().includes(query) ||
        shop.area.toLowerCase().includes(query) ||
        shop.productsStocked.some(p => p.toLowerCase().includes(query));

      // Category match
      let catMatch = true;
      if (selectedCategory !== 'All' && typeof PRODUCTS_DATA !== 'undefined') {
        const productsInCat = PRODUCTS_DATA
          .filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase())
          .map(p => p.name.toLowerCase());
        catMatch = shop.productsStocked.some(sp => productsInCat.includes(sp.toLowerCase()));
      }

      return areaMatch && textMatch && catMatch;
    });

    // Sorting
    filtered.sort((a, b) => {
      if (selectedSort === 'name') return a.name.localeCompare(b.name);
      if (selectedSort === 'area') return a.area.localeCompare(b.area);
      if (selectedSort === 'verified') return b.verifiedDate.localeCompare(a.verifiedDate);
      return 0;
    });

    // Render count
    if (countEl) {
      countEl.textContent = `Showing ${filtered.length} of ${SHOPS_DATA.length} shops`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    const currentLang = document.documentElement.getAttribute('lang') || 'en';
    const callText = currentLang === 'te' ? 'కాల్ చేయండి' : 'Call Store';
    const dirText = currentLang === 'te' ? 'దారి చూడండి' : 'Directions';
    const verText = currentLang === 'te' ? 'ధృవీకరణ:' : 'Verified:';

    grid.innerHTML = filtered.map(shop => {
      const gmapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${shop.coords.lat},${shop.coords.lng}`;
      const productTags = shop.productsStocked.map(item => {
        let extraClass = '';
        if (item.includes('Cowpea')) extraClass = 'tag-cowpea';
        if (item.includes('Permethrin')) extraClass = 'tag-permethrin';
        return `<span class="product-tag ${extraClass}">${item}</span>`;
      }).join('');

      return `
        <article class="card shop-card">
          <div>
            <div class="shop-card-header">
              <h3 class="shop-title">${shop.name}</h3>
              <span class="shop-area-tag">${shop.area}</span>
            </div>
            <ul class="shop-info-list">
              <li><span aria-hidden="true">📍</span> <span>${shop.address}</span></li>
              <li><span aria-hidden="true">🕒</span> <span>${shop.hours}</span></li>
              <li><span aria-hidden="true">📞</span> <a href="tel:${shop.phone.replace(/\s+/g, '')}"><strong>${shop.phone}</strong></a></li>
              <li><span aria-hidden="true">📅</span> <span>${verText} ${shop.verifiedDate}</span></li>
            </ul>
            <div class="products-stocked-wrap">
              <div class="stocked-title">Products Available:</div>
              <div class="product-tags">${productTags}</div>
            </div>
          </div>
          <div class="shop-card-actions">
            <a href="tel:${shop.phone.replace(/\s+/g, '')}" class="btn btn-sm btn-primary">
              <span aria-hidden="true">📞</span> ${callText}
            </a>
            <a href="${gmapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline btn-ghost">
              <span aria-hidden="true">🗺️</span> ${dirText}
            </a>
          </div>
        </article>
      `;
    }).join('');
  }

  // Attach event listeners
  if (searchInput) searchInput.addEventListener('input', renderShops);
  if (categoryFilter) categoryFilter.addEventListener('change', renderShops);
  if (areaFilter) areaFilter.addEventListener('change', renderShops);
  if (sortSelect) sortSelect.addEventListener('change', renderShops);

  function resetAll() {
    if (searchInput) searchInput.value = '';
    if (categoryFilter) categoryFilter.value = 'All';
    if (areaFilter) areaFilter.value = 'All';
    if (sortSelect) sortSelect.value = 'name';
    renderShops();
  }

  if (clearBtn) clearBtn.addEventListener('click', resetAll);
  if (emptyResetBtn) emptyResetBtn.addEventListener('click', resetAll);

  // Initial render
  renderShops();
}

/* ==========================================================================
   5. Price Comparison
   ========================================================================== */
function initPriceComparison() {
  const productSelect = document.getElementById('product-select');
  const searchFilter = document.getElementById('product-search-filter');
  const tableBody = document.getElementById('price-table-body');
  const snapshotTitle = document.getElementById('snapshot-title');
  const snapshotCategory = document.getElementById('snapshot-category');
  const snapshotDesc = document.getElementById('snapshot-description');
  const bestPriceEl = document.getElementById('snapshot-best-price');

  if (!productSelect || typeof PRODUCTS_DATA === 'undefined' || typeof PRICES_DATA === 'undefined') return;

  // Check URL param for default product
  const params = new URLSearchParams(window.location.search);
  const initialProductName = params.get('product');

  function populateProductsDropdown(filterText = '') {
    productSelect.innerHTML = '';
    const filteredProducts = PRODUCTS_DATA.filter(p =>
      !filterText || p.name.toLowerCase().includes(filterText.toLowerCase()) || p.category.toLowerCase().includes(filterText.toLowerCase())
    );

    filteredProducts.forEach(prod => {
      const opt = document.createElement('option');
      opt.value = prod.id;
      opt.textContent = `${prod.name} (${prod.category})`;
      if (initialProductName && prod.name.toLowerCase() === initialProductName.toLowerCase()) {
        opt.selected = true;
      }
      productSelect.appendChild(opt);
    });

    if (productSelect.options.length > 0 && !productSelect.value) {
      productSelect.selectedIndex = 0;
    }
  }

  populateProductsDropdown();

  if (searchFilter) {
    searchFilter.addEventListener('input', (e) => {
      populateProductsDropdown(e.target.value.trim());
      renderComparisonTable();
    });
  }

  productSelect.addEventListener('change', renderComparisonTable);

  function renderComparisonTable() {
    const selectedProdId = productSelect.value;
    if (!selectedProdId) return;

    const product = PRODUCTS_DATA.find(p => p.id === selectedProdId);
    if (!product) return;

    if (snapshotTitle) snapshotTitle.textContent = product.name;
    if (snapshotCategory) snapshotCategory.textContent = product.category;
    if (snapshotDesc) snapshotDesc.textContent = product.description;

    // Filter prices for this product
    const relevantPrices = PRICES_DATA.filter(p => p.productId === selectedProdId);

    if (relevantPrices.length === 0) {
      if (bestPriceEl) bestPriceEl.textContent = 'N/A';
      if (tableBody) {
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No shop price quotes currently on record for this item.</td></tr>`;
      }
      return;
    }

    // Identify lowest price
    const minPrice = Math.min(...relevantPrices.map(p => p.price));
    if (bestPriceEl) {
      bestPriceEl.textContent = `₹${minPrice}`;
    }

    // Sort by price ascending
    relevantPrices.sort((a, b) => a.price - b.price);

    const currentLang = document.documentElement.getAttribute('lang') || 'en';
    const callText = currentLang === 'te' ? 'కాల్ చేయండి' : 'Call Store';

    if (tableBody) {
      tableBody.innerHTML = relevantPrices.map(item => {
        const shop = SHOPS_DATA.find(s => s.id === item.shopId) || {
          name: "Local Agro Store",
          area: "Mandal",
          address: "Visakhapatnam",
          phone: "90000 00001"
        };

        const isLowest = item.price === minPrice;
        const lowestTag = isLowest ? `<span class="lowest-pill">Lowest</span>` : '';

        return `
          <tr class="${isLowest ? 'row-lowest' : ''}">
            <td data-label="Shop Name">
              <strong>${shop.name}</strong>
              <div class="text-muted" style="font-size:0.85rem">${shop.area}</div>
            </td>
            <td data-label="Location Details">
              <span>${shop.address}</span>
            </td>
            <td data-label="Quoted Price">
              <strong style="font-size:1.15rem; color:var(--color-primary);">₹${item.price}</strong> ${lowestTag}
            </td>
            <td data-label="Package Unit">
              <span>${item.unit}</span>
            </td>
            <td data-label="Last Updated">
              <span class="text-muted">${item.lastUpdated}</span>
            </td>
            <td data-label="Action">
              <a href="tel:${shop.phone.replace(/\s+/g, '')}" class="btn btn-sm btn-primary">
                📞 ${callText}
              </a>
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  renderComparisonTable();
}

/* ==========================================================================
   6. Field Gallery & Lightbox
   ========================================================================== */
function initGallery() {
  const grid = document.getElementById('gallery-grid');
  const modal = document.getElementById('lightbox-modal');
  const backdrop = document.getElementById('lightbox-backdrop');
  const img = document.getElementById('lightbox-img');
  const caption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  if (!grid || typeof GALLERY_DATA === 'undefined') return;

  let currentIndex = 0;

  grid.innerHTML = GALLERY_DATA.map((item, index) => {
    return `
      <article class="card gallery-card" data-index="${index}" tabindex="0" role="button" aria-label="View photo: ${item.title}">
        <div class="gallery-thumb-wrap" style="background-color: ${item.fallbackColor}">
          <img src="${item.src}" alt="${item.title}" class="gallery-thumb" loading="lazy" width="400" height="300"
               onerror="this.style.opacity='0.25'; this.alt='Photograph archived in report';">
        </div>
        <div class="gallery-caption">
          <h3>${item.title}</h3>
          <span class="gallery-tag">${item.tag}</span>
        </div>
      </article>
    `;
  }).join('');

  function openLightbox(index) {
    currentIndex = index;
    const item = GALLERY_DATA[currentIndex];
    img.src = item.src;
    img.alt = item.title;
    caption.innerHTML = `<strong>${item.title}</strong><br><span style="font-size:0.9rem; font-weight:normal;">${item.caption}</span>`;
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
    document.addEventListener('keydown', handleLightboxKeydown);
  }

  function closeLightbox() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleLightboxKeydown);
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % GALLERY_DATA.length;
    openLightbox(currentIndex);
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + GALLERY_DATA.length) % GALLERY_DATA.length;
    openLightbox(currentIndex);
  }

  function handleLightboxKeydown(e) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  }

  grid.querySelectorAll('.gallery-card').forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.getAttribute('data-index'), 10);
      openLightbox(idx);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const idx = parseInt(card.getAttribute('data-index'), 10);
        openLightbox(idx);
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (backdrop) backdrop.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', showNext);
  if (prevBtn) prevBtn.addEventListener('click', showPrev);
}

/* ==========================================================================
   7. Feedback & Shop Entry (Validation, LocalStorage CRUD)
   ========================================================================== */
function initFeedbackForms() {
  const fbForm = document.getElementById('feedback-form');
  const shopForm = document.getElementById('shop-entry-form');
  const entriesList = document.getElementById('recent-entries-list');
  const clearAllBtn = document.getElementById('clear-all-storage');

  // Load existing entries
  renderRecentEntries();

  // Handle Feedback Form Submit
  if (fbForm) {
    fbForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const roleInput = document.getElementById('fb-role');
      const commentsInput = document.getElementById('fb-comments');
      const roleError = document.getElementById('fb-role-error');
      const commentsError = document.getElementById('fb-comments-error');

      // Clear past errors
      if (roleError) roleError.textContent = '';
      if (commentsError) commentsError.textContent = '';

      if (!roleInput.value) {
        if (roleError) roleError.textContent = 'Please select your primary role.';
        isValid = false;
      }

      if (!commentsInput.value.trim()) {
        if (commentsError) commentsError.textContent = 'Please share your feedback or observations.';
        isValid = false;
      }

      if (!isValid) return;

      const nameVal = document.getElementById('fb-name').value.trim() || 'Anonymous Contributor';
      const ratingVal = document.querySelector('input[name="fb-rating"]:checked')?.value || '5';
      const langVal = document.getElementById('fb-lang').value;

      const newFeedback = {
        id: 'fb-' + Date.now(),
        type: 'Community Feedback',
        title: `${nameVal} (${roleInput.value})`,
        meta: `Rating: ${ratingVal}★ • Language: ${langVal} • ${new Date().toLocaleDateString()}`,
        detail: commentsInput.value.trim()
      };

      saveEntryToLocalStorage(newFeedback);

      const successMsg = document.getElementById('fb-success-msg');
      if (successMsg) {
        successMsg.classList.remove('hidden');
        setTimeout(() => successMsg.classList.add('hidden'), 4000);
      }

      fbForm.reset();
      renderRecentEntries();
    });
  }

  // Handle Shop Inventory Entry Submit
  if (shopForm) {
    // Set default date to today
    const dateInput = document.getElementById('se-date');
    if (dateInput) {
      dateInput.value = new Date().toISOString().split('T')[0];
    }

    shopForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const nameInput = document.getElementById('se-shopname');
      const areaInput = document.getElementById('se-area');
      const phoneInput = document.getElementById('se-phone');
      const prodInput = document.getElementById('se-product');
      const priceInput = document.getElementById('se-price');
      const unitInput = document.getElementById('se-unit');
      const dateValInput = document.getElementById('se-date');

      // Clear errors
      ['se-shopname', 'se-area', 'se-phone', 'se-product', 'se-price', 'se-unit', 'se-date'].forEach(id => {
        const err = document.getElementById(`${id}-error`);
        if (err) err.textContent = '';
      });

      if (!nameInput.value.trim()) {
        document.getElementById('se-shopname-error').textContent = 'Shop name is required.';
        isValid = false;
      }
      if (!areaInput.value) {
        document.getElementById('se-area-error').textContent = 'Please select a mandal area.';
        isValid = false;
      }
      if (!phoneInput.value.trim() || phoneInput.value.replace(/\D/g, '').length < 10) {
        document.getElementById('se-phone-error').textContent = 'Enter a valid 10-digit phone number.';
        isValid = false;
      }
      if (!prodInput.value.trim()) {
        document.getElementById('se-product-error').textContent = 'Product name is required.';
        isValid = false;
      }
      if (!priceInput.value || Number(priceInput.value) <= 0) {
        document.getElementById('se-price-error').textContent = 'Valid price is required.';
        isValid = false;
      }
      if (!unitInput.value.trim()) {
        document.getElementById('se-unit-error').textContent = 'Packaging unit is required.';
        isValid = false;
      }
      if (!dateValInput.value) {
        document.getElementById('se-date-error').textContent = 'Verification date is required.';
        isValid = false;
      }

      if (!isValid) return;

      const newShopEntry = {
        id: 'shop-' + Date.now(),
        type: 'Shop Inventory Update',
        title: `${nameInput.value.trim()} (${areaInput.value})`,
        meta: `Product: ${prodInput.value.trim()} • ₹${priceInput.value} per ${unitInput.value.trim()} • Ph: ${phoneInput.value.trim()}`,
        detail: `Verified Date: ${dateValInput.value}`
      };

      saveEntryToLocalStorage(newShopEntry);

      const successMsg = document.getElementById('se-success-msg');
      if (successMsg) {
        successMsg.classList.remove('hidden');
        setTimeout(() => successMsg.classList.add('hidden'), 4000);
      }

      shopForm.reset();
      if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
      renderRecentEntries();
    });
  }

  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', () => {
      if (confirm('Clear all stored demonstration entries from your local browser?')) {
        setStorageItem('agrilocal_entries', []);
        renderRecentEntries();
      }
    });
  }

  function saveEntryToLocalStorage(entry) {
    const list = getStorageItem('agrilocal_entries') || [];
    list.unshift(entry);
    setStorageItem('agrilocal_entries', list.slice(0, 20)); // Keep up to 20
  }

  function renderRecentEntries() {
    if (!entriesList) return;
    const list = getStorageItem('agrilocal_entries') || [];

    if (list.length === 0) {
      entriesList.innerHTML = `<p class="text-muted text-center" style="padding: 1rem;">No custom feedback or shopkeeper entries staged yet in your browser.</p>`;
      return;
    }

    entriesList.innerHTML = list.map(item => {
      return `
        <div class="entry-item">
          <div class="entry-info">
            <h5>${item.title} <span class="badge ${item.type.includes('Shop') ? 'badge-warning' : 'badge-accent'}" style="font-size:0.75rem;">${item.type}</span></h5>
            <div class="entry-meta">${item.meta}</div>
            <div style="font-size:0.875rem; margin-top:0.25rem;">${item.detail}</div>
          </div>
          <button class="btn btn-sm btn-ghost text-danger delete-entry-btn" data-id="${item.id}" aria-label="Delete entry" title="Delete">
            🗑️
          </button>
        </div>
      `;
    }).join('');

    // Attach delete listeners
    entriesList.querySelectorAll('.delete-entry-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idToDelete = btn.getAttribute('data-id');
        let current = getStorageItem('agrilocal_entries') || [];
        current = current.filter(item => item.id !== idToDelete);
        setStorageItem('agrilocal_entries', current);
        renderRecentEntries();
      });
    });
  }
}

/* ==========================================================================
   8. Scroll To Top Utility
   ========================================================================= */
function initScrollToTop() {
  const scrollBtn = document.getElementById('scroll-to-top');
  if (!scrollBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollBtn.classList.add('is-visible');
    } else {
      scrollBtn.classList.remove('is-visible');
    }
  });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   9. Safe LocalStorage Wrappers (try/catch protected)
   ========================================================================== */
function getStorageItem(key) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : null;
  } catch (err) {
    return null;
  }
}

function setStorageItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    // Fail silently in private browsing or quota limits
  }
}

/* ==========================================================================
   10. Service Worker Safe Registration (Offline Support)
   ========================================================================== */
function registerServiceWorker() {
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js')
        .catch(() => {
          // Fail silently without disrupting user experience
        });
    });
  }
}
