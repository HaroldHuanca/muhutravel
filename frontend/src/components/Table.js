import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import './Table.css';

function Table({ columns, data, onEdit, onDelete, loading = false }) {
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
