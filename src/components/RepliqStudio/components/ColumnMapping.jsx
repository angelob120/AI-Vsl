// FILE: src/components/RepliqStudio/components/ColumnMapping.jsx
import React from 'react';

export default function ColumnMapping({ headers, mapping, onMappingChange }) {
  return (
    <div className="column-mapping">
      <h4>Map Columns:</h4>
      
      <div className="mapping-row">
        <label>Company Name *</label>
        <select
          value={mapping.companyName}
          onChange={(e) => onMappingChange('companyName', e.target.value)}
        >
          <option value="">Select column...</option>
          {headers.map(h => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>
      </div>

      <div className="mapping-row">
        <label>First Name</label>
        <select
          value={mapping.firstName}
          onChange={(e) => onMappingChange('firstName', e.target.value)}
        >
          <option value="">Select column...</option>
          {headers.map(h => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>
      </div>

      <div className="mapping-row">
        <label>Website URL</label>
        <select
          value={mapping.websiteUrl}
          onChange={(e) => onMappingChange('websiteUrl', e.target.value)}
        >
          <option value="">Select column...</option>
          {headers.map(h => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>
      </div>
    </div>
  );
}