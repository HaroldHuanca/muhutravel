import React from 'react';
// IMPORTAMOS TODOS LOS ICONOS NECESARIOS
import { Edit2, Trash2, CalendarPlus, RotateCcw } from 'lucide-react';
import './Table.css';

// Recibimos todas las funciones posibles: onEdit, onDelete, onReservar, onRestore
function Table({ columns, data, onEdit, onDelete, onReservar, onRestore, loading = false }) {
  if (loading) {
    return <div className="table-loading">Cargando datos...</div>;
  }

  if (!columns || !Array.isArray(columns) || columns.length === 0) {
    return <div className="table-empty">No hay columnas configuradas</div>;
  }

  if (!data || data.length === 0) {
    return <div className="table-empty">No hay datos disponibles</div>;
  }

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={row.id || idx}>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
              <td className="table-actions">
                
                {/* 1. BOTÓN RESTAURAR / REACTIVAR (Para Inactivos) */}
                {onRestore && (
                  <button
                    className="action-btn"
                    onClick={() => onRestore(row.id)}
                    title="Reactivar registro"
                    style={{ backgroundColor: '#3182ce', color: 'white' }} // Azul
                  >
                    <RotateCcw size={18} />
                    Reactivar
                  </button>
                )}

                {/* 2. BOTÓN RESERVAR (Para Clientes Activos) */}
                {onReservar && (
                  <button
                    className="action-btn reserve-btn" // Usa la clase CSS verde que creamos
                    onClick={() => onReservar(row)} 
                    title="Crear Reserva"
                    style={{ backgroundColor: '#38a169', color: 'white' }}
                  >
                    <CalendarPlus size={18} />
                    Reservar
                  </button>
                )}

                {/* 3. BOTÓN EDITAR */}
                {onEdit && (
                  <button
                    className="action-btn edit-btn"
                    onClick={() => onEdit(row.id)}
                    title="Editar"
                  >
                    <Edit2 size={18} />
                    Editar
                  </button>
                )}
                
                {/* 4. BOTÓN ELIMINAR */}
                {onDelete && (
                  <button
                    className="action-btn delete-btn"
                    onClick={() => onDelete(row.id)}
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                    Eliminar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;