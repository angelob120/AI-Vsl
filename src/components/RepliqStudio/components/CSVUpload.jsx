// FILE: src/components/RepliqStudio/components/CSVUpload.jsx
import React from 'react';
import ColumnMapping from './ColumnMapping';

export default function CSVUpload({
  hasData,
  leadsCount,
  csvHeaders,
  columnMapping,
  onUpload,
  onMappingChange,
  inputRef
}) {
  return (
    <section className="control-section">
      <h3>📊 Lead Data (CSV)</h3>
      
      <input
        type="file"
        ref={inputRef}
        accept=".csv"
        onChange={onUpload}
        style={{ display: 'none' }}
      />
      <button 
        onClick={() => inputRef.current?.click()}
        className={`upload-button ${hasData ? 'has-file' : ''}`}
      >
        {hasData ? `✓ ${leadsCount} Leads Loaded` : 'Upload CSV'}
      </button>

      {csvHeaders.length > 0 && (
        <ColumnMapping
          headers={csvHeaders}
          mapping={columnMapping}
          onMappingChange={onMappingChange}
        />
      )}
    </section>
  );
}