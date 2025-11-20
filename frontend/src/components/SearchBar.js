import React from 'react';
import { Search } from 'lucide-react';
import './SearchBar.css';

function SearchBar({ value, onChange, placeholder = 'Buscar...' }) {
  return (
    <div className="search-bar">
      <Search size={20} className="search-icon" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="search-input"
      />
    </div>
  );
}

export default SearchBar;
