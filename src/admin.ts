const API_URL = 'http://localhost:3000';

function verificarAcceso(): void {
  const usuario = localStorage.getItem('usuario');
  if (!usuario) {
    window.location.href = 'login.html';
    return;
  }

  const datos = JSON.parse(usuario);
  if (datos.rol !== 'superadmin' && datos.rol !== 'pintor') {
    window.location.href = 'index.html';
    return;
  }

  const bienvenida = document.getElementById('admin-bienvenida');
  if (bienvenida) bienvenida.textContent = `Bienvenido, ${datos.nombre}`;
}

async function cargarImagenes(): Promise<void> {
  const grid = document.getElementById('admin-imagenes-grid');
  if (!grid) return;

  try {
    const respuesta = await fetch(`${API_URL}/api/imagenes`);
    const imagenes = await respuesta.json();

    grid.innerHTML = '';

    if (imagenes.length === 0) {
      grid.innerHTML = '<p style="color: var(--color-texto-suave)">No hay imágenes todavía.</p>';
      return;
    }

    imagenes.forEach((imagen: { id: number; src: string; alt: string }) => {
      const item = document.createElement('div');
      item.classList.add('admin-imagen-item');
      item.innerHTML = `
        <img src="${API_URL}${imagen.src}" alt="${imagen.alt}" />
        <button data-id="${imagen.id}">Eliminar</button>
      `;
      const btn = item.querySelector('button');
      if (btn) btn.addEventListener('click', () => eliminarImagen(imagen.id));
      grid.appendChild(item);
    });

  } catch (error) {
    console.error('Error al cargar imágenes:', error);
  }
}

async function eliminarImagen(id: number): Promise<void> {
  const token = localStorage.getItem('token');
  if (!token) return;

  if (!confirm('¿Seguro que quieres eliminar esta imagen?')) return;

  try {
    const respuesta = await fetch(`${API_URL}/api/imagenes/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (respuesta.ok) cargarImagenes();

  } catch (error) {
    console.error('Error al eliminar:', error);
  }
}

function iniciarSubida(): void {
  const btn = document.getElementById('btn-subir');
  const mensaje = document.getElementById('subir-mensaje');
  if (!btn || !mensaje) return;

  btn.addEventListener('click', async () => {
    const alt = (document.getElementById('imagen-alt') as HTMLInputElement).value;
    const archivo = (document.getElementById('imagen-archivo') as HTMLInputElement).files?.[0];
    const token = localStorage.getItem('token');

    if (!archivo) {
      mensaje.textContent = 'Selecciona una imagen primero.';
      mensaje.className = 'admin-mensaje error';
      return;
    }

    const formData = new FormData();
    formData.append('imagen', archivo);
    formData.append('alt', alt || 'Miniatura');

    try {
      const respuesta = await fetch(`${API_URL}/api/imagenes`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (respuesta.ok) {
        mensaje.textContent = 'Imagen subida correctamente.';
        mensaje.className = 'admin-mensaje ok';
        (document.getElementById('imagen-alt') as HTMLInputElement).value = '';
        (document.getElementById('imagen-archivo') as HTMLInputElement).value = '';
        cargarImagenes();
      } else {
        mensaje.textContent = 'Error al subir la imagen.';
        mensaje.className = 'admin-mensaje error';
      }

    } catch (error) {
      mensaje.textContent = 'Error al conectar con el servidor.';
      mensaje.className = 'admin-mensaje error';
    }
  });
}

function iniciarCerrarSesion(): void {
  const btn = document.getElementById('btn-cerrar-sesion');
  if (!btn) return;

  btn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = 'index.html';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  verificarAcceso();
  cargarImagenes();
  iniciarSubida();
  iniciarCerrarSesion();
});