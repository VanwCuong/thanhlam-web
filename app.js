/* ==========================================================================
   THANH LÂM - MAN CLOTHING | ENGINE & SCROLL OBSERVER
   ========================================================================== */

// Set this to the deployed Google Apps Script Web App URL ending in /exec.
const SHEET_URL = "https://script.google.com/macros/s/AKfycbyNuoBYZooduQKXJSsx0FvFWXmPeuNnNN3aCDmVchXLIFE6y0jQ9thYd2hCHjrxjjIm/exec";
const ZALO_CHAT_URL = 'https://zalo.me/0349595949';

const supportsScrollReveal = 'IntersectionObserver' in window;
const POLO_IMAGES = [
  'products/11ffcec7-9c04-4ce5-ac12-5e109484cd40.jpg',
  'products/34775178-7c90-4634-bc3e-8b7cb9497d7d.jpg',
  'products/5cdd26a8-b4f0-48cd-9e21-2aa136c8d0bf.jpg',
  'products/6417f8d8-b93a-4d10-bc97-111d0a63caaf.jpg',
  'products/bc2c1c8b-4237-4486-a667-ec1001320667.jpg',
  'products/c8e2c0a4-3115-4301-8037-14e88010a5fd.jpg'
];

const PRODUCTS = [
  {
    id: 'tl-02',
    name: 'Áo Polo',
    category: 'polo',
    categoryName: 'Áo Polo',
    price: 385000,
    image: POLO_IMAGES[0],
    colors: ['Đen'],
    sizes: ['M', 'L', 'XL'],
    desc: ''
  },
  ...POLO_IMAGES.slice(1).map((image, index) => ({
    id: `tl-${String(index + 6).padStart(2, '0')}`,
    name: 'Áo Polo',
    category: 'polo',
    categoryName: 'Áo Polo',
    price: 385000,
    image,
    colors: [index === 0 || index === 2 ? 'Trắng' : 'Đen'],
    sizes: ['M', 'L', 'XL'],
    desc: ''
  })),
  {
    id: 'tl-06',
    name: 'Áo Khoác',
    category: 'ao-khoac',
    categoryName: 'Áo Khoác',
    price: 890000,
    image: 'products/111d7800-4174-49e2-953b-49a1e00c29ff.jpg',
    colors: ['Xám'],
    sizes: ['M', 'L', 'XL'],
    desc: ''
  },
  {
    id: 'tl-07',
    name: 'Áo Khoác',
    category: 'ao-khoac',
    categoryName: 'Áo Khoác',
    price: 890000,
    image: 'products/59911f06-5e59-4b3b-89bb-457228dc73fc.jpg',
    colors: ['Đen'],
    sizes: ['M', 'L', 'XL'],
    desc: ''
  }
];

