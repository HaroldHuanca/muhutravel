// Cypress support file for E2E tests

// Comandos personalizados
Cypress.Commands.add('login', (username, password) => {
  cy.visit('http://localhost:3000');
  cy.get('input[type="text"]').type(username);
  cy.get('input[type="password"]').type(password);
  cy.get('button').contains('Login').click();
  cy.url().should('include', '/dashboard');
});

Cypress.Commands.add('logout', () => {
  cy.contains('Logout').click();
  cy.url().should('include', '/');
});

Cypress.Commands.add('navigateTo', (page) => {
  cy.contains(page).click();
});

Cypress.Commands.add('searchFor', (term) => {
  cy.get('input[placeholder*="Buscar"]').type(term);
});

Cypress.Commands.add('clearSearch', () => {
  cy.get('input[placeholder*="Buscar"]').clear();
});

// Configuración global
beforeEach(() => {
  // Limpiar localStorage antes de cada test
  cy.window().then((win) => {
    win.localStorage.clear();
  });
});

// Manejo de errores
Cypress.on('uncaught:exception', (err, runnable) => {
  // Ignorar errores específicos
  if (err.message.includes('Cannot read properties of undefined')) {
    return false;
  }
  return true;
});
