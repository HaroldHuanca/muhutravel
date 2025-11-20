const jwt = require('jsonwebtoken');

describe('JWT Token Verification', () => {
  const secret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

  describe('Token Validation', () => {
    it('debería validar un token correcto', () => {
      const payload = { id: 1, username: 'admin', rol: 'admin' };
      const token = jwt.sign(payload, secret);
      
      const decoded = jwt.verify(token, secret);
      
      expect(decoded.id).toBe(1);
      expect(decoded.username).toBe('admin');
      expect(decoded.rol).toBe('admin');
    });

    it('debería rechazar un token inválido', () => {
      const invalidToken = 'invalid.token.here';
      
      expect(() => {
        jwt.verify(invalidToken, secret);
      }).toThrow();
    });

    it('debería rechazar un token con secret incorrecto', () => {
      const payload = { id: 1, username: 'admin', rol: 'admin' };
      const token = jwt.sign(payload, secret);
      const wrongSecret = 'wrong_secret';
      
      expect(() => {
        jwt.verify(token, wrongSecret);
      }).toThrow();
    });
  });

  describe('Role Verification', () => {
    it('debería identificar un usuario admin', () => {
      const payload = { id: 1, username: 'admin', rol: 'admin' };
      const token = jwt.sign(payload, secret);
      
      const decoded = jwt.verify(token, secret);
      
      expect(decoded.rol).toBe('admin');
      expect(decoded.rol === 'admin').toBe(true);
    });

    it('debería identificar un usuario agente', () => {
      const payload = { id: 2, username: 'agente1', rol: 'agente' };
      const token = jwt.sign(payload, secret);
      
      const decoded = jwt.verify(token, secret);
      
      expect(decoded.rol).toBe('agente');
      expect(decoded.rol === 'admin').toBe(false);
    });

    it('debería identificar un usuario manager', () => {
      const payload = { id: 3, username: 'manager', rol: 'manager' };
      const token = jwt.sign(payload, secret);
      
      const decoded = jwt.verify(token, secret);
      
      expect(decoded.rol).toBe('manager');
    });
  });

  describe('Token Expiration', () => {
    it('debería crear un token con expiración', () => {
      const payload = { id: 1, username: 'admin', rol: 'admin' };
      const token = jwt.sign(payload, secret, { expiresIn: '24h' });
      
      const decoded = jwt.decode(token);
      
      expect(decoded).toBeDefined();
      expect(decoded.exp).toBeDefined();
    });

    it('debería rechazar un token expirado', (done) => {
      const payload = { id: 1, username: 'admin', rol: 'admin' };
      const token = jwt.sign(payload, secret, { expiresIn: '0s' });
      
      setTimeout(() => {
        expect(() => {
          jwt.verify(token, secret);
        }).toThrow();
        done();
      }, 100);
    });
  });
});
