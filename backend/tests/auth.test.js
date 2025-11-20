const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

describe('Auth Functionality', () => {
  describe('JWT Token Generation', () => {
    it('debería generar un token válido', () => {
      const payload = { id: 1, username: 'admin', rol: 'admin' };
      const secret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
      
      const token = jwt.sign(payload, secret, { expiresIn: '24h' });
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });

    it('debería verificar un token válido', () => {
      const payload = { id: 1, username: 'admin', rol: 'admin' };
      const secret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
      
      const token = jwt.sign(payload, secret, { expiresIn: '24h' });
      const decoded = jwt.verify(token, secret);
      
      expect(decoded.id).toBe(1);
      expect(decoded.username).toBe('admin');
      expect(decoded.rol).toBe('admin');
    });

    it('debería rechazar un token inválido', () => {
      const secret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
      const invalidToken = 'invalid.token.here';
      
      expect(() => {
        jwt.verify(invalidToken, secret);
      }).toThrow();
    });
  });

  describe('Password Hashing', () => {
    it('debería hashear una contraseña', async () => {
      const password = 'password123';
      const hash = await bcrypt.hash(password, 10);
      
      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
    });

    it('debería comparar contraseña con hash', async () => {
      const password = 'password123';
      const hash = await bcrypt.hash(password, 10);
      
      const match = await bcrypt.compare(password, hash);
      
      expect(match).toBe(true);
    });

    it('debería rechazar contraseña incorrecta', async () => {
      const password = 'password123';
      const wrongPassword = 'wrongpassword';
      const hash = await bcrypt.hash(password, 10);
      
      const match = await bcrypt.compare(wrongPassword, hash);
      
      expect(match).toBe(false);
    });
  });
});
