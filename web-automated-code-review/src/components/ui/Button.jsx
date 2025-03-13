// src/components/ui/button.jsx

import React from 'react';

// Button component
export function Button({ children, onClick, disabled }) {
  return (
    <button 
      className="btn bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
      onClick={onClick} 
      disabled={disabled}
    >
      {children}
    </button>
  );
}
