/* ==========================
   Sample product data
   ========================== */
const products = [
  { id: 'p1', title: 'Wool Tailored Coat', category:'Jackets', price:259, rating:4.8,
    img:'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&s=3f1a0d686f6a5d9d81fa5b9f13ef2e59',
    created: '2025-09-12'
  },
  { id: 'p2', title: 'Structured Blazer', category:'Suits', price:399, rating:4.7,
    img:'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&s=23a8a6c65ed5f9b8c2f3e1f6c8d9a0b1',
    created: '2025-10-01'
  },
  { id: 'p3', title: 'Cotton Oxford Shirt', category:'Shirts', price:79, rating:4.4,
    img:'https://images.unsplash.com/photo-1618001789159-ffffe6f96ef2',
    created: '2025-08-18'
  },
  { id: 'p4', title: 'Essential Crew T-Shirt', category:'T-Shirts', price:29, rating:4.1,
    img:'https://images.unsplash.com/photo-1521334884684-d80222895322?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&s=3d6be4e2efb4a4e429d3d6f7f8ae7f48',
    created: '2025-11-01'
  },
  { id: 'p5', title: 'Leather Derby Shoe', category:'Shoes', price:149, rating:4.6,
    img:'https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16',
    created: '2025-07-21'
  },
  { id: 'p6', title: 'Slim Fit Chinos', category:'Trousers', price:69, rating:4.2,
    img:'https://images.unsplash.com/photo-1574180566232-aaad1b5b8450',
    created: '2025-06-10'
  },
  { id: 'p7', title: 'Silk Pocket Square', category:'Accessories', price:19, rating:4.5,
    img:'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4',
    created: '2025-10-12'
  },
  { id: 'p8', title: 'Double Breasted Coat', category:'Jackets', price:329, rating:4.9,
    img:'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&s=23a8a6c65ed5f9b8c2f3e1f6c8d9a0b1',
    created: '2025-11-05'
  }
];

// initialize UI elements
const productsGrid = document.getElementById('productsGrid');
const categoryFilter = document.getElementById('categoryFilter');
const sortSelect = document.getElementById('sortSelect');
const priceRange = document.getElementById('priceRange');
const priceRangeValue = document.getElementById('priceRangeValue');
const countShown = document.getElementById('countShown');
const noResults = document.getElementById('noResults');
const searchInput = document.getElementById('searchInput');

const cartToggle = document.getElementById('cartToggle');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartItemsEl = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const cartItemsCountText = document.getElementById('cartItemsCount');
const checkoutBtn = document.getElementById('checkoutBtn');
const shopNow = document.getElementById('shopNow');

let state = {
  products: [...products],
  filters: {category:'all', maxPrice: Number(priceRange.value), q:''},
  sort: 'newest',
  cart: loadCart()
};

// populate category filter
function initCategories(){
  const cats = Array.from(new Set(products.map(p=>p.category))).sort();
  cats.forEach(c=>{
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    categoryFilter.appendChild(opt);
  });
}
initCategories();

function formatPrice(n){ return Number(n).toFixed(2).replace('.00','') } // simple format

