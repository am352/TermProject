function getCart() {
  try {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));

  if (window.updateCartCount) {
    window.updateCartCount();
  }
}


function renderCart() {
  var container = document.getElementById('cart-items');
  var totalEl = document.getElementById('cart-total');
  var cart = getCart();

  if (!container || !totalEl) return;

  container.innerHTML = '';

  if (!cart.length) {
    container.innerHTML = '<p class = "empty-message">Your cart is currently empty.</p>';
    totalEl.textContent = '';
    return;
  }

  var total = 0;

  cart.forEach(function (item) {
    total += item.price * item.qty;

    var card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <p><strong>${item.name}</strong></p>
      <p>Quantity: ${item.qty}</p>
      <p>Price: $${item.price.toFixed(2)}</p>
    `;
    container.appendChild(card);
  });

  totalEl.textContent = 'Total: $' + total.toFixed(2);
}

function checkout() {
  var cart = getCart();
  if (!cart.length) {
    alert('Your cart is empty.');
    return;
  }

function clearCart() {
  saveCart([]);  
  renderCart();  
}

  var order = {
    items: cart,
    date: new Date().toISOString()
  };

  localStorage.setItem('lastOrder', JSON.stringify(order));
  saveCart([]);
  renderCart();

  alert('Checkout complete! Thank you for your purchase.');
}

document.addEventListener('DOMContentLoaded', function () {
  renderCart();

  // Checkout button
  var checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', checkout);
  }

  // Clear Cart button
  var clearBtn = document.getElementById('clear-cart-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', async function () {
      if (!confirm('Are you sure you want to clear your cart?')) return;

      // Clear localStorage
      saveCart([]);
      renderCart();

      try {
        const res = await fetch('/cart/clear', { method: 'POST' });
        if (!res.ok) console.error('Failed to clear server-side cart');
      } catch (err) {
        console.error('Error clearing server-side cart', err);
      }
    });
  }
});

