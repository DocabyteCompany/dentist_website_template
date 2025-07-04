// chatbot.js: Lógica del chatbot IA (Vanilla JS)

// Elementos principales
const chatbotFab = document.querySelector('.chatbot-fab');
const chatbotWindow = document.querySelector('.chatbot-window');
const chatbotClose = document.querySelector('.chatbot-close');
const chatbotForm = document.querySelector('.chatbot-form');
const chatbotInput = document.querySelector('.chatbot-input');
const chatbotMessages = document.querySelector('.chatbot-messages');

// Función para abrir/cerrar el chat
function toggleChatbot(open) {
  if (!chatbotWindow) return;
  if (open === undefined) {
    chatbotWindow.hidden = !chatbotWindow.hidden;
  } else {
    chatbotWindow.hidden = !open;
  }
  if (!chatbotWindow.hidden) {
    if (chatbotInput) chatbotInput.focus();
  } else {
    if (chatbotFab) chatbotFab.focus();
  }
}

if (chatbotFab) {
  chatbotFab.addEventListener('click', () => toggleChatbot(true));
}
if (chatbotClose) {
  chatbotClose.addEventListener('click', () => toggleChatbot(false));
}
// Accesibilidad: cerrar con Escape
if (chatbotWindow) {
  chatbotWindow.addEventListener('keydown', e => {
    if (e.key === 'Escape') toggleChatbot(false);
  });
}

// Enviar mensaje
if (chatbotForm) {
  chatbotForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const msg = chatbotInput.value.trim();
    if (!msg) return;
    addMessage(msg, 'user');
    chatbotInput.value = '';
    chatbotInput.focus();
    // Simular respuesta IA (reemplaza por integración real con API)
    setTimeout(() => {
      addMessage('¡Hola! Soy tu asistente IA. ¿En qué puedo ayudarte?', 'ia');
    }, 800);
  });
}

// Función para agregar mensajes al chat
function addMessage(text, sender) {
  if (!chatbotMessages) return;
  const msgDiv = document.createElement('div');
  if (sender === 'ia') {
    msgDiv.className = 'chatbot-message chatbot-message-ai';
    msgDiv.innerHTML = `
      <div class="message-content chatbot-message-row">
        <div class="chatbot-avatar-empty"></div>
        <div class="chatbot-message-text">
          <p>${text}</p>
        </div>
      </div>
    `;
  } else if (sender === 'user') {
    msgDiv.className = 'chatbot-message user';
    msgDiv.innerHTML = `<div class="chatbot-message-text"><p>${text}</p></div>`;
  } else {
    msgDiv.className = 'chatbot-message';
    msgDiv.textContent = text;
  }
  chatbotMessages.appendChild(msgDiv);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  chatbotMessages.setAttribute('aria-live', 'polite');
}

// Cerrar chat al hacer click fuera de la ventana (opcional)
document.addEventListener('click', function(e) {
  if (
    chatbotWindow &&
    !chatbotWindow.hidden &&
    !chatbotWindow.contains(e.target) &&
    chatbotFab &&
    !chatbotFab.contains(e.target)
  ) {
    toggleChatbot(false);
  }
});

// Mejora: aquí puedes integrar la API real de IA usando fetch/AJAX
// function sendToIA(msg) {
//   fetch('URL_API', { method: 'POST', body: JSON.stringify({ message: msg }) })
//     .then(res => res.json())
//     .then(data => addMessage(data.reply, 'ia'));
// }

document.addEventListener('DOMContentLoaded', function() {
  const chatbotWindow = document.getElementById('chatbot-window');
  const chatbotFab = document.getElementById('chatbot-fab');
  const chatbotClose = document.getElementById('chatbot-close');
  const chatbotInputContainer = document.getElementById('chatbot-input-container');

  // Ocultar chatbot window completamente en móvil al cargar
  if (window.innerWidth <= 600 && chatbotWindow) {
    chatbotWindow.style.display = 'none';
  }

  function expandChatbot() {
    // Si el chatbot está oculto por display: none, mostrarlo
    if (chatbotWindow.style.display === 'none') {
      chatbotWindow.style.display = '';
    }
    chatbotWindow.classList.remove('chatbot-collapsed');
    chatbotInputContainer.style.display = '';
    chatbotFab.classList.add('active');
    chatbotWindow.setAttribute('aria-hidden', 'false');
    showSecondMessage();
    // Bounce animación al FAB cuando se abre el chatbot
    if (window.innerWidth <= 600) {
      chatbotFab.classList.add('bounce-anim');
      setTimeout(() => chatbotFab.classList.remove('bounce-anim'), 700);
    }
  }

  function collapseChatbot() {
    chatbotWindow.classList.add('chatbot-collapsed');
    chatbotInputContainer.style.display = 'none';
    chatbotFab.classList.remove('active');
    chatbotWindow.setAttribute('aria-hidden', 'true');
    hideSecondMessage();
  }

  // Alternar al hacer click en el FAB
  chatbotFab.addEventListener('click', function() {
    // Si el chatbot está completamente oculto, mostrarlo
    if (chatbotWindow.style.display === 'none') {
      chatbotWindow.style.display = '';
      expandChatbot();
    } else if (chatbotWindow.classList.contains('chatbot-collapsed')) {
      expandChatbot();
    } else {
      collapseChatbot();
    }
  });

  // Cerrar con el botón de cerrar (tache)
  if (chatbotClose) {
    chatbotClose.addEventListener('click', function() {
      if (chatbotWindow.classList.contains('chatbot-collapsed')) {
        chatbotWindow.style.display = 'none';
      } else {
        collapseChatbot();
      }
    });
  }

  // Mostrar el segundo mensaje solo cuando el chatbot está extendido
  const chatbotSecondMessage = document.getElementById('chatbot-second-message');

  function showSecondMessage() {
    if (chatbotSecondMessage) chatbotSecondMessage.style.display = 'block';
  }
  function hideSecondMessage() {
    if (chatbotSecondMessage) chatbotSecondMessage.style.display = 'none';
  }

  // Inicialmente colapsado
  collapseChatbot();

  // Mostrar chatbot window después de 5 segundos solo en móvil
  if (window.innerWidth <= 600 && chatbotWindow) {
    setTimeout(() => {
      chatbotWindow.style.display = '';
      // No expandir automáticamente, solo mostrar
    }, 5000);
  }

  // Botones de acción
  const btnAgendar = document.getElementById('btn-agendar');
  const btnConsulta = document.getElementById('btn-consulta');
  const btnDocabyte = document.getElementById('btn-docabyte');

  if (btnAgendar) {
    btnAgendar.addEventListener('click', function() {
      appendChatbotMessage('En un momento te llamaremos a tu número y agendaremos una cita.');
    });
  }
  if (btnConsulta) {
    btnConsulta.addEventListener('click', function() {
      appendChatbotMessage('Pregúntame lo que necesites y con gusto te respondo. En caso de ser algo sensible, te agendo una cita con el doctor.');
    });
  }
  if (btnDocabyte) {
    btnDocabyte.addEventListener('click', function() {
      window.open('https://www.docabyte.com', '_blank');
    });
  }

  function appendChatbotMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'chatbot-message chatbot-message-ai';
    msg.innerHTML = `
      <div class="message-content chatbot-message-row">
        <div class="chatbot-avatar-empty"></div>
        <div class="chatbot-message-text">
          <p>${text}</p>
        </div>
      </div>
    `;
    chatbotMessages.appendChild(msg);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  window.expandChatbot = expandChatbot;
}); 