// Rendering products based on filters
function renderProducts(){
  let list = state.products.slice();

  // search
  const q = state.filters.q.trim().toLowerCase();
  if(q){
    list = list.filter(p => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }

  // category
  if(state.filters.category !== 'all'){
    list = list.filter(p => p.category === state.filters.category);
  }

  // price filter
  list = list.filter(p => p.price <= state.filters.maxPrice);

  // sort
  if(state.sort === 'price-asc') list.sort((a,b)=>a.price-b.price);
  else if(state.sort === 'price-desc') list.sort((a,b)=>b.price-a.price);
  else if(state.sort === 'rating-desc') list.sort((a,b)=>b.rating-b.rating);
  else list.sort((a,b)=>new Date(b.created) - new Date(a.created)); // newest

  // show count
  countShown.textContent = list.length;

  productsGrid.innerHTML = '';
  if(list.length === 0){
    noResults.style.display = 'block';
    return;
  } else noResults.style.display = 'none';

  list.forEach(p=>{
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="media"><img src="${p.img}" alt="${escapeHtml(p.title)}"></div>
      <div class="meta">
        <div class="title">${escapeHtml(p.title)}</div>
        <div class="price">₹${formatPrice(p.price)}</div>
        <div class="rating small">★ ${p.rating.toFixed(1)}</div>
        <div class="actions">
          <button class="add-btn" data-id="${p.id}">Add to Cart</button>
          <div class="muted small">${p.category}</div>
        </div>
      </div>
    `;
    productsGrid.appendChild(card);
  });

  // add event listeners for Add buttons
  document.querySelectorAll('.add-btn').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const id = e.currentTarget.dataset.id;
      addToCart(id, 1);
      openCart();
    });
  });
}

// simple escape
function escapeHtml(s){ return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;') }

renderProducts();

// UI: filter handlers
categoryFilter.addEventListener('change', e=>{
  state.filters.category = e.target.value;
  renderProducts();
});
sortSelect.addEventListener('change', e=>{
  state.sort = e.target.value;
  renderProducts();
});
priceRange.addEventListener('input', e=>{
  state.filters.maxPrice = Number(e.target.value);
  priceRangeValue.textContent = state.filters.maxPrice;
  renderProducts();
});
searchInput.addEventListener('input', e=>{
  state.filters.q = e.target.value;
  renderProducts();
});

// categories click - quick filter
document.querySelectorAll('.cat').forEach(cel=>{
  cel.addEventListener('click', e=>{
    const cat = cel.dataset.cat;
    categoryFilter.value = cat;
    state.filters.category = cat;
    renderProducts();
    window.scrollTo({top: document.querySelector('#shop').offsetTop - 80, behavior:'smooth'});
  });
});

// SHOP NOW scroll
shopNow.addEventListener('click', ()=>{ document.querySelector('#shop').scrollIntoView({behavior:'smooth', block:'start'}) });

/* ==========================
   CART: localStorage based
   ========================== */
function loadCart(){
  try{
    const raw = localStorage.getItem('marquee_cart_v1');
    if(!raw) return {};
    return JSON.parse(raw);
  }catch(e){ return {}; }
}

function saveCart(){
  localStorage.setItem('marquee_cart_v1', JSON.stringify(state.cart));
}

function addToCart(id, qty=1){
  const item = state.cart[id] || {id, qty:0};
  item.qty = Number(item.qty) + Number(qty);
  const product = products.find(p=>p.id===id);
  if(!product) return;
  item.title = product.title; item.price = product.price; item.img = product.img;
  state.cart[id] = item;
  saveCart();
  renderCart();
}

function removeFromCart(id){
  delete state.cart[id];
  saveCart();
  renderCart();
}

function updateQty(id, qty){
  if(qty < 1){ removeFromCart(id); return; }
  if(state.cart[id]) state.cart[id].qty = Number(qty);
  saveCart();
  renderCart();
}

function cartTotals(){
  const items = Object.values(state.cart);
  const totalQty = items.reduce((s,i)=>s + Number(i.qty), 0);
  const totalAmt = items.reduce((s,i)=>s + (Number(i.qty) * Number(i.price)), 0);
  return { totalQty, totalAmt };
}

// render cart
function renderCart(){
  const items = Object.values(state.cart);
  cartItemsEl.innerHTML = '';
  if(items.length === 0){
    cartItemsEl.innerHTML = `<div style="padding:20px;text-align:center" class="muted">Your cart is empty.</div>`;
  } else {
    items.forEach(it=>{
      const el = document.createElement('div');
      el.className = 'cart-item';
      el.innerHTML = `
        <img src="${it.img}" alt="${escapeHtml(it.title)}">
        <div style="flex:1">
          <div style="display:flex;align-items:center;justify-content:space-between">
            <div><strong>${escapeHtml(it.title)}</strong><div class="small muted">₹${formatPrice(it.price)}</div></div>
            <button class="small" data-remove="${it.id}" title="Remove">Remove</button>
          </div>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px">
            <div class="qty">
              <button data-decrease="${it.id}">−</button>
              <div style="min-width:28px;text-align:center">${it.qty}</div>
              <button data-increase="${it.id}">+</button>
            </div>
            <div class="small">₹${formatPrice(it.qty * it.price)}</div>
          </div>
        </div>
      `;
      cartItemsEl.appendChild(el);
    });
  }

  // attach listeners
  cartItemsEl.querySelectorAll('[data-remove]').forEach(btn=>{
    btn.addEventListener('click', e=> removeFromCart(e.currentTarget.dataset.remove));
  });
  cartItemsEl.querySelectorAll('[data-decrease]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const id = e.currentTarget.dataset.decrease;
      const current = state.cart[id];
      if(!current) return;
      updateQty(id, current.qty - 1);
    });
  });
  cartItemsEl.querySelectorAll('[data-increase]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const id = e.currentTarget.dataset.increase;
      const current = state.cart[id];
      if(!current) return;
      updateQty(id, current.qty + 1);
    });
  });

  const totals = cartTotals();
  cartTotalEl.textContent = formatPrice(totals.totalAmt);
  cartCount.textContent = totals.totalQty;
  cartItemsCountText.textContent = `(${totals.totalQty} items)`;
}

renderCart();

// cart modal toggle
cartToggle.addEventListener('click', ()=>{
  if(cartModal.classList.contains('hidden')) openCart();
  else closeCartFunc();
});
closeCart.addEventListener('click', closeCartFunc);
function openCart(){ cartModal.classList.remove('hidden'); cartModal.style.transform='scale(1)'; renderCart(); }
function closeCartFunc(){ cartModal.classList.add('hidden'); }

// checkout
checkoutBtn.addEventListener('click', ()=>{
  const totals = cartTotals();
  if(totals.totalQty === 0){
    alert('Your cart is empty.');
    return;
  }
  // simple checkout simulation
  alert(`Checkout — Total ₹${formatPrice(totals.totalAmt)}\n(Implementation placeholder)`);
  // clear cart
  state.cart = {};
  saveCart();
  renderCart();
  closeCartFunc();
});

/* ==========================
   Utility: persist filters in URL (optional)
   ========================== */
// Optionally restore price slider max range to product prices
(function setMaxPriceFromProducts(){
  const max = Math.ceil(Math.max(...products.map(p=>p.price), 100));
  priceRange.max = Math.max(500, max);
  priceRange.value = priceRange.max;
  priceRangeValue.textContent = priceRange.value;
  state.filters.maxPrice = Number(priceRange.value);
})();

/* ==========================
   Tiny accessibility & niceties
   ========================== */
// close cart when clicking outside on small screens
document.addEventListener('click', (e)=>{
  if(!cartModal.classList.contains('hidden') && !cartModal.contains(e.target) && !cartToggle.contains(e.target)){
    closeCartFunc();
  }
});

// subscribe button
document.getElementById('subscribeBtn').addEventListener('click', ()=>{
  const em = document.getElementById('newsletterEmail').value;
  if(!em || !em.includes('@')){ alert('Enter a valid email'); return; }
  alert('Thanks! You are subscribed.');
  document.getElementById('newsletterEmail').value = '';
});

// initial render
renderProducts();

/* End of script */