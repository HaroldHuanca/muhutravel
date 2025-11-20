import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Clientes from '../pages/Clientes';
import Empleados from '../pages/Empleados';
import Proveedores from '../pages/Proveedores';
import Paquetes from '../pages/Paquetes';

// 1. Mock del servicio de API corregido para coincidir con la estructura real
// Usamos mockImplementation para devolver datos distintos según la URL
jest.mock('../services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockImplementation((url) => {
      if (url && url.includes('clientes')) {
        return Promise.resolve({
          data: [{ id: 1, nombres: 'Juan', apellidos: 'Pérez', email: 'juan@example.com' }]
        });
      }
      if (url && url.includes('empleados')) {
        return Promise.resolve({
          data: [{ id: 1, nombres: 'Carlos', apellidos: 'López', puesto: 'Gerente' }]
        });
      }
      if (url && url.includes('proveedores')) {
        return Promise.resolve({
          data: [{ id: 1, nombre: 'Hotel XYZ', tipo: 'Hospedaje', email: 'hotel@example.com' }]
        });
      }
      if (url && url.includes('paquetes')) {
        return Promise.resolve({
          data: [{ id: 1, nombre: 'Paquete Cusco', destino: 'Cusco', precio: 1500 }]
        });
      }
      return Promise.resolve({ data: [] });
    }),
    delete: jest.fn().mockResolvedValue({ data: { message: 'Eliminado' } })
  }
}));

// Mock del Header
jest.mock('../components/Header', () => {
  return function MockHeader() {
    return <div data-testid="header">Header Mock</div>;
  };
});

describe('Clientes Page', () => {
  it('debería renderizar la página de clientes', async () => {
    render(
      <BrowserRouter>
        <Clientes user={{ id: 1, username: 'test' }} onLogout={() => {}} />
      </BrowserRouter>
    );

    await waitFor(() => {
      // CORRECCIÓN: Usamos getByRole para diferenciar el título del link del footer
      expect(screen.getByRole('heading', { name: 'Clientes' })).toBeInTheDocument();
    });
  });

  it('debería mostrar el botón Ver Inactivos', async () => {
    render(
      <BrowserRouter>
        <Clientes user={{ id: 1, username: 'test' }} onLogout={() => {}} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Ver Inactivos')).toBeInTheDocument();
    });
  });

  it('debería mostrar el botón Nuevo Cliente', async () => {
    render(
      <BrowserRouter>
        <Clientes user={{ id: 1, username: 'test' }} onLogout={() => {}} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Nuevo Cliente')).toBeInTheDocument();
    });
  });
});

describe('Empleados Page', () => {
  it('debería renderizar la página de empleados', async () => {
    render(
      <BrowserRouter>
        <Empleados user={{ id: 1, username: 'test' }} onLogout={() => {}} />
      </BrowserRouter>
    );

    await waitFor(() => {
      // CORRECCIÓN: Usamos getByRole
      expect(screen.getByRole('heading', { name: 'Empleados' })).toBeInTheDocument();
    });
  });

  it('debería mostrar el botón Ver Inactivos', async () => {
    render(
      <BrowserRouter>
        <Empleados user={{ id: 1, username: 'test' }} onLogout={() => {}} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Ver Inactivos')).toBeInTheDocument();
    });
  });
});

describe('Proveedores Page', () => {
  it('debería renderizar la página de proveedores', async () => {
    render(
      <BrowserRouter>
        <Proveedores user={{ id: 1, username: 'test' }} onLogout={() => {}} />
      </BrowserRouter>
    );

    await waitFor(() => {
      // CORRECCIÓN: Usamos getByRole
      expect(screen.getByRole('heading', { name: 'Proveedores' })).toBeInTheDocument();
    });
  });
});

describe('Paquetes Page', () => {
  it('debería renderizar la página de paquetes', async () => {
    render(
      <BrowserRouter>
        <Paquetes user={{ id: 1, username: 'test' }} onLogout={() => {}} />
      </BrowserRouter>
    );

    await waitFor(() => {
      // CORRECCIÓN: Usamos getByRole o buscamos el texto específico completo
      expect(screen.getByRole('heading', { name: /Paquetes/i })).toBeInTheDocument();
    });
  });
});