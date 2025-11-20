import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Inactivos from '../pages/Inactivos';

// Mock del servicio de API
jest.mock('../services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn().mockResolvedValue({
      data: [
        { id: 1, nombres: 'Juan', apellidos: 'Pérez', documento: '12345678', email: 'juan@example.com', activo: false }
      ]
    }),
    patch: jest.fn().mockResolvedValue({
      data: { id: 1, nombres: 'Juan', apellidos: 'Pérez', activo: true }
    })
  }
}));

// Mock de useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ tipo: 'clientes' }),
  useNavigate: () => jest.fn()
}));

// Mock del Header
jest.mock('../components/Header', () => {
  return function MockHeader() {
    return <div data-testid="header">Header Mock</div>;
  };
});

// Mock del SearchBar
jest.mock('../components/SearchBar', () => {
  return function MockSearchBar({ value, onChange, placeholder }) {
    return (
      <input
        data-testid="search-bar"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    );
  };
});

describe('Inactivos Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería renderizar la página de inactivos', async () => {
    render(
      <BrowserRouter>
        <Inactivos />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('header')).toBeInTheDocument();
    });
  });

  it('debería mostrar el título de inactivos', async () => {
    render(
      <BrowserRouter>
        <Inactivos />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Clientes Inactivos/i)).toBeInTheDocument();
    });
  });

  it('debería mostrar la barra de búsqueda', async () => {
    render(
      <BrowserRouter>
        <Inactivos />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('search-bar')).toBeInTheDocument();
    });
  });

  it('debería mostrar página de inactivos sin errores críticos', async () => {
    render(
      <BrowserRouter>
        <Inactivos />
      </BrowserRouter>
    );

    await waitFor(() => {
      // Verificar que la página se renderiza
      expect(screen.getByTestId('header')).toBeInTheDocument();
    });
  });

  it('debería permitir búsqueda en inactivos', async () => {
    render(
      <BrowserRouter>
        <Inactivos />
      </BrowserRouter>
    );

    const searchBar = await screen.findByTestId('search-bar');
    fireEvent.change(searchBar, { target: { value: 'juan' } });

    await waitFor(() => {
      expect(searchBar.value).toBe('juan');
    });
  });
});
