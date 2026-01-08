const CONVENIENCE_FEES = 99;


let bagData = {};

// ===== INIT =====
document.addEventListener("DOMContentLoaded", initBag);

function initBag() {
  bagData = {};

  bagItems.forEach(id => {
    bagData[id] = (bagData[id] || 0) + 1;
  });

  renderBagItems();
  renderBagSummary();
}

// ===== RENDER ITEMS =====
function renderBagItems() {
  const container = document.querySelector('.bag-items-container');
  if (!container) return;

  if (Object.keys(bagData).length === 0) {
    container.innerHTML = `
      <h2>Your bag is empty 🛍️</h2>
      <p>Add items from the home page</p>
    `;
    return;
  }

  let html = '';

  for (let id in bagData) {
    const item = items.find(i => i.id === id);
    if (!item) continue;

    html += `
      <div class="bag-item-container">
        <img class="bag-item-img" src="${item.image}" />

        <div class="item-right-part">
          <div class="company">${item.company}</div>
          <div class="item-name">${item.item_name}</div>
          <div class="price-container">Rs ${item.current_price}</div>

          <div class="qty-controls">
            <button onclick="changeQty('${id}', -1)">−</button>
            <span>${bagData[id]}</span>
            <button onclick="changeQty('${id}', 1)">+</button>
          </div>
        </div>

        <div class="remove-from-cart" onclick="removeItem('${id}')">✕</div>
      </div>
    `;
  }

  container.innerHTML = html;
}


function renderBagSummary() {
  const summary = document.querySelector('.bag-summary');
  if (!summary) return;

  if (Object.keys(bagData).length === 0) {
    summary.innerHTML = '';
    return;
  }

  let totalItems = 0;
  let totalMRP = 0;
  let totalDiscount = 0;

  for (let id in bagData) {
    const item = items.find(i => i.id === id);
    if (!item) continue;

    totalItems += bagData[id];
    totalMRP += item.original_price * bagData[id];
    totalDiscount += (item.original_price - item.current_price) * bagData[id];
  }

  let finalAmount = totalMRP - totalDiscount + CONVENIENCE_FEES;

  summary.innerHTML = `
    <div class="bag-details-container">
      <div class="price-header">
        PRICE DETAILS (${totalItems} Items)
      </div>

      <div class="price-item">
        <span>Total MRP</span>
        <span>₹${totalMRP}</span>
      </div>

      <div class="price-item">
        <span>Discount on MRP</span>
        <span class="discount">-₹${totalDiscount}</span>
      </div>

      <div class="price-item">
        <span>Convenience Fee</span>
        <span>₹${CONVENIENCE_FEES}</span>
      </div>

      <div class="price-footer">
        <span>Total Payable</span>
        <span>₹${finalAmount}</span>
      </div>
    </div>

    <button class="btn-place-order">PLACE ORDER</button>
  `;
}



function changeQty(id, change) {
  bagData[id] += change;
  if (bagData[id] <= 0) delete bagData[id];
  syncBag();
}

function removeItem(id) {
  delete bagData[id];
  syncBag();
}

function syncBag() {
  bagItems = [];

  for (let id in bagData) {
    for (let i = 0; i < bagData[id]; i++) {
      bagItems.push(id);
    }
  }

  localStorage.setItem('bagItems', JSON.stringify(bagItems));
  renderBagItems();
  renderBagSummary();
}

// ===== PLACE ORDER =====
document.addEventListener("click", function (e) {
  if (!e.target.classList.contains("btn-place-order")) return;

  if (bagItems.length === 0) {
    alert("Your bag is empty!");
    return;
  }

  let confirmOrder = confirm(
    "Are you sure you want to place the order?"
  );

  if (!confirmOrder) return;

  // Clear bag
  bagItems = [];
  bagData = {};

  localStorage.removeItem("bagItems");

  alert("🎉 Order placed successfully!");

  // Refresh UI
  renderBagItems();
  renderBagSummary();

  // Optional redirect
  // window.location.href = "index.html";
});
