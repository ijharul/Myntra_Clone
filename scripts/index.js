// ===== GLOBAL STATE =====
let bagItems = [];
let wishlist = [];
let filteredItems = [];

// ===== ON LOAD =====
onLoad();

function onLoad() {
  bagItems = JSON.parse(localStorage.getItem('bagItems')) || [];
  wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

  filteredItems = [...items];

  renderItems(filteredItems);
  updateBagCount();
  setupSearch();
  setupSort();
}

// ===== RENDER ITEMS =====
function renderItems(list) {
  const container = document.querySelector('.items-container');
  if (!container) return;

  if (list.length === 0) {
    container.innerHTML =
      `<h2 style="grid-column:1/-1;text-align:center;">No items found</h2>`;
    return;
  }

  let html = '';
  list.forEach(item => {
    const inBag = bagItems.includes(item.id);
    const inWish = wishlist.includes(item.id);

    html += `
      <div class="item-container">
        <span class="wishlist-btn" onclick="toggleWishlist('${item.id}')">
          ${inWish ? '❤️' : '🤍'}
        </span>

        <img class="item-image" src="${item.image}">
        <div class="rating">${item.rating.stars} ⭐ | ${item.rating.count}</div>
        <div class="company-name">${item.company}</div>
        <div class="item-name">${item.item_name}</div>

        <div class="price">
          <span class="current-price">Rs ${item.current_price}</span>
          <span class="original-price">Rs ${item.original_price}</span>
          <span class="discount">(${item.discount_percentage}% OFF)</span>
        </div>

        <button class="btn-add-bag"
          onclick="addToBag('${item.id}')"
          ${inBag ? 'disabled' : ''}>
          ${inBag ? 'Added' : 'Add to Bag'}
        </button>
      </div>
    `;
  });

  container.innerHTML = html;
}

// ===== BAG =====
function addToBag(id) {
  if (!bagItems.includes(id)) {
    bagItems.push(id);
    localStorage.setItem('bagItems', JSON.stringify(bagItems));
    updateBagCount();
    renderItems(filteredItems);
  }
}

function updateBagCount() {
  const badge = document.querySelector('.bag-item-count');
  if (!badge) return;

  if (bagItems.length > 0) {
    badge.style.display = 'inline-block';
    badge.innerText = bagItems.length;
  } else {
    badge.style.display = 'none';
  }
}

// ===== SEARCH =====
function setupSearch() {
  const input = document.getElementById('searchInput');
  if (!input) return;

  input.addEventListener('input', e => {
    const value = e.target.value.toLowerCase();
    filteredItems = items.filter(item =>
      item.item_name.toLowerCase().includes(value) ||
      item.company.toLowerCase().includes(value)
    );
    renderItems(filteredItems);
  });
}

// ===== SORT =====
function setupSort() {
  const select = document.getElementById('sortSelect');
  if (!select) return;

  select.addEventListener('change', e => {
    if (e.target.value === 'low') {
      filteredItems.sort((a, b) => a.current_price - b.current_price);
    } else if (e.target.value === 'high') {
      filteredItems.sort((a, b) => b.current_price - a.current_price);
    }
    renderItems(filteredItems);
  });
}

// ===== CATEGORY FILTER (NAV BAR) =====
function filterByCategory(category) {
  filteredItems = items.filter(item => item.category === category);
  renderItems(filteredItems);
}

// ===== RESET (LOGO CLICK OPTIONAL) =====
function resetFilters() {
  filteredItems = [...items];
  renderItems(filteredItems);
}

// ===== WISHLIST =====
function toggleWishlist(id) {
  if (wishlist.includes(id)) {
    wishlist = wishlist.filter(w => w !== id);
  } else {
    wishlist.push(id);
  }
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  renderItems(filteredItems);
}

/* ===== WISHLIST COUNT ===== */
function updateWishlistCount() {
  const countEl = document.querySelector('.wishlist-count');
  if (!countEl) return;

  if (wishlist.length > 0) {
    countEl.style.display = 'inline-block';
    countEl.innerText = wishlist.length;
  } else {
    countEl.style.display = 'none';
  }
}

/* MODIFY toggleWishlist (REPLACE YOUR EXISTING ONE) */
function toggleWishlist(id) {
  if (wishlist.includes(id)) {
    wishlist = wishlist.filter(w => w !== id);
  } else {
    wishlist.push(id);
  }

  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  updateWishlistCount();
  renderItems(filteredItems);
}

/* CALL THIS IN onLoad() */
updateWishlistCount();

/* ===== SHOW WISHLIST ===== */
function showWishlist() {
  const panel = document.getElementById('wishlistPanel');
  const container = document.getElementById('wishlistItems');

  if (wishlist.length === 0) {
    container.innerHTML = `<p>No items in wishlist ❤️</p>`;
    panel.classList.remove('hidden');
    return;
  }

  let html = '';
  wishlist.forEach(id => {
    const item = items.find(i => i.id === id);
    if (!item) return;

    const inBag = bagItems.includes(id);

    html += `
      <div class="wishlist-item">
        <img src="${item.image}" class="wishlist-img">

        <div class="wishlist-info">
          <div class="wishlist-name">${item.item_name}</div>
          <div class="wishlist-price">Rs ${item.current_price}</div>

          <div class="wishlist-actions">
            <button onclick="addToBagFromWishlist('${id}')"
              ${inBag ? 'disabled' : ''}>
              ${inBag ? 'Added' : 'Add to Bag'}
            </button>

            <button class="remove-btn"
              onclick="removeFromWishlist('${id}')">
              Remove
            </button>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  panel.classList.remove('hidden');
}


/* ===== PROFILE ===== */
function showProfile() {
  document.getElementById('profileBagCount').innerText = bagItems.length;
  document.getElementById('profileWishCount').innerText = wishlist.length;
  document.getElementById('profilePanel').classList.remove('hidden');
}

/* ===== CLOSE PANELS ===== */
function closePanels() {
  document.getElementById('profilePanel').classList.add('hidden');
  document.getElementById('wishlistPanel').classList.add('hidden');
}

function toggleProfileDropdown() {
  const dropdown = document.getElementById('profileDropdown');

  document.getElementById('profileBagCount').innerText = bagItems.length;
  document.getElementById('profileWishCount').innerText = wishlist.length;

  dropdown.classList.toggle('hidden');
}

/* Close profile when clicking outside */
document.addEventListener('click', function (e) {
  const dropdown = document.getElementById('profileDropdown');
  const profileIcon = e.target.closest('.action_container');

  if (!profileIcon && !e.target.closest('#profileDropdown')) {
    dropdown.classList.add('hidden');
  }
});

function removeFromWishlist(id) {
  wishlist = wishlist.filter(w => w !== id);
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  updateWishlistCount();
  renderItems(filteredItems);
  showWishlist(); // refresh panel
}

function addToBagFromWishlist(id) {
  if (!bagItems.includes(id)) {
    bagItems.push(id);
    localStorage.setItem('bagItems', JSON.stringify(bagItems));
    updateBagCount();
    renderItems(filteredItems);
    showWishlist(); // refresh panel
  }
}
