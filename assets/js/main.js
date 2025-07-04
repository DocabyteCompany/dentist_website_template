// main.js: Interacciones generales del sitio (Vanilla JS)

// Ejemplo: Scroll suave para navegación interna
// (Asegúrate de que los enlaces tengan href="#seccion")
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Ejemplo: Menú responsivo (agrega lógica si tienes un menú hamburguesa)
// document.querySelector('.menu-toggle').addEventListener('click', function() {
//   document.querySelector('.hero-nav').classList.toggle('open');
// });

// Efecto glass en header al hacer scroll
const mainHeader = document.getElementById('main-header');
window.addEventListener('scroll', () => {
  if (!mainHeader) return;
  if (window.scrollY > 10) {
    mainHeader.classList.add('scrolled');
  } else {
    mainHeader.classList.remove('scrolled');
  }
});

// Carrusel de Que ofrezco: scroll horizontal por drag
(function() {
  const container = document.querySelector('.carousel-container');
  const track = document.querySelector('.carousel-track');
  if (!container || !track) return;

  let isDown = false;
  let startX;
  let scrollLeft;
  let lastX;
  let velocity = 0;
  let rafId = null;
  let lastTime = 0;

  function animateInertia() {
    if (Math.abs(velocity) < 0.1) return;
    container.scrollLeft -= velocity;
    velocity *= 0.93; // deceleración
    rafId = requestAnimationFrame(animateInertia);
  }

  container.addEventListener('mousedown', (e) => {
    isDown = true;
    container.classList.add('dragging');
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
    lastX = e.pageX;
    lastTime = Date.now();
    if (rafId) cancelAnimationFrame(rafId);
  });
  container.addEventListener('mouseleave', () => {
    isDown = false;
    container.classList.remove('dragging');
  });
  container.addEventListener('mouseup', (e) => {
    isDown = false;
    container.classList.remove('dragging');
    // Inercia
    const now = Date.now();
    const dx = e.pageX - lastX;
    const dt = now - lastTime;
    velocity = dx / (dt || 1) * 12; // factor de velocidad
    rafId = requestAnimationFrame(animateInertia);
  });
  container.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 1.2; // velocidad
    container.scrollLeft = scrollLeft - walk;
    // Para inercia
    lastX = e.pageX;
    lastTime = Date.now();
  });

  // Soporte para touch
  container.addEventListener('touchstart', (e) => {
    isDown = true;
    startX = e.touches[0].pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
    lastX = e.touches[0].pageX;
    lastTime = Date.now();
    if (rafId) cancelAnimationFrame(rafId);
  });
  container.addEventListener('touchend', (e) => {
    isDown = false;
    // Inercia
    const now = Date.now();
    const dx = (e.changedTouches[0]?.pageX || lastX) - lastX;
    const dt = now - lastTime;
    velocity = dx / (dt || 1) * 12;
    rafId = requestAnimationFrame(animateInertia);
  });
  container.addEventListener('touchmove', (e) => {
    if (!isDown) return;
    const x = e.touches[0].pageX - container.offsetLeft;
    const walk = (x - startX) * 1.2;
    container.scrollLeft = scrollLeft - walk;
    lastX = e.touches[0].pageX;
    lastTime = Date.now();
  });
})();

// Función para inicializar el carrusel
function initCarousel() {
  const track = document.querySelector('.carousel-track');
  const cards = Array.from(document.querySelectorAll('.carousel-card'));
  const btnLeft = document.querySelector('.carousel-chevron-left');
  const btnRight = document.querySelector('.carousel-chevron-right');
  const container = document.querySelector('.carousel-container');
  
  if (!track || !cards.length || !btnLeft || !btnRight || !container) {
    return;
  }

  let currentIndex = 1; // Empieza con la segunda tarjeta centrada
  const total = cards.length;

  function updatePosition() {
    if (window.innerWidth <= 600) {
      // En móvil, usa scrollIntoView para centrar la tarjeta activa
      cards[currentIndex].scrollIntoView({behavior: 'smooth', inline: 'center', block: 'nearest'});
      updateActiveCard();
      return;
    }
    const cardWidth = cards[0].offsetWidth + 32; // gap
    const containerWidth = container.offsetWidth;
    // Centrar la tarjeta actual
    const offset = (cardWidth * currentIndex) - (containerWidth / 2) + (cardWidth / 2);
    track.style.transition = 'transform 0.5s cubic-bezier(.4,1.3,.5,1)';
    track.style.transform = `translateX(${-offset}px)`;
    updateActiveCard();
  }

  function updateActiveCard() {
    if (window.innerWidth <= 600) {
      // En móvil, la tarjeta más visible es la activa
      let minDiff = Infinity;
      let activeIdx = 0;
      const containerRect = container.getBoundingClientRect();
      cards.forEach((card, i) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const containerCenter = containerRect.left + containerRect.width / 2;
        const diff = Math.abs(cardCenter - containerCenter);
        if (diff < minDiff) {
          minDiff = diff;
          activeIdx = i;
        }
      });
      cards.forEach((card, i) => {
        card.classList.remove('active', 'inactive');
        if (i === activeIdx) {
          card.classList.add('active');
        } else {
          card.classList.add('inactive');
        }
      });
      currentIndex = activeIdx;
      return;
    }
    // Desktop: igual que antes
    const containerRect = container.getBoundingClientRect();
    let minDiff = Infinity;
    let activeIdx = 0;
    cards.forEach((card, i) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const containerCenter = containerRect.left + containerRect.width / 2;
      const diff = Math.abs(cardCenter - containerCenter);
      if (diff < minDiff) {
        minDiff = diff;
        activeIdx = i;
      }
    });
    cards.forEach((card, i) => {
      card.classList.remove('active', 'inactive');
      if (i === activeIdx) {
        card.classList.add('active');
      } else {
        card.classList.add('inactive');
      }
    });
    currentIndex = activeIdx;
  }

  btnRight.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % total;
    updatePosition();
  });
  btnLeft.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + total) % total;
    updatePosition();
  });

  // Actualizar la tarjeta activa al hacer scroll manual
  container.addEventListener('scroll', () => {
    updateActiveCard();
  });

  // Inicializar
  updatePosition();
}

