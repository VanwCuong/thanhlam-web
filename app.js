/* ==========================================================================
   THANH LÂM - MAN CLOTHING | ENGINE & SCROLL OBSERVER
   ========================================================================== */

const SHEET_URL = "https://script.google.com/macros/s/AKfycbylvq4KzZnbFx3Hg6_Cyz1BM8xf0w06fQNxs4D8HTuHq6_Grmv-eY3lbKmy9HqKdYfJ/exec";

const supportsScrollReveal = 'IntersectionObserver' in window;

const PRODUCTS = [
  {
    id: 'tl-01',
    name: 'Áo Sơ Mi Linen Form Slim',
    category: 'so-mi',
    categoryName: 'Áo Sơ Mi',
    price: 495000,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    colors: ['Khaki', 'Trắng Kem', 'Đen Cacao'],
    sizes: ['S', 'M', 'L', 'XL'],
    desc: 'Chất liệu Linen tự nhiên thoáng mát, form dáng Slim fit tôn nét lịch lãm hiện đại.'
  },
  {
    id: 'tl-02',
    name: 'Áo Polo Pique Cotton Cacao',
    category: 'polo',
    categoryName: 'Áo Polo',
    price: 385000,
    image: 'https://images.unsplash.com/photo-1627225924765-552d49cf47ad?auto=format&fit=crop&w=800&q=80',
    colors: ['Cacao Lux', 'Đen Obsidian', 'Xám'],
    sizes: ['M', 'L', 'XL'],
    desc: 'Sợi Cotton Pique cá sấu co giãn 4 chiều, giữ dáng cổ áo sắc nét cả ngày.'
  },
  {
    id: 'tl-03',
    name: 'Quần Tây Tailored Trouser',
    category: 'quan',
    categoryName: 'Quần Tây',
    price: 550000,
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
    colors: ['Đen', 'Xám Đậm'],
    sizes: ['S', 'M', 'L', 'XL'],
    desc: 'Cắt may chuẩn Minimalist, chất liệu Wool blend đứng form không nhăn.'
  },
  {
    id: 'tl-04',
    name: 'Áo Khoác Blazer Unstructured',
    category: 'ao-khoac',
    categoryName: 'Áo Khoác',
    price: 890000,
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    colors: ['Đen Cacao', 'Xám Bê Tông'],
    sizes: ['M', 'L', 'XL'],
    desc: 'Thiết kế Blazer không đệm vai trẻ trung, dễ phối theo phong cách Streetwear Smart.'
  },
  {
    id: 'tl-05',
    name: 'Ví Da Bò Minimalist Cardholder',
    category: 'phu-kien',
    categoryName: 'Phụ Kiện',
    price: 290000,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
    colors: ['Nâu Cacao', 'Đen Minimal'],
    sizes: ['One Size'],
    desc: 'Da bò nguyên tấm cắt gọn tinh tế, đựng vừa vặn các dòng thẻ và tiền mặt.'
  }
];

let cart = JSON.parse(localStorage.getItem('THANH_LAM_CART')) || [];
let selectedMix = {
  top: PRODUCTS[0],
  bottom: PRODUCTS[2],
  accessory: PRODUCTS[4]
};
let scrollObserver = null;

function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMessage');
  toastMsg.innerText = message;
  toast.classList.add('active');
  setTimeout(() => toast.classList.remove('active'), 3000);
}

function formatVND(amount) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// Hàm khởi tạo hiệu ứng cuộn 2 chiều (Intersection Observer)
function initScrollAnimations() {
  const revealSections = document.querySelectorAll('#app-view > section');
  revealSections.forEach(section => section.classList.add('scroll-reveal'));

  if (!supportsScrollReveal) {
    revealSections.forEach(section => section.classList.add('is-visible'));
    return;
  }

  const viewportBottom = window.innerHeight - 50;
  const initialVisibility = Array.from(revealSections, section => {
    const rect = section.getBoundingClientRect();
    const visibleHeight = Math.max(0, Math.min(rect.bottom, viewportBottom) - Math.max(rect.top, 0));
    return visibleHeight > 0;
  });

  document.documentElement.classList.add('has-scroll-reveal', 'is-initializing-scroll-reveal');
  revealSections.forEach((section, index) => {
    section.classList.add('reveal-ready');
    section.classList.toggle('is-visible', initialVisibility[index]);
  });
  void document.documentElement.offsetHeight;
  document.documentElement.classList.remove('is-initializing-scroll-reveal');

  if (!scrollObserver) {
    scrollObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        } else if (window.scrollY < entry.boundingClientRect.top + window.scrollY) {
          entry.target.classList.remove('is-visible');
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.15
    });
  }

  scrollObserver.disconnect();
  revealSections.forEach(section => scrollObserver.observe(section));
}

