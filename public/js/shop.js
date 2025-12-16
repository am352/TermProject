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

// Search handler (filters product cards on the page)
function handleSearch(event) {
  event.preventDefault();

  var input = document.getElementById('search-input');
  if (!input) return;

  var query = input.value.toLowerCase().trim();
  var cards = document.querySelectorAll('#product-grid .product-card');

  cards.forEach(function (card) {
    var name = (card.dataset.name || '').toLowerCase();
    var subject = (card.dataset.subject || '').toLowerCase();
    var match = !query || name.includes(query) || subject.includes(query);
    card.style.display = match ? '' : 'none';
  });
}

// Generic add-to-cart click handler (works on shop + product pages)
function handleAddToCartClick(event) {
  var target = event.target;
  if (!target.classList.contains('add-to-cart')) return;

  event.preventDefault();

  var name = target.dataset.name;
  var price = parseFloat(target.dataset.price || '0');

  var cart = getCart();
  var existing = cart.find(function (item) { return item.name === name; });

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name: name, price: price, qty: 1 });
  }

  saveCart(cart);
  showAddedFeedback(target);
}


document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('search-form');
  if (form) {
    form.addEventListener('submit', handleSearch);
  }

  document.addEventListener('click', handleAddToCartClick);
});

function showAddedFeedback(button) {
  var originalText = button.textContent;

  button.textContent = '✓ Added';
  button.style.pointerEvents = 'none';

  setTimeout(function () {
    button.textContent = originalText;
    button.style.pointerEvents = 'auto';
  }, 1200);
}
