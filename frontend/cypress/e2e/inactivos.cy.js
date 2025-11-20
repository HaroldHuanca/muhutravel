describe('E2E - Gestión de Inactivos', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    cy.get('input#username').type('admin');
    cy.get('input#password').type('hash123');
    cy.get('button.login-btn').click();
    cy.url({ timeout: 5000 }).should('include', '/');
    cy.contains('Dashboard', { timeout: 5000 }).should('exist');
  });

  describe('Flujo de Ver Inactivos', () => {
    it('debería mostrar botón Ver Inactivos en Clientes', () => {
      cy.contains('Clientes', { timeout: 5000 }).click();
      cy.contains('Ver Inactivos', { timeout: 5000 }).should('exist');
    });

    it('debería navegar a página de inactivos', () => {
      cy.contains('Clientes', { timeout: 5000 }).click();
      cy.contains('Ver Inactivos', { timeout: 5000 }).click();
      cy.url({ timeout: 5000 }).should('include', '/inactivos');
    });

    it('debería mostrar lista de inactivos', () => {
      cy.contains('Clientes', { timeout: 5000 }).click();
      cy.contains('Ver Inactivos', { timeout: 5000 }).click();
      cy.get('table', { timeout: 5000 }).should('exist');
    });
  });

  describe('Flujo de Reactivar', () => {
    it('debería mostrar botón Reactivar', () => {
      cy.contains('Clientes', { timeout: 5000 }).click();
      cy.contains('Ver Inactivos', { timeout: 5000 }).click();
      cy.get('tbody tr', { timeout: 5000 }).first().within(() => {
        cy.contains('Reactivar', { timeout: 5000 }).should('exist');
      });
    });

    it('debería volver a Clientes desde Inactivos', () => {
      cy.contains('Clientes', { timeout: 5000 }).click();
      cy.contains('Ver Inactivos', { timeout: 5000 }).click();
      cy.contains('Volver', { timeout: 5000 }).click();
      cy.url({ timeout: 5000 }).should('include', '/clientes');
    });
  });

  describe('Flujo de Inactivos en Otras Entidades', () => {
    it('debería mostrar Ver Inactivos en Empleados', () => {
      cy.contains('Empleados', { timeout: 5000 }).click();
      cy.contains('Ver Inactivos', { timeout: 5000 }).should('exist');
    });

    it('debería mostrar Ver Inactivos en Proveedores', () => {
      cy.contains('Proveedores', { timeout: 5000 }).click();
      cy.contains('Ver Inactivos', { timeout: 5000 }).should('exist');
    });

    it('debería mostrar Ver Inactivos en Paquetes', () => {
      cy.contains('Paquetes', { timeout: 5000 }).click();
      cy.contains('Ver Inactivos', { timeout: 5000 }).should('exist');
    });

    it('debería mostrar Ver Inactivos en Usuarios', () => {
      cy.contains('Usuarios', { timeout: 5000 }).click();
      cy.contains('Ver Inactivos', { timeout: 5000 }).should('exist');
    });
  });
});
