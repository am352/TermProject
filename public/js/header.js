document.addEventListener('DOMContentLoaded', async function () {
  const loginBtn = document.querySelector('.login-btn');
  const cartCountSpans = document.querySelectorAll('.cart-count');
  const logoutBtns = document.querySelectorAll('.logout-btn');

  // --- Function to update login/profile link ---
  async function updateLoginStatus() {
    let user = null;
    try {
      const response = await fetch('/current-user');
      if (response.ok) user = await response.json();
    } catch (err) {
      console.error('Error fetching current user:', err);
    }

    if (loginBtn) {
      if (user) {
        loginBtn.textContent = 'Profile';
        loginBtn.href = '/profile';
      } else {
        loginBtn.textContent = 'Login';
        loginBtn.href = '/login';
      }
    }
  }

  // --- Function to handle logout buttons ---
  async function setupLogoutButtons() {
    logoutBtns.forEach(btn => {
      btn.addEventListener('click', async () => {
        await fetch('/logout', { method: 'POST' });
        updateLoginStatus();
        window.location.href = '/login';
      });
    });
  }

  // --- Initial updates ---
  updateCartCount();
  updateLoginStatus();
  setupLogoutButtons();

  // --- Listen for storage changes (other tabs) ---
  window.addEventListener('storage', updateCartCount);

  // --- Expose function globally for other scripts ---
  window.updateCartCount = updateCartCount;
});
