const API_URL = 'http://localhost:3000';

function iniciarTabs(): void {
  const tabLogin = document.getElementById('tab-login');
  const tabRegistro = document.getElementById('tab-registro');
  const formLogin = document.getElementById('form-login-container');
  const formRegistro = document.getElementById('form-registro-container');

  if (!tabLogin || !tabRegistro || !formLogin || !formRegistro) return;

  tabLogin.addEventListener('click', () => {
    tabLogin.classList.add('active');
    tabRegistro.classList.remove('active');
    formLogin.classList.remove('hidden');
    formRegistro.classList.add('hidden');
  });

  tabRegistro.addEventListener('click', () => {
    tabRegistro.classList.add('active');
    tabLogin.classList.remove('active');
    formRegistro.classList.remove('hidden');
    formLogin.classList.add('hidden');
  });
}

function iniciarLogin(): void {
  const btn = document.getElementById('btn-login');
  const errorEl = document.getElementById('login-error');
  if (!btn || !errorEl) return;

  btn.addEventListener('click', async () => {
    const email = (document.getElementById('login-email') as HTMLInputElement).value;
    const password = (document.getElementById('login-password') as HTMLInputElement).value;

    try {
      const respuesta = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        errorEl.textContent = datos.error;
        return;
      }

      localStorage.setItem('token', datos.token);
      localStorage.setItem('usuario', JSON.stringify(datos.usuario));

      if (datos.usuario.rol === 'superadmin' || datos.usuario.rol === 'pintor') {
        window.location.href = 'admin.html';
      } else {
        window.location.href = 'index.html';
      }

    } catch (error) {
      errorEl.textContent = 'Error al conectar con el servidor.';
    }
  });
}

function iniciarRegistro(): void {
  const btn = document.getElementById('btn-registro');
  const errorEl = document.getElementById('registro-error');
  if (!btn || !errorEl) return;

  btn.addEventListener('click', async () => {
    const nombre = (document.getElementById('registro-nombre') as HTMLInputElement).value;
    const email = (document.getElementById('registro-email') as HTMLInputElement).value;
    const password = (document.getElementById('registro-password') as HTMLInputElement).value;

    try {
      const respuesta = await fetch(`${API_URL}/api/auth/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password })
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        errorEl.textContent = datos.error;
        return;
      }

      localStorage.setItem('token', datos.token);
      localStorage.setItem('usuario', JSON.stringify(datos.usuario));
      window.location.href = 'index.html';

    } catch (error) {
      errorEl.textContent = 'Error al conectar con el servidor.';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  iniciarTabs();
  iniciarLogin();
  iniciarRegistro();
});