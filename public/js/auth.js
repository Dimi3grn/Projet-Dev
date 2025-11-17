// Gestion de l'authentification (page de connexion)

// Rediriger si déjà connecté
if (api.getToken()) {
  const user = api.getUser();
  if (user.role === 'admin') {
    window.location.href = '/admin.html';
  } else {
    window.location.href = '/client.html';
  }
}

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegisterLink = document.getElementById('show-register');
const showLoginBtn = document.getElementById('show-login');

// Affiche un message d'erreur
function showError(message) {
  const container = document.getElementById('alert-container');
  container.innerHTML = `<div class="alert alert-error">${message}</div>`;
}

// Gère la soumission du formulaire de connexion
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const result = await api.login(email, password);

    // Rediriger selon le rôle
    if (result.user.role === 'admin') {
      window.location.href = '/admin.html';
    } else {
      window.location.href = '/client.html';
    }
  } catch (error) {
    showError(error.message);
  }
});

// Gère la soumission du formulaire d'inscription
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  try {
    await api.register(email, password);
    window.location.href = '/client.html';
  } catch (error) {
    showError(error.message);
  }
});

// Affiche le formulaire d'inscription
showRegisterLink.addEventListener('click', (e) => {
  e.preventDefault();
  loginForm.classList.add('hidden');
  registerForm.classList.remove('hidden');
});

// Affiche le formulaire de connexion
showLoginBtn.addEventListener('click', () => {
  registerForm.classList.add('hidden');
  loginForm.classList.remove('hidden');
});
