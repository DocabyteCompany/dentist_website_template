// contact-form.js: Funcionalidad del formulario de contacto moderno

document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.querySelector('.contacto-formulario');
  const successMessage = document.querySelector('.success-message');
  const errorMessage = document.querySelector('.error-message');
  
  if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
  }
  
  // Manejar el envío del formulario
  function handleFormSubmit(e) {
    e.preventDefault();
    
    // Ocultar mensajes previos
    hideMessages();
    
    // Validar el formulario
    if (validateForm()) {
      // Simular envío (aquí iría la lógica real de envío)
      showLoadingState();
      
      setTimeout(() => {
        hideLoadingState();
        showSuccessMessage();
        resetForm();
      }, 2000);
    }
  }
  
  // Validar campos del formulario
  function validateForm() {
    const inputs = contactForm.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
      if (!input.value.trim()) {
        showFieldError(input, 'Este campo es requerido');
        isValid = false;
      } else {
        clearFieldError(input);
        
        // Validaciones específicas
        if (input.type === 'email' && !isValidEmail(input.value)) {
          showFieldError(input, 'Por favor ingresa un email válido');
          isValid = false;
        }
        
        if (input.type === 'tel' && !isValidPhone(input.value)) {
          showFieldError(input, 'Por favor ingresa un número de teléfono válido');
          isValid = false;
        }
      }
    });
    
    return isValid;
  }
  
  // Validar formato de email
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  // Validar formato de teléfono
  function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }
  
  // Mostrar error en campo específico
  function showFieldError(input, message) {
    const fieldWrapper = input.closest('.fs-field');
    const existingError = fieldWrapper.querySelector('.field-error');
    
    if (existingError) {
      existingError.textContent = message;
    } else {
      const errorElement = document.createElement('div');
      errorElement.className = 'field-error';
      errorElement.textContent = message;
      fieldWrapper.appendChild(errorElement);
    }
    
    input.classList.add('error');
  }
  
  // Limpiar error de campo
  function clearFieldError(input) {
    const fieldWrapper = input.closest('.fs-field');
    const errorElement = fieldWrapper.querySelector('.field-error');
    
    if (errorElement) {
      errorElement.remove();
    }
    
    input.classList.remove('error');
  }
  
  // Mostrar estado de carga
  function showLoadingState() {
    const submitBtn = contactForm.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span class="loading-spinner"></span>
      <span>Enviando...</span>
    `;
    
    // Guardar el texto original para restaurarlo después
    submitBtn.dataset.originalText = originalText;
  }
  
  // Ocultar estado de carga
  function hideLoadingState() {
    const submitBtn = contactForm.querySelector('.btn-submit');
    const originalText = submitBtn.dataset.originalText;
    
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
  
  // Mostrar mensaje de éxito
  function showSuccessMessage() {
    if (successMessage) {
      successMessage.style.display = 'block';
      contactForm.style.display = 'none';
      
      // Ocultar mensaje después de 5 segundos
      setTimeout(() => {
        hideMessages();
        contactForm.style.display = 'block';
      }, 5000);
    }
  }
  
  // Mostrar mensaje de error
  function showErrorMessage(message = 'Ha ocurrido un error. Por favor, intenta de nuevo.') {
    if (errorMessage) {
      errorMessage.textContent = message;
      errorMessage.style.display = 'block';
      
      // Ocultar mensaje después de 5 segundos
      setTimeout(() => {
        errorMessage.style.display = 'none';
      }, 5000);
    }
  }
  
  // Ocultar todos los mensajes
  function hideMessages() {
    if (successMessage) successMessage.style.display = 'none';
    if (errorMessage) errorMessage.style.display = 'none';
  }
  
  // Resetear formulario
  function resetForm() {
    contactForm.reset();
    
    // Limpiar errores de campos
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      clearFieldError(input);
    });
  }
  
  // Limpiar errores al escribir en los campos
  const inputs = contactForm.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      if (input.value.trim()) {
        clearFieldError(input);
      }
    });
    
    input.addEventListener('blur', () => {
      if (input.hasAttribute('required') && !input.value.trim()) {
        showFieldError(input, 'Este campo es requerido');
      }
    });
  });

  // Cambios para el botón de agendar consulta y chatbot
  const agendarBtn = document.querySelector('.fs-button');
  const contactoFormulario = document.querySelector('.contacto-formulario');
  console.log('agendarBtn:', agendarBtn);
  console.log('contactoFormulario:', contactoFormulario);

  if (agendarBtn && contactoFormulario) {
    agendarBtn.disabled = false;
    agendarBtn.style.cursor = '';
    agendarBtn.style.opacity = '';
    agendarBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Click en Agendar consulta');
      // Validar antes de abrir el chatbot
      if (!validateForm()) {
        console.log('Formulario inválido');
        return;
      }
      // Obtener datos
      const nombre = contactoFormulario.querySelector('#nombre').value.trim();
      const apellido = contactoFormulario.querySelector('#apellido').value.trim();
      const telefono = contactoFormulario.querySelector('#telefono').value.trim();
      const email = contactoFormulario.querySelector('#email').value.trim();
      console.log({nombre, apellido, telefono, email});
      // Formatear mensaje con saltos de línea
      let mensaje = `Voy a proceder a agendarte una cita, por favor confirma tus datos:\n\nNombre: ${nombre}\nApellido: ${apellido}\nTeléfono: ${telefono}\nCorreo electrónico: ${email}`;
      mensaje = mensaje.replace(/\n/g, '<br>');
      // Expandir y mostrar el chatbot SOLO una vez
      if (window.expandChatbot) {
        window.expandChatbot();
      } else if (typeof toggleChatbot === 'function') {
        toggleChatbot(true);
      }
      // Solo enviar el mensaje una vez
      if (window.addMessage) {
        window.addMessage(mensaje, 'ia');
      } else if (typeof addMessage === 'function') {
        addMessage(mensaje, 'ia');
      }
    });
  }
});

// Estilos CSS adicionales para los estados del formulario
const additionalStyles = `
  .field-error {
    color: #dc2626;
    font-size: 0.875rem;
    margin-top: 4px;
    font-weight: 500;
  }
  
  .form-input.error,
  .form-textarea.error {
    border-color: #dc2626;
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
  }
  
  .loading-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .btn-submit:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none !important;
  }
`;

// Agregar estilos al documento
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet); 