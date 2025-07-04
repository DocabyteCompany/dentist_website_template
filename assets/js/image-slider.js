// image-slider.js: Lógica básica para un slider de imágenes (Vanilla JS)

// Ejemplo de estructura esperada en HTML:
// <div class="image-slider">
//   <button class="slider-prev" aria-label="Anterior">&#8592;</button>
//   <div class="slider-track">
//     <img src="..." class="slider-img" />
//     ...
//   </div>
//   <button class="slider-next" aria-label="Siguiente">&#8594;</button>
// </div>

document.querySelectorAll('.image-slider').forEach(slider => {
  const track = slider.querySelector('.slider-track');
  const images = slider.querySelectorAll('.slider-img');
  const prevBtn = slider.querySelector('.slider-prev');
  const nextBtn = slider.querySelector('.slider-next');
  let current = 0;

  function showImage(idx) {
    images.forEach((img, i) => {
      img.style.display = i === idx ? 'block' : 'none';
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      current = (current - 1 + images.length) % images.length;
      showImage(current);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      current = (current + 1) % images.length;
      showImage(current);
    });
  }

  // Inicializar
  showImage(current);
}); 