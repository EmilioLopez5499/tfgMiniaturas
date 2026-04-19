import { iniciarNav } from './nav.js';
import { cargarGaleria } from './galeria.js';

document.addEventListener('DOMContentLoaded', () => {
  iniciarNav();
  cargarGaleria();

  const form = document.getElementById('form-contacto');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nombre = (document.getElementById('nombre') as HTMLInputElement).value;
      alert(`Gracias, ${nombre}. Tu mensaje ha sido recibido. Pronto nos pondremos en contacto contigo.`);
      (form as HTMLFormElement).reset();
    });
  }
});