(function() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    let valid = true;
    const name = form.querySelector('[name="name"]');
    const email = form.querySelector('[name="email"]');
    const message = form.querySelector('[name="message"]');
    const errors = form.querySelectorAll('.form-error');
    const success = form.querySelector('.form-success');
    errors.forEach(err => err.textContent = '');
    if (success) success.style.display = 'none';

    // Validación nombre
    if (!name.value.trim()) {
      errors[0].textContent = 'Por favor ingresa tu nombre.';
      valid = false;
    }
    // Validación email
    if (!email.value.trim()) {
      errors[1].textContent = 'Por favor ingresa tu correo.';
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email.value.trim())) {
      errors[1].textContent = 'Correo electrónico no válido.';
      valid = false;
    }
    // Validación mensaje
    if (!message.value.trim()) {
      errors[2].textContent = 'Por favor escribe tu mensaje.';
      valid = false;
    }
    if (valid) {
      if (success) {
        success.textContent = '¡Mensaje enviado correctamente!';
        success.style.display = 'block';
      }
      form.reset();
    }
  });
})();

// Agrega más scripts generales aquí según necesidades del template 

// main.js: Funcionalidades principales del sitio

// Cargar secciones modulares
async function loadSection(sectionName, containerId) {
  try {
    const response = await fetch(`sections/${sectionName}.html`);
    const html = await response.text();
    document.getElementById(containerId).innerHTML = html;
  } catch (error) {
    console.error(`Error cargando la sección ${sectionName}:`, error);
  }
}

// Cargar secciones al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  // Cargar sección de contacto
  loadSection('contact', 'contact-section-container');
  
  // Inicializar navegación móvil
  initMobileNav();
  
  // Inicializar carrusel cuando el DOM esté listo
  initCarousel();
});

// Navegación móvil
function initMobileNav() {
  const menuToggle = document.querySelector('.menu-toggle');
  const headerNav = document.querySelector('.header-nav');
  
  if (menuToggle && headerNav) {
    menuToggle.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      headerNav.classList.toggle('nav-open');
    });
  }
}

// Carrusel de Que ofrezco - Eliminada implementación duplicada
// La funcionalidad está manejada por la primera implementación más arriba

// Smooth scroll para enlaces internos
document.addEventListener('DOMContentLoaded', function() {
  const internalLinks = document.querySelectorAll('a[href^="#"]');
  
  internalLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const headerHeight = document.querySelector('.main-header').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});

// Header con efecto de scroll
window.addEventListener('scroll', function() {
  const header = document.querySelector('.main-header');
  if (header) {
    if (window.scrollY > 100) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  }
});

// Animaciones al hacer scroll
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);
  
  // Observar elementos que necesitan animación
  const animatedElements = document.querySelectorAll('.service-feature, .about-card, .testimonial-glass, .carousel-card');
  animatedElements.forEach(el => observer.observe(el));
}

// Inicializar animaciones cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initScrollAnimations);

// Animación scroll-in para sección About
function animateAboutOnScroll() {
  const aboutSection = document.querySelector('.about-section');
  if (!aboutSection) return;
  const aboutImage = aboutSection.querySelector('.about-image');
  const aboutContent = aboutSection.querySelector('.about-content');
  let animated = false;
  const observer = new window.IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        if (aboutImage) aboutImage.classList.add('about-animate-in');
        if (aboutContent) aboutContent.classList.add('about-animate-in');
        animated = true;
        obs.disconnect();
      }
    });
  }, { threshold: 0.05 });
  observer.observe(aboutSection);
}
document.addEventListener('DOMContentLoaded', animateAboutOnScroll);