let cart = JSON.parse(localStorage.getItem('THANH_LAM_CART')) || [];
let selectedMix = {
  top: PRODUCTS.find(product => product.category === 'polo'),
  jacket: PRODUCTS.find(product => product.category === 'ao-khoac')
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

function isGoogleAppsScriptWebAppUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' &&
      url.hostname === 'script.google.com' &&
      /^\/macros\/s\/[^/]+\/exec$/.test(url.pathname);
  } catch {
    return false;
  }
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
  const featuredPolo = PRODUCTS.find(product => product.category === 'polo');
  const featuredJacket = PRODUCTS.find(product => product.category === 'ao-khoac');

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
          <img src="${featuredPolo.image}" alt="Áo Polo">
        </div>
        <div class="polaroid-card card-2">
          <img src="${featuredJacket.image}" alt="Áo Khoác">
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
      category: 'Áo Polo',
      quote: 'Áo mặc thoải mái, hình thức đẹp và dễ phối đồ hằng ngày.'
    },
    {
      category: 'Áo Khoác',
      quote: 'Áo len lên dáng đẹp, chất vải mềm và giữ ấm tốt.'
    },
    {
      category: 'Dịch vụ',
      quote: 'Được tư vấn nhiệt tình, đặt hàng nhanh và thuận tiện.'
    }
  ];

  return `
    <section class="customer-feedback-section scroll-reveal" aria-labelledby="customer-feedback-title">
      <div class="feedback-heading">
        <span class="feedback-eyebrow">CHIA SẺ TRẢI NGHIỆM</span>
        <h2 class="section-title" id="customer-feedback-title">FEEDBACK KHÁCH HÀNG</h2>
        <p>Cảm nhận tham khảo về sản phẩm và dịch vụ của Thanh Lâm.</p>
      </div>

      <div class="feedback-grid">
        ${feedbackItems.map(feedback => `
          <article class="feedback-card">
            <div class="feedback-stars" role="img" aria-label="5 sao">
              ${'<i class="fa-solid fa-star" aria-hidden="true"></i>'.repeat(5)}
            </div>
            <blockquote class="feedback-quote">${feedback.quote}</blockquote>
            <span class="feedback-category">${feedback.category}</span>
          </article>
        `).join('')}
      </div>

      <div class="feedback-invitation">
        <div class="feedback-copy">
          <h3>Còn bạn thì sao?</h3>
          <p>Có hài lòng với dịch vụ không? Cho chúng tôi biết thêm nhé!</p>
        </div>
        <div class="feedback-actions">
          <a class="btn btn-primary" href="https://zalo.me/0349595949" target="_blank" rel="noopener noreferrer">
            <i class="fa-solid fa-comment-dots"></i> GỬI FEEDBACK QUA ZALO
          </a>
          <a class="btn btn-outline" href="https://www.facebook.com/share/1Gv2RrQ35y/" target="_blank" rel="noopener noreferrer">
            <i class="fa-brands fa-facebook"></i> FACEBOOK
          </a>
        </div>
      </div>
    </section>
  `;
}

function renderCatalogView() {
  const poloItems = PRODUCTS.filter(product => product.category === 'polo');
  const jacketItems = PRODUCTS.filter(product => product.category === 'ao-khoac');

  return `
    <section class="catalog-section scroll-reveal">
      <div class="section-header">
        <h2 class="section-title">BỘ SƯU TẬP SẢN PHẨM</h2>
      </div>

      <section class="product-category-section" aria-labelledby="polo-category-title">
        <h3 class="product-category-title" id="polo-category-title">Áo Polo</h3>
        <div class="product-grid">${renderProductCards(poloItems)}</div>
      </section>

      <section class="product-category-section" aria-labelledby="jacket-category-title">
        <h3 class="product-category-title" id="jacket-category-title">Áo Khoác</h3>
        <div class="product-grid">${renderProductCards(jacketItems)}</div>
      </section>
    </section>
  `;
}

function renderProductCards(items) {
  return items.map(prod => `
    <div class="product-card">
      <div class="product-thumb">
        <img src="${prod.image}" alt="${prod.categoryName}">
        <div class="product-actions">
          <button class="btn btn-primary btn-block product-quickview-btn" onclick="openQuickView('${prod.id}')">
            <i class="fa-solid fa-eye"></i> XEM NHANH
          </button>
        </div>
      </div>
      <div class="product-info">
        <span class="product-cat">${prod.categoryName}</span>
      </div>
    </div>
  `).join('');
}