function closeMobileNav() {
  const toggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('primary-navigation');
  const icon = toggle.querySelector('i');

  navLinks.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Mở menu');
  icon.classList.remove('fa-xmark');
  icon.classList.add('fa-bars');
}

function handleRouting() {
  const hash = window.location.hash || '#/';
  const appView = document.getElementById('app-view');
  closeMobileNav();
  
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === hash);
  });

  if (hash === '#/' || hash === '') {
    appView.innerHTML = renderHomeView();
  } else if (hash === '#/san-pham') {
    appView.innerHTML = renderCatalogView();
  } else if (hash === '#/mix-match') {
    appView.innerHTML = renderMixMatchView();
  } else if (hash === '#/ve-thanh-lam') {
    appView.innerHTML = renderAboutView();
  } else if (hash === '#/lien-he') {
    appView.innerHTML = renderContactView();
  } else {
    appView.innerHTML = `<div style="padding: 100px; text-align:center;"><h2>404 - KHÔNG TÌM THẤY TRANG</h2></div>`;
  }
  
  window.scrollTo(0, 0);
  initScrollAnimations();
}

window.addEventListener('hashchange', handleRouting);
window.addEventListener('DOMContentLoaded', () => {
  handleRouting();
  updateCartUI();
  initGlobalEvents();
});

function renderHomeView() {
  return `
    <section class="hero-section scroll-reveal">
      <div class="hero-text">
        <h1 class="hero-title-outline">THANH LÂM</h1>
        <h1 class="hero-title-solid">MAN CLOTHING</h1>
        <p class="hero-subtitle">Phong cách thời trang nam tối giản, hiện đại và lịch lãm. Tự tin khẳng định khí chất trong từng chi tiết.</p>
        <div class="hero-actions">
          <a href="#/san-pham" class="btn btn-primary">KHÁM PHÁ BST MỚI</a>
          <a href="#/mix-match" class="btn btn-outline"><i class="fa-solid fa-wand-magic-sparkles"></i> PHỐI ĐỒ STUDIO</a>
        </div>
      </div>
      <div class="hero-gallery">
        <div class="polaroid-card card-1">
          <img src="${PRODUCTS[0].image}" alt="Lookbook 1">
          <div class="polaroid-caption">Linen Modern Fit</div>
        </div>
        <div class="polaroid-card card-2">
          <img src="${PRODUCTS[3].image}" alt="Lookbook 2">
          <div class="polaroid-caption">Minimalist Blazer</div>
        </div>
      </div>
    </section>
    ${renderCatalogView()}
    ${renderMixMatchView()}
    ${renderCustomerFeedbackView()}
  `;
}

