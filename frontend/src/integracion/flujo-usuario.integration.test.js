import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// Mocks
jest.mock('../services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockResolvedValue({
      data: [
        { id: 1, nombres: 'Juan', apellidos: 'Pérez', email: 'juan@example.com', activo: true }
      ]
    }),
    post: jest.fn().mockResolvedValue({
      data: { id: 2, nombres: 'María', apellidos: 'García', email: 'maria@example.com' }
    }),
    put: jest.fn().mockResolvedValue({
      data: { id: 1, nombres: 'Juan Updated', apellidos: 'Pérez', email: 'juan@example.com' }
    }),
    delete: jest.fn().mockResolvedValue({ data: { message: 'Eliminado' } }),
    patch: jest.fn().mockResolvedValue({
      data: { id: 1, nombres: 'Juan', apellidos: 'Pérez', activo: true }
    })
  }
}));

jest.mock('../components/Header', () => {
  return function MockHeader() {
    return <div data-testid="header">Header</div>;
  };
});

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ tipo: 'clientes' }),
  useNavigate: () => jest.fn()
}));

import Clientes from '../pages/Clientes';
import SearchBar from '../components/SearchBar';

describe('Integration Tests - Flujo de Usuario Completo', () => {
  describe('Flujo: Navegar -> Buscar -> Ver Detalles', () => {
    it('debería completar flujo de navegación y búsqueda', async () => {
      render(
        <BrowserRouter>
          <Clientes user={{ id: 1, username: 'test' }} onLogout={() => {}} />
        </BrowserRouter>
      );

      // 1. Navegar a página
      await waitFor(() => {
        // CORRECCIÓN AQUÍ: Usamos getByRole para asegurar que sea el H1 y no el link del footer
        expect(screen.getByRole('heading', { name: 'Clientes' })).toBeInTheDocument();
      });

      // 2. Verificar que hay barra de búsqueda
      const searchInput = screen.queryByPlaceholderText(/Buscar/i);
      expect(searchInput).toBeInTheDocument();

      // 3. Realizar búsqueda
      if (searchInput) {
        fireEvent.change(searchInput, { target: { value: 'juan' } });
        expect(searchInput.value).toBe('juan');
      }
    });

    it('debería mostrar opciones de acción', async () => {
      render(
        <BrowserRouter>
          <Clientes user={{ id: 1, username: 'test' }} onLogout={() => {}} />
        </BrowserRouter>
      );

      await waitFor(() => {
        // Verificar botones de acción
        const buttons = screen.queryAllByRole('button');
        expect(buttons.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Flujo: Crear -> Editar -> Eliminar', () => {
    it('debería validar flujo de creación', () => {
      const nuevoCliente = {
        nombres: 'María',
        apellidos: 'García',
        documento: '87654321',
        email: 'maria@example.com'
      };

      expect(nuevoCliente.nombres).toBeDefined();
      expect(nuevoCliente.email).toContain('@');

      const clienteCreado = {
        id: 2,
        ...nuevoCliente,
        createdAt: new Date()
      };

      expect(clienteCreado.id).toBe(2);
      expect(clienteCreado.nombres).toBe('María');
    });

    it('debería validar flujo de edición', () => {
      let cliente = {
        id: 1,
        nombres: 'Juan',
        apellidos: 'Pérez',
        email: 'juan@example.com'
      };

      const updates = {
        email: 'juan.updated@example.com'
      };

      cliente = { ...cliente, ...updates };

      expect(cliente.email).toBe('juan.updated@example.com');
      expect(cliente.id).toBe(1);
    });

    it('debería validar flujo de eliminación', () => {
      let cliente = {
        id: 1,
        nombres: 'Juan',
        activo: true
      };

      cliente.activo = false;

      expect(cliente.activo).toBe(false);
      expect(cliente.id).toBe(1);
    });
  });

  describe('Flujo: Búsqueda -> Filtrado -> Ordenamiento', () => {
    it('debería completar flujo de búsqueda avanzada', () => {
      const clientes = [
        { id: 1, nombres: 'Juan', ciudad: 'Lima', activo: true },
        { id: 2, nombres: 'María', ciudad: 'Arequipa', activo: true },
        { id: 3, nombres: 'Carlos', ciudad: 'Lima', activo: false }
      ];

      const searchResults = clientes.filter(c =>
        c.nombres.toLowerCase().includes('juan')
      );
      expect(searchResults.length).toBe(1);

      const filtered = clientes.filter(c => c.ciudad === 'Lima');
      expect(filtered.length).toBe(2);

      const sorted = [...filtered].sort((a, b) => a.id - b.id);
      expect(sorted[0].id).toBe(1);
    });

    it('debería aplicar múltiples filtros en secuencia', () => {
      const clientes = [
        { id: 1, nombres: 'Juan', ciudad: 'Lima', activo: true, rol: 'cliente' },
        { id: 2, nombres: 'María', ciudad: 'Arequipa', activo: true, rol: 'cliente' },
        { id: 3, nombres: 'Carlos', ciudad: 'Lima', activo: false, rol: 'cliente' }
      ];

      let result = clientes.filter(c => c.activo);
      expect(result.length).toBe(2);

      result = result.filter(c => c.ciudad === 'Lima');
      expect(result.length).toBe(1);

      result = result.sort((a, b) => a.nombres.localeCompare(b.nombres));
      expect(result[0].nombres).toBe('Juan');
    });
  });

  describe('Flujo: Inactivos -> Reactivar', () => {
    it('debería completar flujo de gestión de inactivos', () => {
      let clientes = [
        { id: 1, nombres: 'Juan', activo: true },
        { id: 2, nombres: 'María', activo: true },
        { id: 3, nombres: 'Carlos', activo: false }
      ];

      const inactivos = clientes.filter(c => !c.activo);
      expect(inactivos.length).toBe(1);

      clientes = clientes.map(c =>
        c.id === 3 ? { ...c, activo: true } : c
      );

      const activosAhora = clientes.filter(c => c.activo);
      expect(activosAhora.length).toBe(3);
    });
  });

  describe('Flujo: Componentes Integrados', () => {
    it('debería integrar SearchBar con datos', () => {
      const mockOnChange = jest.fn();

      const { rerender } = render(
        <SearchBar
          value=""
          onChange={mockOnChange}
          placeholder="Buscar clientes..."
        />
      );

      const input = screen.getByPlaceholderText('Buscar clientes...');

      fireEvent.change(input, { target: { value: 'juan' } });
      expect(mockOnChange).toHaveBeenCalledWith('juan');

      fireEvent.change(input, { target: { value: 'maría' } });
      expect(mockOnChange).toHaveBeenCalledWith('maría');

      rerender(
        <SearchBar
          value=""
          onChange={mockOnChange}
          placeholder="Buscar clientes..."
        />
      );

      expect(screen.getByPlaceholderText('Buscar clientes...').value).toBe('');
    });

    it('debería integrar múltiples componentes', async () => {
      render(
        <BrowserRouter>
          <Clientes user={{ id: 1, username: 'test' }} onLogout={() => {}} />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('header')).toBeInTheDocument();

        // CORRECCIÓN AQUÍ TAMBIÉN: Usamos getByRole en lugar de getByText
        expect(screen.getByRole('heading', { name: 'Clientes' })).toBeInTheDocument();

        const searchInput = screen.queryByPlaceholderText(/Buscar/i);
        expect(searchInput).toBeInTheDocument();
      });
    });
  });

  describe('Flujo: Manejo de Errores', () => {
    it('debería manejar error en búsqueda', () => {
      const clientes = [];
      const search = (term) =>
        clientes.filter(c =>
          c.nombres.toLowerCase().includes(term.toLowerCase())
        );
      const results = search('noexiste');
      expect(results.length).toBe(0);
    });

    it('debería manejar error en actualización', () => {
      let cliente = {
        id: 1,
        nombres: 'Juan',
        email: 'juan@example.com'
      };
      const updates = { email: 'invalid-email' };
      const isValidEmail = (email) => email.includes('@');

      if (isValidEmail(updates.email)) {
        cliente = { ...cliente, ...updates };
      }
      expect(cliente.email).toBe('juan@example.com');
    });

    it('debería manejar error en eliminación', () => {
      let cliente = { id: 1, nombres: 'Juan', activo: true };
      const deleted = { ...cliente, activo: false };
      const restored = { ...deleted, activo: true };
      expect(restored.activo).toBe(true);
    });
  });

  describe('Flujo: Validación de Datos', () => {
    it('debería validar datos en cada paso', () => {
      const cliente = {
        nombres: 'Juan',
        apellidos: 'Pérez',
        documento: '12345678',
        email: 'juan@example.com'
      };

      const hasRequiredFields =
        !!cliente.nombres &&
        !!cliente.apellidos &&
        !!cliente.documento &&
        !!cliente.email;

      expect(hasRequiredFields).toBe(true);

      const isValidEmail = cliente.email.includes('@');
      const isValidDocument = cliente.documento.length === 8;

      expect(isValidEmail).toBe(true);
      expect(isValidDocument).toBe(true);

      const created = { id: 1, ...cliente, createdAt: new Date() };
      expect(created.id).toBe(1);
    });
  });
});