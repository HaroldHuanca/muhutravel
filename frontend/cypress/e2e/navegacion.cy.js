describe('E2E - Navegación Completa', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    cy.get('input#username').type('admin');
    cy.get('input#password').type('hash123');
    cy.get('button.login-btn').click();
    cy.url({ timeout: 5000 }).should('include', '/');
    cy.contains('Dashboard', { timeout: 5000 }).should('exist');
  });

  it('debería navegar a Dashboard', () => {
    cy.contains('Dashboard', { timeout: 5000 }).click();
    cy.url({ timeout: 5000 }).should('include', '/');
  });

  it('debería navegar a Clientes', () => {
    cy.contains('Clientes', { timeout: 5000 }).click();
    cy.url({ timeout: 5000 }).should('include', '/clientes');
  });

  it('debería navegar a Empleados', () => {
    cy.contains('Empleados', { timeout: 5000 }).click();
    cy.url({ timeout: 5000 }).should('include', '/empleados');
  });

  it('debería navegar a Proveedores', () => {
    cy.contains('Proveedores', { timeout: 5000 }).click();
    cy.url({ timeout: 5000 }).should('include', '/proveedores');
  });

  it('debería navegar a Paquetes', () => {
    cy.contains('Paquetes', { timeout: 5000 }).click();
    cy.url({ timeout: 5000 }).should('include', '/paquetes');
  });

  it('debería navegar a Reservas', () => {
    cy.contains('Reservas', { timeout: 5000 }).click();
    cy.url({ timeout: 5000 }).should('include', '/reservas');
  });

  it('debería navegar a Usuarios', () => {
    cy.contains('Usuarios', { timeout: 5000 }).click();
    cy.url({ timeout: 5000 }).should('include', '/usuarios');
  });

  it('debería mostrar header en todas las páginas', () => {
    cy.contains('Clientes', { timeout: 5000 }).click();
    cy.get('header', { timeout: 5000 }).should('exist');
  });

  it('debería permitir logout', () => {
    cy.contains('Logout', { timeout: 5000 }).click();
    cy.url({ timeout: 5000 }).should('include', '/');
  });
});
