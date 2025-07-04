// mobile-nav.js: Lógica para menú de navegación móvil (Vanilla JS)

// Ejemplo de estructura esperada en HTML:
// <button class="menu-toggle" aria-label="Abrir menú">☰</button>
// <nav class="hero-nav"> ... </nav>

const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');

if (menuToggle && mobileNav) {
  menuToggle.addEventListener('click', function() {
    mobileNav.classList.toggle('open');
    // Accesibilidad: cambiar aria-expanded
    const expanded = mobileNav.classList.contains('open');
    menuToggle.setAttribute('aria-expanded', expanded);
    
    // Mejorar la experiencia móvil
    if (expanded) {
      // Bloquear scroll del body
      document.body.style.overflow = 'hidden';
      // Enfocar el primer enlace del menú para accesibilidad
      const firstLink = mobileNav.querySelector('a');
      if (firstLink) {
        setTimeout(() => firstLink.focus(), 100);
      }
    } else {
      // Restaurar scroll
      document.body.style.overflow = '';
      // Enfocar el botón de menú
      menuToggle.focus();
    }
  });
}

// Cerrar menú al hacer click en un enlace
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
mobileNavLinks.forEach(link => {
  link.addEventListener('click', function() {
    mobileNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Cerrar menú al hacer click fuera (opcional)
document.addEventListener('click', function(e) {
  if (
    mobileNav &&
    mobileNav.classList.contains('open') &&
    !mobileNav.contains(e.target) &&
    !menuToggle.contains(e.target)
  ) {
    mobileNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});

// Mejora: cerrar menú con Escape
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('open')) {
    mobileNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    menuToggle.focus();
  }
});

// Cerrar menú al hacer click en el botón de cerrar (tache)
const mobileNavClose = document.querySelector('.mobile-nav-close');
if (mobileNavClose) {
  mobileNavClose.addEventListener('click', function() {
    mobileNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    menuToggle.focus();
  });
} 