describe('E2E - Flujo CRUD Completo', () => {
  beforeEach(() => {
    // Login antes de cada test
    cy.visit('http://localhost:3000');
    cy.get('input#username').type('admin');
    cy.get('input#password').type('hash123');
    cy.get('button.login-btn').click();
    cy.url({ timeout: 5000 }).should('include', '/');
    cy.contains('Dashboard', { timeout: 5000 }).should('exist');
  });

  describe('Flujo de Lectura', () => {
    it('debería navegar a página de clientes', () => {
      cy.contains('Clientes').click();
      cy.url({ timeout: 5000 }).should('include', '/clientes');
    });

    it('debería mostrar lista de clientes', () => {
      cy.contains('Clientes').click();
      cy.get('table', { timeout: 5000 }).should('exist');
    });

    it('debería permitir buscar cliente', () => {
      cy.contains('Clientes').click();
      cy.get('input[placeholder*="Buscar"]', { timeout: 5000 }).should('exist');
    });
  });

  describe('Flujo de Creación', () => {
    it('debería navegar a crear nuevo cliente', () => {
      cy.contains('Clientes').click();
      cy.contains('Nuevo', { timeout: 5000 }).click();
      cy.url({ timeout: 5000 }).should('include', '/new');
    });

    it('debería mostrar formulario de creación', () => {
      cy.contains('Clientes').click();
      cy.contains('Nuevo', { timeout: 5000 }).click();
      cy.get('input', { timeout: 5000 }).should('have.length.greaterThan', 0);
    });
  });

  describe('Flujo de Actualización', () => {
    it('debería permitir editar cliente', () => {
      cy.contains('Clientes').click();
      cy.get('tbody tr', { timeout: 5000 }).first().within(() => {
        cy.contains('Editar', { timeout: 5000 }).click();
      });
      cy.url({ timeout: 5000 }).should('include', '/clientes/');
    });
  });

  describe('Flujo de Eliminación', () => {
    it('debería mostrar botón eliminar', () => {
      cy.contains('Clientes').click();
      cy.get('tbody tr', { timeout: 5000 }).first().within(() => {
        cy.contains('Eliminar', { timeout: 5000 }).should('exist');
      });
    });
  });

  describe('Flujo de Búsqueda', () => {
    it('debería permitir buscar', () => {
      cy.contains('Clientes').click();
      cy.get('input[placeholder*="Buscar"]', { timeout: 5000 }).should('exist');
    });
  });
});
