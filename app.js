/* ==========================================================================
   THANH LÂM - MAN CLOTHING | ENGINE & SCROLL OBSERVER
   ========================================================================== */

const SHEET_URL = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";

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

function handleRouting() {
  const hash = window.location.hash || '#/';
  const appView = document.getElementById('app-view');
  
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
          <button class="btn btn-primary btn-block" style="font-size:0.75rem" onclick="openQuickView('${prod.id}')">
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
          <div class="selector-group">
            <label>1. Chọn Áo Top</label>
            <div class="selector-options">
              ${tops.map(p => `
                <div class="option-item ${selectedMix.top.id === p.id ? 'selected' : ''}" onclick="selectMixItem('top', '${p.id}')">
                  <img src="${p.image}" alt="${p.name}">
                  <span>${p.name}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="selector-group">
            <label>2. Chọn Quần Bottom</label>
            <div class="selector-options">
              ${bottoms.map(p => `
                <div class="option-item ${selectedMix.bottom.id === p.id ? 'selected' : ''}" onclick="selectMixItem('bottom', '${p.id}')">
                  <img src="${p.image}" alt="${p.name}">
                  <span>${p.name}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="selector-group">
            <label>3. Khoác / Phụ Kiện</label>
            <div class="selector-options">
              ${accessories.map(p => `
                <div class="option-item ${selectedMix.accessory.id === p.id ? 'selected' : ''}" onclick="selectMixItem('accessory', '${p.id}')">
                  <img src="${p.image}" alt="${p.name}">
                  <span>${p.name}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="studio-preview">
          <div class="outfit-display">
            <div class="outfit-slot"><img src="${selectedMix.top.image}"></div>
            <div class="outfit-slot"><img src="${selectedMix.bottom.image}"></div>
            <div class="outfit-slot"><img src="${selectedMix.accessory.image}"></div>
          </div>
          <div class="outfit-summary">
            <h4>TỔNG CỘNG OUTFIT</h4>
            <p style="font-size:1.3rem; font-weight:800; color:var(--accent-color); margin: 8px 0;">
              ${formatVND(selectedMix.top.price + selectedMix.bottom.price + selectedMix.accessory.price)}
            </p>
            <button class="btn btn-accent btn-block" onclick="addMixToCart()">THÊM TRỌN BỘ VÀO GIỎ</button>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderAboutView() {
  return `
    <section class="scroll-reveal" style="max-width: 900px; margin: 60px auto; padding: 0 24px;">
      <h2 style="font-size:2.5rem; font-weight:800; margin-bottom: 20px;">CÂU CHUYỆN THANH LÂM MAN</h2>
      <p style="font-size:1.1rem; line-height: 1.8; margin-bottom: 20px;">
        Được thành lập với sứ mệnh định hình phong cách ăn mặc nam tính hiện đại, <strong>THANH LÂM - MAN CLOTHING</strong> theo đuổi triết lý <em>Minimalist & Contemporary Streetwear</em>.
      </p>
    </section>
  `;
}

function renderContactView() {
  return `
    <section class="scroll-reveal" style="max-width: 900px; margin: 60px auto; padding: 0 24px; text-align:center;">
      <h2 style="font-size:2.5rem; font-weight:800; margin-bottom: 20px;">LIÊN HỆ VỚI CHÚNG TÔI</h2>
      <div style="display:flex; justify-content:center; gap:20px; flex-wrap:wrap; margin-top:30px;">
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
    <div><img src="${prod.image}" alt="${prod.name}" style="width:100%; height:400px; object-fit:cover; border-radius:4px;"></div>
    <div>
      <span class="product-cat">${prod.categoryName}</span>
      <h2 style="font-size:1.8rem; margin:8px 0;">${prod.name}</h2>
      <div class="product-price" style="font-size:1.4rem; margin-bottom:16px;">${formatVND(prod.price)}</div>
      <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:20px;">${prod.desc}</p>
      <div class="form-group"><label>Chọn Size</label><select id="qvSize">${prod.sizes.map(s => `<option value="${s}">${s}</option>`).join('')}</select></div>
      <div class="form-group"><label>Chọn Màu</label><select id="qvColor">${prod.colors.map(c => `<option value="${c}">${c}</option>`).join('')}</select></div>
      <button class="btn btn-accent btn-block" style="margin-top:20px;" onclick="addToCartFromQuickView('${prod.id}')">THÊM VÀO GIỎ HÀNG</button>
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
  const prod = PRODUCTS.find(p => p.id === id);
  if (prod) { selectedMix[type] = prod; handleRouting(); }
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
