import { iniciarNav } from './nav.js';
import { cargarGaleria } from './galeria.js';
import { iniciarContacto } from './contacto.js';

function actualizarBotonCuenta(): void {
  const btn = document.querySelector<HTMLButtonElement>('.nav-links .btn');
  if (!btn) return;

  const usuarioGuardado = localStorage.getItem('usuario');
  if (usuarioGuardado) {
    const usuario = JSON.parse(usuarioGuardado);
    btn.textContent = usuario.nombre;
    btn.onclick = () => {
      if (usuario.rol === 'superadmin' || usuario.rol === 'pintor') {
        window.location.href = 'admin.html';
      } else {
        window.location.href = 'perfil.html';
      }
    };
  } else {
    btn.textContent = 'Mi cuenta';
    btn.onclick = () => { window.location.href = 'login.html'; };
  }
}

document.addEventListener('DOMContentLoaded', () => {
  iniciarNav();
  cargarGaleria();
  iniciarContacto();
  actualizarBotonCuenta();
});