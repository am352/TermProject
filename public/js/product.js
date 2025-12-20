// Helpers for cart in localStorage
function getCart() {
  try {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function showAddedFeedback(button) {
  const originalText = button.textContent;
  button.textContent = '✓ Added';
  button.style.pointerEvents = 'none';
  setTimeout(() => {
    button.textContent = originalText;
    button.style.pointerEvents = 'auto';
  }, 1200);
}

function handleAddToCartClick(event) {
  const btn = document.getElementById('add-to-cart-btn');
  if (event.target !== btn) return;

  const name = btn.dataset.name;
  const price = parseFloat(btn.dataset.price || '0');

  const cart = getCart();
  const existing = cart.find(item => item.name === name);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }

  saveCart(cart);
  showAddedFeedback(btn);
}

// Determine API base dynamically
const API_BASE = window.location.hostname === 'localhost'
  ? ''               // local
  : window.location.origin; // deployed

// Load product details from API
document.addEventListener('DOMContentLoaded', async function () {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');

  if (!productId) {
    alert('No product specified.');
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/products/${productId}`);
    if (!res.ok) throw new Error('Product not found');

    const product = await res.json();

    // Populate page elements
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-description').textContent = product.description;
    document.getElementById('product-price').textContent = (product.price_cents / 100).toFixed(2);
    document.getElementById('product-subject').textContent = product.subject_family;
    
    // Only update stock if element exists
    const stockEl = document.getElementById('product-stock');
    if (stockEl) stockEl.textContent = product.in_stock;

    document.getElementById('product-image').src = `/images/${product.image_path}`;
    document.getElementById('product-image').alt = product.name;

    // Setup add-to-cart button
    const btn = document.getElementById('add-to-cart-btn');
    btn.dataset.name = product.name;
    btn.dataset.price = (product.price_cents / 100).toFixed(2);

    btn.addEventListener('click', handleAddToCartClick);

  } catch (err) {
    console.error(err);
    alert('Error loading product.');
  }
});