function renderCustomerFeedbackView() {
  const feedbackItems = [
    {
      initials: 'MA',
      name: 'Minh Anh',
      product: 'Áo sơ mi Linen',
      rating: 5,
      quote: 'Chất vải nhẹ, mặc thoáng và form gọn gàng. Dễ phối đồ cho cả ngày đi làm lẫn những buổi gặp gỡ.'
    },
    {
      initials: 'TD',
      name: 'Tuấn Đạt',
      product: 'Áo Polo Pique',
      rating: 5,
      quote: 'Áo lên dáng chỉn chu mà vẫn thoải mái khi vận động. Tông màu tối giản nên phối với quần nào cũng hợp.'
    },
    {
      initials: 'NA',
      name: 'Nam Anh',
      product: 'Quần Tây Tailored',
      rating: 5,
      quote: 'Form quần đứng, đường may tinh tế. Kết hợp cùng sơ mi là có ngay một set đồ lịch sự, hiện đại.'
    }
  ];

  return `
    <section class="customer-feedback-section scroll-reveal" aria-labelledby="customer-feedback-title">
      <div class="feedback-section-header">
        <div class="feedback-section-copy">
          <span class="feedback-eyebrow">CHIA SẺ TRẢI NGHIỆM</span>
          <h2 class="section-title" id="customer-feedback-title">KHÁCH HÀNG NÓI GÌ?</h2>
          <p class="feedback-intro">Một góc nhỏ để giới thiệu trải nghiệm với những thiết kế Thanh Lâm.</p>
        </div>
        <span class="feedback-demo-label">
          <i class="fa-solid fa-circle-info" aria-hidden="true"></i>
          NỘI DUNG DEMO
        </span>
      </div>

      <div class="feedback-grid">
        ${feedbackItems.map(feedback => `
          <article class="feedback-card">
            <div class="feedback-card-header">
              <span class="feedback-avatar" aria-hidden="true">${feedback.initials}</span>
              <div class="feedback-customer">
                <h3 class="feedback-customer-name">${feedback.name}</h3>
                <span class="feedback-customer-label">Khách hàng mẫu</span>
              </div>
              <span class="feedback-quote-mark" aria-hidden="true">“</span>
            </div>
            <div class="feedback-stars" role="img" aria-label="Đánh giá mẫu ${feedback.rating} trên 5 sao">
              <span aria-hidden="true">${'<i class="fa-solid fa-star"></i>'.repeat(feedback.rating)}</span>
            </div>
            <blockquote class="feedback-quote">${feedback.quote}</blockquote>
            <div class="feedback-product">
              <i class="fa-solid fa-bag-shopping" aria-hidden="true"></i>
              <span>${feedback.product}</span>
            </div>
          </article>
        `).join('')}
      </div>

      <p class="feedback-disclaimer">Tên, nhận xét và điểm số trên chỉ là nội dung minh họa cho bản demo, chưa phải đánh giá khách hàng đã xác thực.</p>
    </section>
  `;
}

function renderCatalogView() {
  return `
    <section class="catalog-section scroll-reveal">
      <div class="section-header">
        <h2 class="section-title">BỘ SƯU TẬP SẢN PHẨM</h2>
        <div class="category-filters">
          <button class="filter-btn active" onclick="filterCategory('all', this)">Tất Cả</button>
          <button class="filter-btn" onclick="filterCategory('so-mi', this)">Áo Sơ Mi</button>
          <button class="filter-btn" onclick="filterCategory('polo', this)">Áo Polo</button>
          <button class="filter-btn" onclick="filterCategory('quan', this)">Quần Tây/Chino</button>
          <button class="filter-btn" onclick="filterCategory('ao-khoac', this)">Áo Khoác</button>
          <button class="filter-btn" onclick="filterCategory('phu-kien', this)">Phụ Kiện</button>
        </div>
      </div>

      <div class="product-grid" id="productGrid">
        ${renderProductCards(PRODUCTS)}
      </div>
    </section>
  `;
}

function renderProductCards(items) {
  return items.map(prod => `
    <div class="product-card">
      <div class="product-thumb">
        <img src="${prod.image}" alt="${prod.name}">
        <div class="product-actions">
          <button class="btn btn-primary btn-block product-quickview-btn" onclick="openQuickView('${prod.id}')">
            <i class="fa-solid fa-eye"></i> XEM NHANH
          </button>
        </div>
      </div>
      <div class="product-info">
        <span class="product-cat">${prod.categoryName}</span>
        <h3 class="product-title">${prod.name}</h3>
        <div class="product-price">${formatVND(prod.price)}</div>
      </div>
    </div>
  `).join('');
}

