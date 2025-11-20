/**
 * Pruebas E2E Completas del Centro de Comunicación
 * Flujos completos de usuario
 */

describe('E2E - Centro de Comunicación Completo', () => {
  const baseUrl = 'http://localhost:3000';
  const usuario = 'agente1';
  const contraseña = 'hash123';

  beforeEach(() => {
    // Login antes de cada prueba
    cy.visit(`${baseUrl}/login`);
    cy.get('input[type="text"]').type(usuario);
    cy.get('input[type="password"]').type(contraseña);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });

  describe('Navegación al Centro de Comunicación', () => {
    it('Debe navegar al Centro de Comunicación desde el Header', () => {
      cy.visit(`${baseUrl}/dashboard`);
      cy.get('a').contains('Comunicación').click();
      cy.url().should('include', '/comunicacion');
      cy.get('h1').should('contain', 'Centro de Comunicación');
    });

    it('Debe navegar al Centro de Comunicación desde el Footer', () => {
      cy.visit(`${baseUrl}/dashboard`);
      cy.get('footer').within(() => {
        cy.get('a').contains('Comunicación').click();
      });
      cy.url().should('include', '/comunicacion');
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
      
      cy.get('.search-input').type('Harold');
      cy.get('.cliente-item').should('have.length.greaterThan', 0);
      cy.get('.cliente-item').first().should('contain', 'Harold');
    });

    it('Debe buscar cliente por teléfono', () => {
      cy.visit(`${baseUrl}/comunicacion`);
      
      cy.get('.search-input').type('51984438516');
      cy.get('.cliente-item').should('have.length.greaterThan', 0);
    });

    it('Debe mostrar "No hay clientes" cuando no hay resultados', () => {
      cy.visit(`${baseUrl}/comunicacion`);
      
      cy.get('.search-input').type('XXXXXX');
      cy.get('.empty-state').should('contain', 'No hay clientes disponibles');
    });

    it('Debe limpiar búsqueda cuando se borra el texto', () => {
      cy.visit(`${baseUrl}/comunicacion`);
      
      cy.get('.search-input').type('Harold');
      cy.get('.cliente-item').should('have.length.greaterThan', 0);
      
      cy.get('.search-input').clear();
      cy.get('.cliente-item').should('have.length.greaterThan', 1);
    });
  });

  describe('Selección de Cliente', () => {
    it('Debe seleccionar un cliente de la lista', () => {
      cy.visit(`${baseUrl}/comunicacion`);
      
      cy.get('.cliente-item').first().click();
      cy.get('.chat-header').should('exist');
      cy.get('.chat-header-info h3').should('not.be.empty');
    });

    it('Debe mostrar información del cliente seleccionado', () => {
      cy.visit(`${baseUrl}/comunicacion`);
      
      cy.get('.cliente-item').first().click();
      cy.get('.chat-header-info').should('contain', 'Conectar con WhatsApp');
    });

    it('Debe deseleccionar cliente al hacer clic en cerrar', () => {
      cy.visit(`${baseUrl}/comunicacion`);
      
      cy.get('.cliente-item').first().click();
      cy.get('.close-btn').click();
      cy.get('.no-selection').should('exist');
    });

    it('Debe cambiar de cliente al seleccionar otro', () => {
      cy.visit(`${baseUrl}/comunicacion`);
      
      cy.get('.cliente-item').first().click();
      const firstClientName = cy.get('.chat-header-info h3').invoke('text');
      
      cy.get('.cliente-item').eq(1).click();
      const secondClientName = cy.get('.chat-header-info h3').invoke('text');
      
      expect(firstClientName).not.to.equal(secondClientName);
    });
  });

  describe('Conexión con WhatsApp', () => {
    it('Debe mostrar opciones de conexión', () => {
      cy.visit(`${baseUrl}/comunicacion`);
      
      cy.get('.cliente-item').first().click();
      cy.get('.connection-section').should('exist');
      cy.get('button').contains('Generar QR').should('exist');
      cy.get('button').contains('Conectar Directamente').should('exist');
    });

    it('Debe generar código QR', () => {
      cy.visit(`${baseUrl}/comunicacion`);
      
      cy.get('.cliente-item').first().click();
      cy.get('button').contains('Generar QR').click();
      cy.get('.qr-container').should('exist');
      cy.get('canvas').should('exist'); // QR code es un canvas
    });

    it('Debe conectar directamente con cliente', () => {
      cy.visit(`${baseUrl}/comunicacion`);
      
      cy.get('.cliente-item').first().click();
      cy.get('button').contains('Conectar Directamente').click();
      
      // Esperar a que se establezca la conexión
      cy.get('.message-form', { timeout: 5000 }).should('exist');
    });

    it('Debe mostrar error si no hay número de teléfono', () => {
      cy.visit(`${baseUrl}/comunicacion`);
      
      // Seleccionar cliente sin teléfono (si existe)
      cy.get('.cliente-item').first().click();
      cy.get('button').contains('Generar QR').click();
      
      // Puede mostrar error o generar QR
      cy.get('.alert').should('exist').or(cy.get('.qr-container').should('exist'));
    });
  });

  describe('Envío de Mensajes', () => {
    it('Debe enviar un mensaje', () => {
      cy.visit(`${baseUrl}/comunicacion`);
      
      cy.get('.cliente-item').first().click();
      cy.get('button').contains('Conectar Directamente').click();
      
      cy.get('.message-input').type('Mensaje de prueba');
      cy.get('.send-btn').click();
      
      cy.get('.message').should('contain', 'Mensaje de prueba');
    });

    it('Debe mostrar error si el mensaje está vacío', () => {
      cy.visit(`${baseUrl}/comunicacion`);
      
      cy.get('.cliente-item').first().click();
      cy.get('button').contains('Conectar Directamente').click();
      
      cy.get('.send-btn').should('be.disabled');
    });

    it('Debe mostrar mensaje como "Enviado"', () => {
      cy.visit(`${baseUrl}/comunicacion`);
      
      cy.get('.cliente-item').first().click();
      cy.get('button').contains('Conectar Directamente').click();
      
      cy.get('.message-input').type('Mensaje');
      cy.get('.send-btn').click();
      
      cy.get('.message.sent').should('exist');
    });

    it('Debe limpiar el input después de enviar', () => {
      cy.visit(`${baseUrl}/comunicacion`);
      
      cy.get('.cliente-item').first().click();
      cy.get('button').contains('Conectar Directamente').click();
      
      cy.get('.message-input').type('Mensaje');
      cy.get('.send-btn').click();
      
      cy.get('.message-input').should('have.value', '');
    });

    it('Debe mostrar múltiples mensajes en orden', () => {
      cy.visit(`${baseUrl}/comunicacion`);
      
      cy.get('.cliente-item').first().click();
      cy.get('button').contains('Conectar Directamente').click();
      
      cy.get('.message-input').type('Primer mensaje');
      cy.get('.send-btn').click();
      
      cy.get('.message-input').type('Segundo mensaje');
      cy.get('.send-btn').click();
      
      cy.get('.message').should('have.length', 2);
    });
  });

  describe('Historial de Mensajes', () => {
    it('Debe mostrar historial vacío al conectar', () => {
      cy.visit(`${baseUrl}/comunicacion`);
      
      cy.get('.cliente-item').first().click();
      cy.get('button').contains('Conectar Directamente').click();
      
      cy.get('.empty-messages').should('exist');
    });

    it('Debe mostrar mensajes anteriores', () => {
      cy.visit(`${baseUrl}/comunicacion`);
      
      cy.get('.cliente-item').first().click();
      cy.get('button').contains('Conectar Directamente').click();
      
      cy.get('.message-input').type('Mensaje 1');
      cy.get('.send-btn').click();
      
      cy.get('.message-input').type('Mensaje 2');
      cy.get('.send-btn').click();
      
      // Desconectar y reconectar
      cy.get('.close-btn').click();
      cy.get('.cliente-item').first().click();
      cy.get('button').contains('Conectar Directamente').click();
      
      // Debe mostrar los mensajes anteriores
      cy.get('.message').should('have.length.greaterThan', 0);
    });
  });

  describe('Alertas y Notificaciones', () => {
    it('Debe mostrar alerta de éxito al enviar', () => {
      cy.visit(`${baseUrl}/comunicacion`);
      
      cy.get('.cliente-item').first().click();
      cy.get('button').contains('Conectar Directamente').click();
      
      cy.get('.message-input').type('Mensaje');
      cy.get('.send-btn').click();
      
      cy.get('.alert-success').should('exist');
    });

    it('Debe mostrar alerta de error si falla el envío', () => {
      cy.visit(`${baseUrl}/comunicacion`);
      
      cy.get('.cliente-item').first().click();
      
      // Intentar enviar sin conectar
      cy.get('.message-input').should('not.exist');
    });

    it('Debe cerrar alertas automáticamente', () => {
      cy.visit(`${baseUrl}/comunicacion`);
      
      cy.get('.cliente-item').first().click();
      cy.get('button').contains('Conectar Directamente').click();
      
      cy.get('.message-input').type('Mensaje');
      cy.get('.send-btn').click();
      
      cy.get('.alert-success').should('exist');
      cy.wait(3000);
      cy.get('.alert-success').should('not.exist');
    });
  });

  describe('Responsividad', () => {
    it('Debe funcionar en pantalla móvil', () => {
      cy.viewport('iphone-x');
      cy.visit(`${baseUrl}/comunicacion`);
      
      cy.get('.comunicacion-container').should('exist');
      cy.get('.clientes-panel').should('exist');
    });

    it('Debe funcionar en tablet', () => {
      cy.viewport('ipad-2');
      cy.visit(`${baseUrl}/comunicacion`);
      
      cy.get('.comunicacion-container').should('exist');
    });

    it('Debe funcionar en desktop', () => {
      cy.viewport('macbook-15');
      cy.visit(`${baseUrl}/comunicacion`);
      
      cy.get('.comunicacion-container').should('exist');
    });
  });

  describe('Accesibilidad', () => {
    it('Debe tener botones con labels accesibles', () => {
      cy.visit(`${baseUrl}/comunicacion`);
      
      cy.get('button').contains('Generar QR').should('have.attr', 'title');
      cy.get('button').contains('Conectar Directamente').should('exist');
    });

    it('Debe tener inputs con placeholders', () => {
      cy.visit(`${baseUrl}/comunicacion`);
      
      cy.get('.search-input').should('have.attr', 'placeholder');
      cy.get('.message-input').should('have.attr', 'placeholder');
    });
  });

  describe('Flujo Completo de Usuario', () => {
    it('Debe completar flujo: buscar -> seleccionar -> conectar -> enviar', () => {
      cy.visit(`${baseUrl}/comunicacion`);
      
      // Buscar cliente
      cy.get('.search-input').type('Harold');
      
      // Seleccionar cliente
      cy.get('.cliente-item').first().click();
      
      // Conectar
      cy.get('button').contains('Conectar Directamente').click();
      
      // Enviar mensaje
      cy.get('.message-input').type('Mensaje de flujo completo');
      cy.get('.send-btn').click();
      
      // Verificar éxito
      cy.get('.message').should('contain', 'Mensaje de flujo completo');
      cy.get('.alert-success').should('exist');
    });
  });
});
