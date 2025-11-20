const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

describe('Integration Tests - Flujo de Autenticación', () => {
  const secret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

  describe('Flujo Completo de Login', () => {
    it('debería completar flujo: generar token -> verificar -> decodificar', () => {
      // 1. Generar token
      const payload = { id: 1, username: 'admin', rol: 'admin' };
      const token = jwt.sign(payload, secret, { expiresIn: '24h' });

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');

      // 2. Verificar token
      const decoded = jwt.verify(token, secret);

      expect(decoded.id).toBe(1);
      expect(decoded.username).toBe('admin');
      expect(decoded.rol).toBe('admin');

      // 3. Validar estructura
      expect(decoded).toHaveProperty('iat');
      expect(decoded).toHaveProperty('exp');
    });

    it('debería manejar múltiples usuarios con tokens diferentes', () => {
      const users = [
        { id: 1, username: 'admin', rol: 'admin' },
        { id: 2, username: 'agente1', rol: 'agente' },
        { id: 3, username: 'manager', rol: 'manager' }
      ];

      const tokens = users.map(user => jwt.sign(user, secret));

      tokens.forEach((token, index) => {
        const decoded = jwt.verify(token, secret);
        expect(decoded.id).toBe(users[index].id);
        expect(decoded.rol).toBe(users[index].rol);
      });
    });
  });

  describe('Flujo Completo de Registro', () => {
    it('debería completar flujo: hashear -> comparar -> crear token', async () => {
      const password = 'password123';

      // 1. Hashear contraseña
      const hash = await bcrypt.hash(password, 10);
      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);

      // 2. Comparar contraseña
      const match = await bcrypt.compare(password, hash);
      expect(match).toBe(true);

      // 3. Crear token para nuevo usuario
      const newUser = {
        id: 4,
        username: 'newuser',
        rol: 'agente',
        password_hash: hash
      };

      const token = jwt.sign(
        { id: newUser.id, username: newUser.username, rol: newUser.rol },
        secret
      );

      const decoded = jwt.verify(token, secret);
      expect(decoded.username).toBe('newuser');
    });

    it('debería rechazar contraseña incorrecta en flujo de login', async () => {
      const correctPassword = 'password123';
      const wrongPassword = 'wrongpassword';

      const hash = await bcrypt.hash(correctPassword, 10);

      const matchCorrect = await bcrypt.compare(correctPassword, hash);
      const matchWrong = await bcrypt.compare(wrongPassword, hash);

      expect(matchCorrect).toBe(true);
      expect(matchWrong).toBe(false);
    });
  });

  describe('Flujo de Autorización', () => {
    it('debería validar roles en flujo de acceso', () => {
      const adminToken = jwt.sign(
        { id: 1, username: 'admin', rol: 'admin' },
        secret
      );

      const agentToken = jwt.sign(
        { id: 2, username: 'agente1', rol: 'agente' },
        secret
      );

      const adminDecoded = jwt.verify(adminToken, secret);
      const agentDecoded = jwt.verify(agentToken, secret);

      // Admin puede acceder a todo
      expect(adminDecoded.rol).toBe('admin');

      // Agent tiene acceso limitado
      expect(agentDecoded.rol).toBe('agente');
      expect(agentDecoded.rol === 'admin').toBe(false);
    });

    it('debería validar permisos en flujo de operaciones', () => {
      const roles = ['admin', 'agente', 'manager'];
      const permissions = {
        admin: ['read', 'write', 'delete', 'manage_users'],
        agente: ['read', 'write'],
        manager: ['read', 'write', 'manage_team']
      };

      roles.forEach(role => {
        const token = jwt.sign(
          { id: 1, username: 'user', rol: role },
          secret
        );

        const decoded = jwt.verify(token, secret);
        expect(permissions[decoded.rol]).toBeDefined();
      });
    });
  });

  describe('Flujo de Sesión', () => {
    it('debería manejar ciclo completo de sesión', () => {
      // 1. Login - generar token
      const loginPayload = { id: 1, username: 'admin', rol: 'admin' };
      const sessionToken = jwt.sign(loginPayload, secret, { expiresIn: '24h' });

      // 2. Almacenar en "sesión"
      const session = {
        token: sessionToken,
        user: loginPayload,
        createdAt: new Date()
      };

      expect(session.token).toBeDefined();
      expect(session.user.id).toBe(1);

      // 3. Verificar sesión
      const decoded = jwt.verify(session.token, secret);
      expect(decoded.id).toBe(session.user.id);

      // 4. Logout - limpiar sesión
      session.token = null;
      session.user = null;

      expect(session.token).toBeNull();
      expect(session.user).toBeNull();
    });

    it('debería manejar múltiples sesiones simultáneas', () => {
      const users = [
        { id: 1, username: 'admin' },
        { id: 2, username: 'agente1' },
        { id: 3, username: 'agente2' }
      ];

      const sessions = users.map(user => ({
        token: jwt.sign(user, secret),
        user: user
      }));

      // Verificar que todas las sesiones son válidas
      sessions.forEach(session => {
        const decoded = jwt.verify(session.token, secret);
        expect(decoded.id).toBe(session.user.id);
      });

      expect(sessions.length).toBe(3);
    });
  });

  describe('Flujo de Errores', () => {
    it('debería manejar token expirado en flujo', (done) => {
      const payload = { id: 1, username: 'admin', rol: 'admin' };
      const expiredToken = jwt.sign(payload, secret, { expiresIn: '0s' });

      setTimeout(() => {
        expect(() => {
          jwt.verify(expiredToken, secret);
        }).toThrow();
        done();
      }, 100);
    });

    it('debería manejar token inválido en flujo', () => {
      const invalidToken = 'invalid.token.here';

      expect(() => {
        jwt.verify(invalidToken, secret);
      }).toThrow();
    });

    it('debería manejar secret incorrecto en flujo', () => {
      const payload = { id: 1, username: 'admin', rol: 'admin' };
      const token = jwt.sign(payload, secret);
      const wrongSecret = 'wrong_secret';

      expect(() => {
        jwt.verify(token, wrongSecret);
      }).toThrow();
    });
  });
});
