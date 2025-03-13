// src/components/ui/card.jsx

import React from 'react';

// The Card component
export function Card({ children }) {
  return (
    <div className="card border p-4 rounded-md shadow-lg">
      {children}
    </div>
  );
}

// The CardContent component
export function CardContent({ children }) {
  return (
    <div className="card-content p-4">
      {children}
    </div>
  );
}
