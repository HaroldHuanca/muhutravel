import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBar from '../components/SearchBar';

describe('SearchBar Component', () => {
  it('debería renderizar el componente', () => {
    const mockOnChange = jest.fn();
    
    render(
      <SearchBar 
        value="" 
        onChange={mockOnChange} 
        placeholder="Buscar..." 
      />
    );

    const input = screen.getByPlaceholderText('Buscar...');
    expect(input).toBeInTheDocument();
  });

  it('debería llamar onChange cuando se escribe', () => {
    const mockOnChange = jest.fn();
    
    render(
      <SearchBar 
        value="" 
        onChange={mockOnChange} 
        placeholder="Buscar..." 
      />
    );

    const input = screen.getByPlaceholderText('Buscar...');
    fireEvent.change(input, { target: { value: 'test' } });

    expect(mockOnChange).toHaveBeenCalledWith('test');
  });

  it('debería mostrar el valor inicial', () => {
    const mockOnChange = jest.fn();
    
    render(
      <SearchBar 
        value="inicial" 
        onChange={mockOnChange} 
        placeholder="Buscar..." 
      />
    );

    const input = screen.getByPlaceholderText('Buscar...');
    expect(input.value).toBe('inicial');
  });

  it('debería actualizar valor cuando cambia', () => {
    const mockOnChange = jest.fn();
    
    render(
      <SearchBar 
        value="test" 
        onChange={mockOnChange} 
        placeholder="Buscar..." 
      />
    );

    const input = screen.getByPlaceholderText('Buscar...');
    expect(input.value).toBe('test');
  });
});
