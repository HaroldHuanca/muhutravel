import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Clientes from '../pages/Clientes';
import Empleados from '../pages/Empleados';
import Proveedores from '../pages/Proveedores';
import Paquetes from '../pages/Paquetes';

// Mock del servicio de API
jest.mock('../services/api', () => ({
  clientesService: {
    getAll: jest.fn().mockResolvedValue({ 
      data: [
        { id: 1, nombres: 'Juan', apellidos: 'Pérez', email: 'juan@example.com' }
      ] 
    }),
    delete: jest.fn().mockResolvedValue({ data: { message: 'Eliminado' } })
  },
  empleadosService: {
    getAll: jest.fn().mockResolvedValue({ 
      data: [
        { id: 1, nombres: 'Carlos', apellidos: 'López', puesto: 'Gerente' }
      ] 
    }),
    delete: jest.fn().mockResolvedValue({ data: { message: 'Eliminado' } })
  },
  proveedoresService: {
    getAll: jest.fn().mockResolvedValue({ 
      data: [
        { id: 1, nombre: 'Hotel XYZ', tipo: 'Hospedaje', email: 'hotel@example.com' }
      ] 
    }),
    delete: jest.fn().mockResolvedValue({ data: { message: 'Eliminado' } })
  },
  paquetesService: {
    getAll: jest.fn().mockResolvedValue({ 
      data: [
        { id: 1, nombre: 'Paquete Cusco', destino: 'Cusco', precio: 1500 }
      ] 
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
      expect(screen.getByText('Clientes')).toBeInTheDocument();
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
      expect(screen.getByText('Empleados')).toBeInTheDocument();
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
      expect(screen.getByText('Proveedores')).toBeInTheDocument();
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
      expect(screen.getByText('Paquetes Turísticos')).toBeInTheDocument();
    });
  });
});
