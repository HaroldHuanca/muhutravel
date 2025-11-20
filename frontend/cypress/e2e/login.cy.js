describe('E2E - Flujo de Login', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('debería mostrar página de login', () => {
    cy.contains('MuhuTravel').should('exist');
    cy.get('input#username').should('exist');
    cy.get('input#password').should('exist');
    cy.get('button.login-btn').should('exist');
  });

  it('debería mostrar error con credenciales vacías', () => {
    cy.get('button.login-btn').click();
    // El formulario tiene required, así que no se envía
    cy.get('input#username').should('have.value', '');
  });

  it('debería mostrar error con credenciales incorrectas', () => {
    cy.get('input#username').type('usuarioincorrecto');
    cy.get('input#password').type('passwordincorrecto');
    cy.get('button.login-btn').click();
    // Esperar a que aparezca el error
    cy.get('.error-message', { timeout: 5000 }).should('exist');
  });

  it('debería permitir login con credenciales correctas', () => {
    cy.get('input#username').type('admin');
    cy.get('input#password').type('hash123');
    cy.get('button.login-btn').click();
    
    // Verificar que se redirige al dashboard
    cy.url({ timeout: 5000 }).should('include', '/');
    cy.contains('Dashboard', { timeout: 5000 }).should('exist');
  });

  it('debería guardar token en localStorage después de login', () => {
    cy.get('input#username').type('admin');
    cy.get('input#password').type('hash123');
    cy.get('button.login-btn').click();
    
    cy.window().then((win) => {
      cy.wrap(win.localStorage.getItem('token')).should('exist');
    });
  });

  it('debería mostrar nombre de usuario en header después de login', () => {
    cy.get('input#username').type('admin');
    cy.get('input#password').type('hash123');
    cy.get('button.login-btn').click();
    
    cy.contains('admin', { timeout: 5000 }).should('exist');
  });
});
