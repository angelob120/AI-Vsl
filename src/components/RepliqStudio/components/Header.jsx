// FILE: src/components/RepliqStudio/components/Header.jsx
import React from 'react';

export default function Header({ onBack }) {
  return (
    <header className="studio-header">
      <button onClick={onBack} className="back-button">
        ← Back to Builder
      </button>
      <h1>°RepliQ Studio</h1>
      <p>Create personalized video landing pages at scale</p>
    </header>
  );
}