function animateServiceCardsOnScroll() {
  const servicesSection = document.querySelector('.services-overview-section');
  if (!servicesSection) return;
  const cards = servicesSection.querySelectorAll('.service-feature');
  let animated = false;
  const observer = new window.IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        cards.forEach((card, i) => {
          card.classList.add('service-animate-in');
          if (i === 1) card.classList.add('delay-1');
          if (i === 2) card.classList.add('delay-2');
        });
        animated = true;
        obs.disconnect();
      }
    });
  }, { threshold: 0.05 });
  observer.observe(servicesSection);
}
document.addEventListener('DOMContentLoaded', animateServiceCardsOnScroll);

// Animación scroll-in para carrusel de servicios
function animateCarouselOnScroll() {
  const carouselSection = document.querySelector('.services-carousel-section');
  if (!carouselSection) return;
  
  const cards = carouselSection.querySelectorAll('.carousel-card');
  if (!cards.length) return;
  
  let animated = false;
  const observer = new window.IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        console.log(' Carrusel activado: segunda tarjeta con animación');
        // Activar la segunda tarjeta con animación (índice 1)
        cards.forEach((card, i) => {
          card.classList.remove('active', 'inactive');
          if (i === 1) {
            card.classList.add('active');
          } else {
            card.classList.add('inactive');
          }
        });
        animated = true;
        obs.disconnect();
      }
    });
  }, { threshold: 0.1 });
  
  observer.observe(carouselSection);
}
document.addEventListener('DOMContentLoaded', animateCarouselOnScroll);

function scrubbingAboutCards() {
  const section = document.getElementById('sobre-mi');
  if (!section) return;
  const stack = section.querySelector('.about-cards-stack');
  if (!stack) return;
  const cards = Array.from(stack.querySelectorAll('.about-card'));
  if (!cards.length) return;
  const numCards = cards.length;

  function updateCardsScrub() {
    const sectionRect = section.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const viewportHeight = window.innerHeight;
    const scrollProgress = Math.max(0, Math.min(1, (scrollY + viewportHeight/2 - sectionTop) / (sectionHeight - viewportHeight)));
    const scaledProgress = scrollProgress * numCards * 0.5;

    cards.forEach((card, i) => {
      const center = i + 0.5;
      const distance = Math.abs(scaledProgress - center);
      const progress = Math.max(0, 1 - distance);
      card.style.opacity = Math.pow(progress, 2);
      card.style.transform = `scale(${0.95 + 0.05 * progress})`;
      card.style.zIndex = Math.floor(progress * 10);
      card.style.pointerEvents = progress > 0.8 ? 'auto' : 'none';
    });
  }

  window.addEventListener('scroll', updateCardsScrub);
  window.addEventListener('resize', updateCardsScrub);
  updateCardsScrub();
}
document.addEventListener('DOMContentLoaded', scrubbingAboutCards);

function stackedAboutCards() {
  const section = document.getElementById('sobre-mi');
  if (!section) return;
  const stack = section.querySelector('.about-cards-stack');
  const cards = Array.from(stack.querySelectorAll('.about-card'));
  if (!cards.length) return;
  const numCards = cards.length;
  const cardHeight = 320;
  const offset = 40;

  function updateStackedCards() {
    const sectionRect = section.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const viewportHeight = window.innerHeight;
    // Progreso de scroll dentro de la sección (0 a 1)
    const scrollProgress = Math.max(0, Math.min(1, (scrollY + viewportHeight/2 - sectionTop) / (sectionHeight - viewportHeight)));
    // Índice de la tarjeta activa
    const activeIdx = Math.round(scrollProgress * (numCards - 1));

    cards.forEach((card, i) => {
      card.classList.remove('active');
      card.style.zIndex = (numCards - i).toString();
      card.style.top = (i * offset) + 'px';
      card.style.opacity = '0.85';
      card.style.transform = 'none';
      if (i === activeIdx) {
        card.classList.add('active');
        card.style.zIndex = (numCards + 10).toString();
        card.style.top = '0px';
        card.style.opacity = '1';
        card.style.transform = 'scale(1.02)';
      }
    });
  }

  window.addEventListener('scroll', updateStackedCards);
  window.addEventListener('resize', updateStackedCards);
  updateStackedCards();
}
document.addEventListener('DOMContentLoaded', stackedAboutCards);

function setAboutCardBackgrounds() {
  const isMobile = window.innerWidth <= 600;
  document.querySelectorAll('.about-card').forEach(card => {
    const imgDiv = card.querySelector('.about-card-img img');
    if (isMobile && imgDiv) {
      card.style.backgroundImage = `url('${imgDiv.src}')`;
    } else {
      card.style.backgroundImage = '';
    }
  });
}
document.addEventListener('DOMContentLoaded', setAboutCardBackgrounds);
window.addEventListener('resize', setAboutCardBackgrounds); 