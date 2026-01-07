// FILE: src/components/RepliqStudio/hooks/useCSVData.js
import { useState, useEffect, useRef } from 'react';
import { readFileAsText } from '../utils/fileHelpers';

// Simple CSV parser
const parseCSV = (text) => {
  const lines = text.split('\n');
  return lines.map(line => {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  }).filter(row => row.some(cell => cell));
};

export function useCSVData(importedCSV = null) {
  const [csvData, setCsvData] = useState([]);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [headerRowIndex, setHeaderRowIndex] = useState(0);
  const [columnMapping, setColumnMapping] = useState({
    websiteUrl: '',
    firstName: '',
    companyName: ''
  });
  const [leads, setLeads] = useState([]);
  const inputRef = useRef(null);

  // Handle file upload
  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await readFileAsText(file);
      const parsed = parseCSV(text);
      
      if (parsed && parsed.length > 0) {
        setCsvData(parsed);
        setCsvHeaders(parsed[0] || []);
      }
    } catch (error) {
      console.error('CSV parse error:', error);
    }
  };

  // Handle imported CSV from props
  useEffect(() => {
    if (importedCSV && importedCSV.length > 0) {
      setCsvData(importedCSV);
      setCsvHeaders(importedCSV[0] || []);
    }
  }, [importedCSV]);

  // Update leads when data or mapping changes
  useEffect(() => {
    if (csvData.length <= headerRowIndex + 1 || !columnMapping.companyName) {
      setLeads([]);
      return;
    }

    const headers = csvData[headerRowIndex];
    const newLeads = [];

    for (let i = headerRowIndex + 1; i < csvData.length; i++) {
      const row = csvData[i];
      const lead = {
        websiteUrl: columnMapping.websiteUrl 
          ? row[headers.indexOf(columnMapping.websiteUrl)] 
          : '',
        firstName: columnMapping.firstName 
          ? row[headers.indexOf(columnMapping.firstName)] 
          : '',
        companyName: columnMapping.companyName 
          ? row[headers.indexOf(columnMapping.companyName)] 
          : ''
      };
      
      if (lead.companyName || lead.firstName) {
        newLeads.push(lead);
      }
    }
    
    setLeads(newLeads);
  }, [csvData, columnMapping, headerRowIndex]);

  const triggerUpload = () => {
    inputRef.current?.click();
  };

  const updateMapping = (field, value) => {
    setColumnMapping(prev => ({ ...prev, [field]: value }));
  };

  const reset = () => {
    setCsvData([]);
    setCsvHeaders([]);
    setLeads([]);
    setColumnMapping({ websiteUrl: '', firstName: '', companyName: '' });
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return {
    csvData,
    csvHeaders,
    headerRowIndex,
    setHeaderRowIndex,
    columnMapping,
    updateMapping,
    leads,
    inputRef,
    handleUpload,
    triggerUpload,
    reset,
    hasData: csvData.length > 0
  };
}