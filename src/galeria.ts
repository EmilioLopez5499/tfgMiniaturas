interface Imagen {
  src: string;
  alt: string;
}

const imagenesLocales: Imagen[] = [
  { src: 'img/mini1.jpg', alt: 'Miniatura 1' },
  { src: 'img/mini2.jpg', alt: 'Miniatura 2' },
  { src: 'img/mini3.jpg', alt: 'Miniatura 3' },
  { src: 'img/mini4.jpg', alt: 'Miniatura 4' },
  { src: 'img/mini5.jpg', alt: 'Miniatura 5' },
  { src: 'img/mini6.jpg', alt: 'Miniatura 6' },
  { src: 'img/mini7.jpg', alt: 'Miniatura 7' },
  { src: 'img/mini8.jpg', alt: 'Miniatura 8' },
];

export function cargarGaleria(): void {
  const grid = document.getElementById('galeria-grid');
  if (!grid) return;

  imagenesLocales.forEach(imagen => {
    const img = document.createElement('img');
    img.src = imagen.src;
    img.alt = imagen.alt;
    img.loading = 'lazy';
    grid.appendChild(img);
  });
}