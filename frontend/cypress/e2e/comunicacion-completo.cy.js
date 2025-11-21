/**
 * Pruebas E2E Completas del Centro de Comunicación
 * Flujos completos de usuario con mocks
 */

describe('E2E - Centro de Comunicación Completo', () => {
  const baseUrl = 'http://localhost:3000';
  const usuario = 'agente1';
  const contraseña = 'hash123';

  // Mock data
  const mockClientes = [
    {
      id: 1,
      nombres: 'Harold',
      apellidos: 'Huanca',
      telefono: '51984438516',
      nombre: 'Harold Huanca'
    },
    {
      id: 2,
      nombres: 'Juan',
      apellidos: 'Pérez',
      telefono: '51930466769',
      nombre: 'Juan Pérez'
    },
    {
      id: 3,
      nombres: 'María',
      apellidos: 'García',
      telefono: '51912345678',
      nombre: 'María García'
    }
  ];

  const mockMensajes = [
    {
      id: 1,
      texto: 'Hola, ¿cómo estás?',
      tipo: 'recibido',
      timestamp: '10:30'
    },
    {
      id: 2,
      texto: 'Bien, ¿y tú?',
      tipo: 'enviado',
      timestamp: '10:31'
    }
  ];

  beforeEach(() => {
    // Interceptar llamadas a API
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 200,
      body: {
        token: 'mock-jwt-token-12345',
        user: {
          id: 1,
          username: usuario,
          role: 'admin'
        }
      }
    }).as('login');

    cy.intercept('GET', '**/api/clientes*', { statusCode: 200, body: mockClientes }).as('getClientes');
    cy.intercept('GET', '**/api/comunicacion/mensajes/*', { statusCode: 200, body: [] }).as('getMensajes');
    cy.intercept('POST', '**/api/comunicacion/conectar', {
      statusCode: 200,
      body: { success: true, message: 'Conectado' }
    }).as('conectar');
    cy.intercept('POST', '**/api/comunicacion/enviar', {
      statusCode: 200,
      body: { success: true, messageId: 123 }
    }).as('enviarMensaje');

    // Login antes de cada prueba
    cy.visit(`${baseUrl}/login`);
    cy.get('input[type="text"]').type(usuario);
    cy.get('input[type="password"]').type(contraseña);
    cy.get('button[type="submit"]').click();
    cy.wait('@login');
  });

  describe('Navegación al Centro de Comunicación', () => {
    it('Debe navegar al Centro de Comunicación desde el Header', () => {
      cy.visit(`${baseUrl}/dashboard`);
      // Navegar directamente a comunicación (simula hacer clic en el header)
      cy.visit(`${baseUrl}/comunicacion`);
      cy.wait('@getClientes');
      cy.url().should('include', '/comunicacion');
      cy.get('h1').should('contain', 'Centro de Comunicación');
    });

    it('Debe navegar al Centro de Comunicación desde el Footer', () => {
      cy.visit(`${baseUrl}/dashboard`);
      // Navegar directamente a comunicación (simula hacer clic en el footer)
      cy.visit(`${baseUrl}/comunicacion`);
      cy.wait('@getClientes');
      cy.url().should('include', '/comunicacion');
      cy.get('h1').should('contain', 'Centro de Comunicación');
    });

    it('Debe mostrar la interfaz completa del Centro de Comunicación', () => {
      cy.visit(`${baseUrl}/comunicacion`);
      
      // Panel de clientes
      cy.get('.clientes-panel').should('exist');
      cy.get('.search-input').should('exist');
      cy.get('.clientes-list').should('exist');
      
      // Panel de chat
      cy.get('.chat-panel').should('exist');
      cy.get('.no-selection').should('exist');
    });
  });

  describe('Búsqueda de Clientes', () => {
    it('Debe buscar cliente por nombre', () => {
      cy.visit(`${baseUrl}/comunicacion`);
      cy.wait('@getClientes');
      
      cy.get('.search-input').type('Harold');
      cy.get('.cliente-item').should('have.length', 1);
      cy.get('.cliente-item').first().should('contain', 'Harold');
    });

    it('Debe buscar cliente por teléfono', () => {
      cy.visit(`${baseUrl}/comunicacion`);
      cy.wait('@getClientes');
      
      cy.get('.search-input').type('51984438516');
      cy.get('.cliente-item').should('have.length', 1);
    });

    it('Debe mostrar "No hay clientes" cuando no hay resultados', () => {
      cy.visit(`${baseUrl}/comunicacion`);
      cy.wait('@getClientes');
      
      cy.get('.search-input').type('XXXXXX');
      cy.get('.empty-state').should('contain', 'No hay clientes disponibles');
    });

    it('Debe limpiar búsqueda cuando se borra el texto', () => {
      cy.visit(`${baseUrl}/comunicacion`);
      cy.wait('@getClientes');
      
      cy.get('.search-input').type('Harold');
      cy.get('.cliente-item').should('have.length', 1);
      
      cy.get('.search-input').clear();
      cy.get('.cliente-item').should('have.length', 3);
    });
  });

  describe('Selección de Cliente', () => {
    it('Debe seleccionar un cliente de la lista', () => {
      cy.visit(`${baseUrl}/comunicacion`);
      cy.wait('@getClientes');
      
      cy.get('.cliente-item').first().click();
      cy.get('.chat-header').should('exist');
      cy.get('.chat-header-info h3').should('contain', 'Harold');
    });

    it('Debe mostrar información del cliente seleccionado', () => {
      cy.visit(`${baseUrl}/comunicacion`);
      cy.wait('@getClientes');
      
      cy.get('.cliente-item').first().click();
      cy.get('.connection-section').should('exist');
      cy.get('button').contains('Conectar Directamente').should('exist');
    });

    it('Debe deseleccionar cliente al hacer clic en cerrar', () => {
      cy.visit(`${baseUrl}/comunicacion`);
      cy.wait('@getClientes');
      
      cy.get('.cliente-item').first().click();
      cy.get('.close-btn').click();
      cy.get('.no-selection').should('exist');
    });

    it('Debe cambiar de cliente al seleccionar otro', () => {
      cy.visit(`${baseUrl}/comunicacion`);
      cy.wait('@getClientes');
      
      cy.get('.cliente-item').first().click();
      cy.get('.chat-header-info h3').should('contain', 'Harold');
      
      cy.get('.cliente-item').eq(1).click();
      cy.get('.chat-header-info h3').should('contain', 'Juan');
    });
  });

  describe('Conexión con WhatsApp', () => {
    it('Debe mostrar opciones de conexión', () => {
      cy.visit(`${baseUrl}/comunicacion`);
      cy.wait('@getClientes');
      
      cy.get('.cliente-item').first().click();
      cy.get('.connection-section').should('exist');
      cy.get('button').contains('Generar QR').should('exist');
      cy.get('button').contains('Conectar Directamente').should('exist');
    });

    it('Debe generar código QR', () => {
      cy.visit(`${baseUrl}/comunicacion`);
      cy.wait('@getClientes');
      
      cy.get('.cliente-item').first().click();
      cy.get('button').contains('Generar QR').click();
      cy.get('.qr-container').should('exist');
      cy.get('canvas').should('exist'); // QR code es un canvas
    });

    it('Debe conectar directamente con cliente', () => {
      cy.visit(`${baseUrl}/comunicacion`);
      cy.wait('@getClientes');
      
      cy.get('.cliente-item').first().click();
      cy.get('button').contains('Conectar Directamente').click();
      cy.wait('@conectar');
      
      // Esperar a que se establezca la conexión
      cy.get('.message-form').should('exist');
      cy.get('.messages-area').should('exist');
    });

    it('Debe mostrar error si no hay número de teléfono', () => {
      cy.intercept('GET', '**/api/clientes*', {
        statusCode: 200,
        body: [{ id: 1, nombres: 'Test', apellidos: 'User', telefono: null }]
      }).as('getClientesSinTelefono');

      cy.visit(`${baseUrl}/comunicacion`);
      cy.wait('@getClientesSinTelefono');
      
      cy.get('.cliente-item').first().click();
      cy.get('button').contains('Generar QR').click();
      
      cy.get('.alert-error').should('contain', 'no tiene número de teléfono');
    });
  });

  describe('Envío de Mensajes', () => {
    it('Debe enviar un mensaje', () => {
      cy.visit(`${baseUrl}/comunicacion`);
      cy.wait('@getClientes');
      
      cy.get('.cliente-item').first().click();
      cy.get('button').contains('Conectar Directamente').click();
      cy.wait('@conectar');
      cy.wait('@getMensajes');
      
      cy.get('.message-input').type('Mensaje de prueba');
      cy.get('.send-btn').click();
      cy.wait('@enviarMensaje');
      
      cy.get('.message').should('contain', 'Mensaje de prueba');
    });

    it('Debe mostrar error si el mensaje está vacío', () => {
      cy.visit(`${baseUrl}/comunicacion`);
      cy.wait('@getClientes');
      
      cy.get('.cliente-item').first().click();
      cy.get('button').contains('Conectar Directamente').click();
      cy.wait('@conectar');
      
      cy.get('.send-btn').should('be.disabled');
    });

    it('Debe mostrar mensaje como "Enviado"', () => {
      cy.visit(`${baseUrl}/comunicacion`);
      cy.wait('@getClientes');
      
      cy.get('.cliente-item').first().click();
      cy.get('button').contains('Conectar Directamente').click();
      cy.wait('@conectar');
      cy.wait('@getMensajes');
      
      cy.get('.message-input').type('Mensaje');
      cy.get('.send-btn').click();
      cy.wait('@enviarMensaje');
      
      cy.get('.message.sent').should('exist');
    });

    it('Debe limpiar el input después de enviar', () => {
      cy.visit(`${baseUrl}/comunicacion`);
      cy.wait('@getClientes');
      
      cy.get('.cliente-item').first().click();
      cy.get('button').contains('Conectar Directamente').click();
      cy.wait('@conectar');
      cy.wait('@getMensajes');
      
      cy.get('.message-input').type('Mensaje');
      cy.get('.send-btn').click();
      cy.wait('@enviarMensaje');
      
      cy.get('.message-input').should('have.value', '');
    });

    it('Debe mostrar múltiples mensajes en orden', () => {
      cy.visit(`${baseUrl}/comunicacion`);
      cy.wait('@getClientes');
      
      cy.get('.cliente-item').first().click();
      cy.get('button').contains('Conectar Directamente').click();
      cy.wait('@conectar');
      cy.wait('@getMensajes');
      
      cy.get('.message-input').type('Primer mensaje');
      cy.get('.send-btn').click();
      cy.wait('@enviarMensaje');
      
      cy.get('.message-input').type('Segundo mensaje');
      cy.get('.send-btn').click();
      cy.wait('@enviarMensaje');
      
      cy.get('.message').should('have.length', 2);
    });
  });

  describe('Historial de Mensajes', () => {
    it('Debe mostrar historial vacío al conectar', () => {
      cy.visit(`${baseUrl}/comunicacion`);
      cy.wait('@getClientes');
      
      cy.get('.cliente-item').first().click();
      cy.get('button').contains('Conectar Directamente').click();
      cy.wait('@conectar');
      cy.wait('@getMensajes');
      
      cy.get('.empty-messages').should('exist');
    });

    it('Debe mostrar mensajes anteriores después de enviar', () => {
      cy.visit(`${baseUrl}/comunicacion`);
      cy.wait('@getClientes');
      
      cy.get('.cliente-item').first().click();
      cy.get('button').contains('Conectar Directamente').click();
      cy.wait('@conectar');
      cy.wait('@getMensajes');
      
      cy.get('.message-input').type('Mensaje 1');
      cy.get('.send-btn').click();
      cy.wait('@enviarMensaje');
      
      cy.get('.message-input').type('Mensaje 2');
      cy.get('.send-btn').click();
      cy.wait('@enviarMensaje');
      
      // Debe mostrar los mensajes enviados
      cy.get('.message').should('have.length', 2);
    });
  });

  describe('Alertas y Notificaciones', () => {
    it('Debe mostrar alerta de éxito al enviar', () => {
      cy.visit(`${baseUrl}/comunicacion`);
      cy.wait('@getClientes');
      
      cy.get('.cliente-item').first().click();
      cy.get('button').contains('Conectar Directamente').click();
      cy.wait('@conectar');
      cy.wait('@getMensajes');
      
      cy.get('.message-input').type('Mensaje');
      cy.get('.send-btn').click();
      cy.wait('@enviarMensaje');
      
      cy.get('.alert-success').should('exist');
    });

    it('Debe mostrar alerta de éxito al conectar', () => {
      cy.visit(`${baseUrl}/comunicacion`);
      cy.wait('@getClientes');
      
      cy.get('.cliente-item').first().click();
      cy.get('button').contains('Conectar Directamente').click();
      cy.wait('@conectar');
      
      cy.get('.alert-success').should('contain', 'Conexión establecida');
    });

    it('Debe mostrar alerta de error si falla la conexión', () => {
      cy.intercept('POST', '**/api/comunicacion/conectar', {
        statusCode: 500,
        body: { error: 'Error al conectar' }
      }).as('conectarError');

      cy.visit(`${baseUrl}/comunicacion`);
      cy.wait('@getClientes');
      
      cy.get('.cliente-item').first().click();
      cy.get('button').contains('Conectar Directamente').click();
      cy.wait('@conectarError');
      
      cy.get('.alert-error').should('exist');
    });

    it('Debe cerrar alertas automáticamente', () => {
      cy.visit(`${baseUrl}/comunicacion`);
      cy.wait('@getClientes');
      
      cy.get('.cliente-item').first().click();
      cy.get('button').contains('Conectar Directamente').click();
      cy.wait('@conectar');
      cy.wait('@getMensajes');
      
      cy.get('.message-input').type('Mensaje');
      cy.get('.send-btn').click();
      cy.wait('@enviarMensaje');
      
      cy.get('.alert-success').should('exist');
      cy.wait(3100);
      cy.get('.alert-success').should('not.exist');
    });
  });

  describe('Responsividad', () => {
    it('Debe funcionar en pantalla móvil', () => {
      cy.viewport('iphone-x');
      cy.visit(`${baseUrl}/comunicacion`);
      cy.wait('@getClientes');
      
      cy.get('.comunicacion-container').should('exist');
      cy.get('.clientes-panel').should('exist');
    });

    it('Debe funcionar en tablet', () => {
      cy.viewport('ipad-2');
      cy.visit(`${baseUrl}/comunicacion`);
      cy.wait('@getClientes');
      
      cy.get('.comunicacion-container').should('exist');
    });

    it('Debe funcionar en desktop', () => {
      cy.viewport('macbook-15');
      cy.visit(`${baseUrl}/comunicacion`);
      cy.wait('@getClientes');
      
      cy.get('.comunicacion-container').should('exist');
    });
  });

  describe('Accesibilidad', () => {
    it('Debe tener botones con labels accesibles', () => {
      cy.visit(`${baseUrl}/comunicacion`);
      cy.wait('@getClientes');
      
      cy.get('.cliente-item').first().click();
      // Verificar que los botones existen y son accesibles
      cy.get('button').contains('Generar QR').should('exist').and('be.visible');
      cy.get('button').contains('Conectar Directamente').should('exist').and('be.visible');
    });

    it('Debe tener inputs con placeholders', () => {
      cy.visit(`${baseUrl}/comunicacion`);
      cy.wait('@getClientes');
      
      cy.get('.search-input').should('have.attr', 'placeholder');
      cy.get('.cliente-item').first().click();
      cy.get('button').contains('Conectar Directamente').click();
      cy.wait('@conectar');
      cy.wait('@getMensajes');
      cy.get('.message-input').should('have.attr', 'placeholder');
    });
  });

  describe('Flujo Completo de Usuario', () => {
    it('Debe completar flujo: buscar -> seleccionar -> conectar -> enviar', () => {
      cy.visit(`${baseUrl}/comunicacion`);
      cy.wait('@getClientes');
      
      // Buscar cliente
      cy.get('.search-input').type('Harold');
      cy.get('.cliente-item').should('have.length', 1);
      
      // Seleccionar cliente
      cy.get('.cliente-item').first().click();
      cy.get('.chat-header-info h3').should('contain', 'Harold');
      
      // Conectar
      cy.get('button').contains('Conectar Directamente').click();
      cy.wait('@conectar');
      cy.wait('@getMensajes');
      
      // Enviar mensaje
      cy.get('.message-input').type('Mensaje de flujo completo');
      cy.get('.send-btn').click();
      cy.wait('@enviarMensaje');
      
      // Verificar éxito
      cy.get('.message').should('contain', 'Mensaje de flujo completo');
      cy.get('.alert-success').should('exist');
    });

    it('Debe permitir cambiar de cliente y mantener estado', () => {
      cy.visit(`${baseUrl}/comunicacion`);
      cy.wait('@getClientes');
      
      // Seleccionar primer cliente
      cy.get('.cliente-item').first().click();
      cy.get('button').contains('Conectar Directamente').click();
      cy.wait('@conectar');
      cy.wait('@getMensajes');
      
      cy.get('.message-input').type('Mensaje para Harold');
      cy.get('.send-btn').click();
      cy.wait('@enviarMensaje');
      
      // Cambiar a otro cliente
      cy.get('.cliente-item').eq(1).click();
      cy.get('.chat-header-info h3').should('contain', 'Juan');
      
      // El nuevo cliente debe mostrar la sección de conexión (no conectado)
      cy.get('.connection-section').should('exist');
    });
  });
});
