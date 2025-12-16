document.addEventListener('DOMContentLoaded', function () {
  
  
    var form = document.querySelector('.login-form');
  if (!form) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var emailInput = form.querySelector('input[type="email"]');
    var passwordInput = form.querySelector('input[type="password"]');

    var email = emailInput.value.trim();
    var password = passwordInput.value;

    if (!email || !password) {
      alert('Please enter both email and password.');
      return;
    }

    form.reset();

    window.location.href = '../profile/profile.html';
  });
});
