export function iniciarNav(): void {
  const navbar = document.getElementById('navbar');

  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  const enlaces = document.querySelectorAll<HTMLAnchorElement>('.nav-links a');
  enlaces.forEach(enlace => {
    enlace.addEventListener('click', (e) => {
      e.preventDefault();
      const destino = enlace.getAttribute('href');
      if (!destino) return;
      const seccion = document.querySelector<HTMLElement>(destino);
      if (!seccion) return;
      seccion.scrollIntoView({ behavior: 'smooth' });
    });
  });
}