function renderMixMatchView() {
  const tops = PRODUCTS.filter(p => p.category === 'polo');
  const jackets = PRODUCTS.filter(p => p.category === 'ao-khoac');

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
                  <span>${p.categoryName}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <div class="selector-group" data-mix-type="jacket">
            <label>2. Chọn Áo Khoác</label>
            <div class="selector-options">
              ${jackets.map(p => `
                <button type="button" class="option-item ${selectedMix.jacket.id === p.id ? 'selected' : ''}" data-product-id="${p.id}" aria-pressed="${selectedMix.jacket.id === p.id}">
                  <img src="${p.image}" alt="">
                  <span>${p.categoryName}</span>
                </button>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="studio-preview">
          <div class="outfit-display">
            <div class="outfit-slot" data-mix-slot="top"><img src="${selectedMix.top.image}" alt="${selectedMix.top.categoryName}"></div>
            <div class="outfit-slot" data-mix-slot="jacket"><img src="${selectedMix.jacket.image}" alt="${selectedMix.jacket.categoryName}"></div>
          </div>
          <div class="outfit-summary">
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
        <a href="tel:+84349595949" class="btn btn-primary"><i class="fa-solid fa-phone"></i> 0349 595 949</a>
        <a href="https://zalo.me/0349595949" target="_blank" rel="noopener noreferrer" class="btn btn-outline"><i class="fa-solid fa-comment-dots"></i> ZALO</a>
        <a href="https://www.facebook.com/share/1Gv2RrQ35y/" target="_blank" rel="noopener noreferrer" class="btn btn-outline"><i class="fa-brands fa-facebook"></i> FACEBOOK</a>
        <a href="https://www.tiktok.com/@taolathanhlam199" target="_blank" rel="noopener noreferrer" class="btn btn-outline"><i class="fa-brands fa-tiktok"></i> TIKTOK</a>
      </div>
    </section>
  `;
}

function openQuickView(id) {
  const prod = PRODUCTS.find(p => p.id === id);
  if (!prod) return;

  const modal = document.getElementById('quickViewModal');
  const body = document.getElementById('quickViewBody');

  body.innerHTML = `
    <div><img class="quickview-image" src="${prod.image}" alt="${prod.categoryName}"></div>
    <div>
      <span class="product-cat">${prod.categoryName}</span>
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
  showToast(`Đã thêm ${prod.categoryName} vào giỏ hàng!`);
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
  previewImage.alt = prod.categoryName;

}

function addMixToCart() {
  ['top', 'jacket'].forEach(key => {
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
        <img src="${item.image}" alt="${item.categoryName}">
        <div class="cart-item-details">
          <div class="cart-item-title">${item.categoryName}</div>
          <div class="cart-item-meta">Size: ${item.selectedSize} | Màu: ${item.selectedColor}</div>
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
    return `<div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:8px;"><span>${item.categoryName} (${item.selectedSize}/${item.selectedColor})</span></div>`;
  }).join('');
  document.getElementById('checkoutTotalPrice').innerText = formatVND(total);
  modal.classList.add('active');
}

async function handleOrderSubmit(e) {
  e.preventDefault();
  const submitBtn = document.getElementById('submitOrderBtn');
  if (submitBtn.disabled) return;

  if (!isGoogleAppsScriptWebAppUrl(SHEET_URL)) {
    alert('Google Sheets chưa được kết nối. Hãy cấu hình URL Web App Apps Script kết thúc bằng /exec; link chỉnh sửa Google Sheet không thể nhận đơn trực tiếp.');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.setAttribute('aria-busy', 'true');
  submitBtn.classList.add('loading');
  const orderData = {
    customerName: document.getElementById('customerName').value,
    customerPhone: document.getElementById('customerPhone').value,
    customerAddress: document.getElementById('customerAddress').value,
    customerHeight: document.getElementById('customerHeight').value,
    customerWeight: document.getElementById('customerWeight').value,
    orderNote: document.getElementById('orderNote').value,
    cartItems: cart.map(i => `${i.categoryName} (${i.selectedSize}/${i.selectedColor})`).join('; '),
    totalPrice: document.getElementById('checkoutTotalPrice').innerText,
    orderDate: new Date().toLocaleString('vi-VN')
  };
  try {
    const response = await fetch(SHEET_URL, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      throw new Error(`Google Apps Script returned HTTP ${response.status}`);
    }

    const responseText = await response.text();
    let result;
    try {
      result = JSON.parse(responseText);
    } catch {
      throw new Error('Apps Script không trả JSON hợp lệ. Hãy kiểm tra phiên bản Web App đã triển khai.');
    }

    if (!result || result.ok !== true) {
      throw new Error(result?.error || 'Apps Script từ chối đơn hàng nhưng không trả lý do. Hãy cập nhật và triển khai phiên bản mới nhất của GoogleAppsScript.gs.');
    }

    cart = [];
    saveCart();
    document.getElementById('checkoutModal').classList.remove('active');
    document.getElementById('orderForm').reset();
    window.location.assign(ZALO_CHAT_URL);
  } catch (error) {
    console.error('Google Sheets order submission failed:', error);
    const detail = error instanceof Error ? error.message : String(error);
    alert(`Không ghi được đơn hàng vào Google Sheet.\n\nChi tiết: ${detail}\n\nGiỏ hàng vẫn được giữ lại.`);
  } finally {
    submitBtn.disabled = false;
    submitBtn.removeAttribute('aria-busy');
    submitBtn.classList.remove('loading');
  }
}
