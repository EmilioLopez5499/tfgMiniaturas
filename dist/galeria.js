const API_URL = 'http://localhost:3000';
export async function cargarGaleria() {
    const grid = document.getElementById('galeria-grid');
    if (!grid)
        return;
    try {
        const respuesta = await fetch(`${API_URL}/api/imagenes`);
        if (!respuesta.ok)
            throw new Error('Error al obtener las imágenes');
        const imagenes = await respuesta.json();
        if (imagenes.length === 0) {
            grid.innerHTML = '<p class="galeria-vacia">Próximamente...</p>';
            return;
        }
        imagenes.forEach(imagen => {
            const img = document.createElement('img');
            img.src = `${API_URL}${imagen.src}`;
            img.alt = imagen.alt;
            img.loading = 'lazy';
            grid.appendChild(img);
        });
    }
    catch (error) {
        grid.innerHTML = '<p class="galeria-vacia">Error al cargar las imágenes.</p>';
        console.error(error);
    }
}
//# sourceMappingURL=galeria.js.map