function renderMixMatchView() {
  const tops = PRODUCTS.filter(p => p.category === 'so-mi' || p.category === 'polo');
  const bottoms = PRODUCTS.filter(p => p.category === 'quan');
  const accessories = PRODUCTS.filter(p => p.category === 'phu-kien' || p.category === 'ao-khoac');

  return `
    <section class="mix-match-section scroll-reveal">
      <div class="section-header">
        <h2 class="section-title"><i class="fa-solid fa-wand-magic-sparkles"></i> MIX & MATCH STUDIO</h2>
        <p>Thử phối trang phục trực tiếp để tạo bộ outfit nam tính chuẩn GU trước khi chốt đơn.</p>
      </div>

      <div class="studio-grid">
        <div class="studio-selectors">
          <div class="selector-group" data-mix-type="top">
            <label>1. Chọn Áo Top</label>
            <div class="selector-options">
              ${tops.map(p => `
                <button type="button" class="option-item ${selectedMix.top.id === p.id ? 'selected' : ''}" data-product-id="${p.id}" aria-pressed="${selectedMix.top.id === p.id}">
                  <img src="${p.image}" alt="">
                  <span>${p.name}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <div class="selector-group" data-mix-type="bottom">
            <label>2. Chọn Quần Bottom</label>
            <div class="selector-options">
              ${bottoms.map(p => `
                <button type="button" class="option-item ${selectedMix.bottom.id === p.id ? 'selected' : ''}" data-product-id="${p.id}" aria-pressed="${selectedMix.bottom.id === p.id}">
                  <img src="${p.image}" alt="">
                  <span>${p.name}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <div class="selector-group" data-mix-type="accessory">
            <label>3. Khoác / Phụ Kiện</label>
            <div class="selector-options">
              ${accessories.map(p => `
                <button type="button" class="option-item ${selectedMix.accessory.id === p.id ? 'selected' : ''}" data-product-id="${p.id}" aria-pressed="${selectedMix.accessory.id === p.id}">
                  <img src="${p.image}" alt="">
                  <span>${p.name}</span>
                </button>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="studio-preview">
          <div class="outfit-display">
            <div class="outfit-slot" data-mix-slot="top"><img src="${selectedMix.top.image}" alt="${selectedMix.top.name}"></div>
            <div class="outfit-slot" data-mix-slot="bottom"><img src="${selectedMix.bottom.image}" alt="${selectedMix.bottom.name}"></div>
            <div class="outfit-slot" data-mix-slot="accessory"><img src="${selectedMix.accessory.image}" alt="${selectedMix.accessory.name}"></div>
          </div>
          <div class="outfit-summary">
            <h4>TỔNG CỘNG OUTFIT</h4>
            <p class="outfit-total" aria-live="polite" style="font-size:1.3rem; font-weight:800; color:var(--accent-color); margin: 8px 0;">
              ${formatVND(selectedMix.top.price + selectedMix.bottom.price + selectedMix.accessory.price)}
            </p>
            <button type="button" class="btn btn-accent btn-block" data-mix-add-to-cart>THÊM TRỌN BỘ VÀO GIỎ</button>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderAboutView() {
  return `
    <section class="content-page about-page scroll-reveal">
      <h2 class="content-page-title">CÂU CHUYỆN THANH LÂM MAN</h2>
      <p class="content-page-copy">
        Được thành lập với sứ mệnh định hình phong cách ăn mặc nam tính hiện đại, <strong>THANH LÂM - MAN CLOTHING</strong> theo đuổi triết lý <em>Minimalist & Contemporary Streetwear</em>.
      </p>
    </section>
  `;
}

function renderContactView() {
  return `
    <section class="content-page contact-page scroll-reveal">
      <h2 class="content-page-title">LIÊN HỆ VỚI CHÚNG TÔI</h2>
      <div class="contact-actions">
        <a href="https://zalo.me" target="_blank" class="btn btn-primary"><i class="fa-solid fa-comment-dots"></i> CHAT ZALO CSKH</a>
        <a href="https://facebook.com" target="_blank" class="btn btn-outline"><i class="fa-brands fa-facebook"></i> FACEBOOK FANPAGE</a>
      </div>
    </section>
  `;
}

function filterCategory(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const grid = document.getElementById('productGrid');
  if (cat === 'all') {
    grid.innerHTML = renderProductCards(PRODUCTS);
  } else {
    const filtered = PRODUCTS.filter(p => p.category === cat);
    grid.innerHTML = renderProductCards(filtered);
  }
}

function openQuickView(id) {
  const prod = PRODUCTS.find(p => p.id === id);
  if (!prod) return;

  const modal = document.getElementById('quickViewModal');
  const body = document.getElementById('quickViewBody');

  body.innerHTML = `
    <div><img class="quickview-image" src="${prod.image}" alt="${prod.name}"></div>
    <div>
      <span class="product-cat">${prod.categoryName}</span>
      <h2 class="quickview-title">${prod.name}</h2>
      <div class="product-price quickview-price">${formatVND(prod.price)}</div>
      <p class="quickview-description">${prod.desc}</p>
      <div class="form-group"><label>Chọn Size</label><select id="qvSize">${prod.sizes.map(s => `<option value="${s}">${s}</option>`).join('')}</select></div>
      <div class="form-group"><label>Chọn Màu</label><select id="qvColor">${prod.colors.map(c => `<option value="${c}">${c}</option>`).join('')}</select></div>
      <button class="btn btn-accent btn-block quickview-add-to-cart" onclick="addToCartFromQuickView('${prod.id}')">THÊM VÀO GIỎ HÀNG</button>
    </div>
  `;
  modal.classList.add('active');
}

function addToCartFromQuickView(id) {
  const prod = PRODUCTS.find(p => p.id === id);
  cart.push({ ...prod, selectedSize: document.getElementById('qvSize').value, selectedColor: document.getElementById('qvColor').value, cartId: Date.now() });
  saveCart();
  document.getElementById('quickViewModal').classList.remove('active');
  showToast(`Đã thêm ${prod.name} vào giỏ hàng!`);
  triggerCartBump();
}

function triggerCartBump() {
  const countEl = document.getElementById('cartCount');
  countEl.classList.add('bump');
  setTimeout(() => countEl.classList.remove('bump'), 300);
}

function selectMixItem(type, id) {
  if (!Object.prototype.hasOwnProperty.call(selectedMix, type)) return;

  const prod = PRODUCTS.find(p => p.id === id);
  const section = document.querySelector('.mix-match-section');
  const group = section?.querySelector(`.selector-group[data-mix-type="${type}"]`);
  if (!prod || !section || !group) return;

  selectedMix[type] = prod;
  group.querySelectorAll('.option-item').forEach(option => {
    const isSelected = option.dataset.productId === prod.id;
    option.classList.toggle('selected', isSelected);
    option.setAttribute('aria-pressed', String(isSelected));
  });

  const previewImage = section.querySelector(`.outfit-slot[data-mix-slot="${type}"] img`);
  previewImage.src = prod.image;
  previewImage.alt = prod.name;

  const total = Object.values(selectedMix).reduce((sum, item) => sum + item.price, 0);
  section.querySelector('.outfit-total').textContent = formatVND(total);
}

function addMixToCart() {
  ['top', 'bottom', 'accessory'].forEach(key => {
    const item = selectedMix[key];
    cart.push({ ...item, selectedSize: item.sizes[0], selectedColor: item.colors[0], cartId: Date.now() + Math.random() });
  });
  saveCart();
  showToast('Đã thêm trọn bộ Outfit vào giỏ hàng!');
  openCartDrawer();
}

function saveCart() {
  localStorage.setItem('THANH_LAM_CART', JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI() {
  const count = cart.length;
  document.getElementById('cartCount').innerText = count;
  document.getElementById('cartDrawerCount').innerText = count;
  const list = document.getElementById('cartItemsList');
  if (count === 0) {
    list.innerHTML = `<p style="text-align:center; color:var(--text-muted); margin-top:40px;">Giỏ hàng của bạn đang trống</p>`;
    document.getElementById('cartTotalPrice').innerText = '0đ';
    return;
  }
  let total = 0;
  list.innerHTML = cart.map(item => {
    total += item.price;
    return `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-details">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-meta">Size: ${item.selectedSize} | Màu: ${item.selectedColor}</div>
          <div class="cart-item-price">${formatVND(item.price)}</div>
        </div>
        <button onclick="removeFromCart(${item.cartId})" style="background:none; border:none; color:#888; cursor:pointer;"><i class="fa-solid fa-xmark"></i></button>
      </div>
    `;
  }).join('');
  document.getElementById('cartTotalPrice').innerText = formatVND(total);
}

function removeFromCart(cartId) {
  cart = cart.filter(item => item.cartId !== cartId);
  saveCart();
}

function openCartDrawer() {
  document.getElementById('cartOverlay').classList.add('active');
  document.getElementById('cartDrawer').classList.add('active');
}

function closeCartDrawer() {
  document.getElementById('cartOverlay').classList.remove('active');
  document.getElementById('cartDrawer').classList.remove('active');
}

function initGlobalEvents() {
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('primary-navigation');
  const navbar = document.getElementById('navbar');
  const appView = document.getElementById('app-view');

  appView.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return;

    const option = event.target.closest('.option-item[data-product-id]');
    if (option && appView.contains(option)) {
      const group = option.closest('.selector-group[data-mix-type]');
      if (group) selectMixItem(group.dataset.mixType, option.dataset.productId);
      return;
    }

    const addButton = event.target.closest('[data-mix-add-to-cart]');
    if (addButton && appView.contains(addButton)) addMixToCart();
  });

  mobileToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    const icon = mobileToggle.querySelector('i');

    mobileToggle.setAttribute('aria-expanded', String(isOpen));
    mobileToggle.setAttribute('aria-label', isOpen ? 'Đóng menu' : 'Mở menu');
    icon.classList.toggle('fa-bars', !isOpen);
    icon.classList.toggle('fa-xmark', isOpen);
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  document.addEventListener('click', event => {
    if (navLinks.classList.contains('is-open') && !navbar.contains(event.target)) {
      closeMobileNav();
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMobileNav();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1100) closeMobileNav();
  });

  document.getElementById('openCartBtn').addEventListener('click', openCartDrawer);
  document.getElementById('closeCartBtn').addEventListener('click', closeCartDrawer);
  document.getElementById('cartOverlay').addEventListener('click', closeCartDrawer);
  document.getElementById('closeQuickView').addEventListener('click', () => document.getElementById('quickViewModal').classList.remove('active'));
  document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (cart.length === 0) { alert('Giỏ hàng trống!'); return; }
    closeCartDrawer();
    openCheckoutModal();
  });
  document.getElementById('closeCheckout').addEventListener('click', () => document.getElementById('checkoutModal').classList.remove('active'));
  document.getElementById('orderForm').addEventListener('submit', handleOrderSubmit);
}

function openCheckoutModal() {
  const modal = document.getElementById('checkoutModal');
  const summaryBox = document.getElementById('checkoutSummaryItems');
  let total = 0;
  summaryBox.innerHTML = cart.map(item => {
    total += item.price;
    return `<div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:8px;"><span>${item.name} (${item.selectedSize}/${item.selectedColor})</span><strong>${formatVND(item.price)}</strong></div>`;
  }).join('');
  document.getElementById('checkoutTotalPrice').innerText = formatVND(total);
  modal.classList.add('active');
}

async function handleOrderSubmit(e) {
  e.preventDefault();
  const submitBtn = document.getElementById('submitOrderBtn');
  submitBtn.classList.add('loading');
  const orderData = {
    customerName: document.getElementById('customerName').value,
    customerPhone: document.getElementById('customerPhone').value,
    customerAddress: document.getElementById('customerAddress').value,
    customerHeight: document.getElementById('customerHeight').value,
    customerWeight: document.getElementById('customerWeight').value,
    orderNote: document.getElementById('orderNote').value,
    cartItems: cart.map(i => `${i.name} (${i.selectedSize}/${i.selectedColor})`).join('; '),
    totalPrice: document.getElementById('checkoutTotalPrice').innerText,
    orderDate: new Date().toLocaleString('vi-VN')
  };
  try {
    if (SHEET_URL !== "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE") {
      await fetch(SHEET_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(orderData) });
    }
    showToast('Đặt hàng thành công! Cảm ơn bạn.');
    cart = [];
    saveCart();
    document.getElementById('checkoutModal').classList.remove('active');
    document.getElementById('orderForm').reset();
  } catch (error) {
    alert('Có lỗi xảy ra, vui lòng thử lại!');
  } finally {
    submitBtn.classList.remove('loading');
  }
}
