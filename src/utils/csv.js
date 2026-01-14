/**
 * CSV Parsing and Export Utilities - Updated for RepliQ Studio
 * Fixed to properly handle escaped quotes ("") in CSV fields
 */

/**
 * Parse a single CSV line handling quoted fields and escaped quotes
 * Properly handles: commas in quotes, escaped quotes (""), newlines in quotes
 */
export const parseCSVLine = (line) => {
  const result = [];
  let current = '';
  let inQuotes = false;
  let i = 0;
  
  while (i < line.length) {
    const char = line[i];
    
    if (inQuotes) {
      if (char === '"') {
        // Check if this is an escaped quote ("") or end of quoted field
        if (i + 1 < line.length && line[i + 1] === '"') {
          // Escaped quote - add single quote and skip next char
          current += '"';
          i += 2;
          continue;
        } else {
          // End of quoted field
          inQuotes = false;
          i++;
          continue;
        }
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        // Start of quoted field
        inQuotes = true;
      } else if (char === ',') {
        // End of field
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    i++;
  }
  
  // Don't forget the last field
  result.push(current);
  
  return result;
};

/**
 * Parse CSV text into array of arrays
 * Handles quoted fields, commas within quotes, and escaped quotes
 */
export const parseCSV = (text) => {
  // Handle different line endings (CRLF, LF, CR)
  const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = normalizedText.trim().split('\n');
  return lines.map(line => parseCSVLine(line));
};

/**
 * Escape a value for CSV format
 * Always quotes fields containing special characters and escapes internal quotes
 */
export const escapeCSV = (str) => {
  if (typeof str !== 'string') str = String(str || '');
  // Always quote if contains comma, quote, newline, or leading/trailing whitespace
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r') || str !== str.trim()) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

/**
 * Export data as CSV file download
 * Now properly escapes headers as well as data
 */
export const downloadCSV = (headers, rows, filename) => {
  const csvContent = [
    headers.map(escapeCSV).join(','),
    ...rows.map(row => row.map(escapeCSV).join(','))
  ].join('\n');
  
  // Add BOM for Excel compatibility with UTF-8
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export contractor websites as CSV
 */
export const exportWebsitesCSV = (websites) => {
  const headers = ['Business Name', 'Website Link', 'Created Date', 'Phone', 'Email'];
  const rows = websites.map(site => [
    site.formData.companyName,
    site.link,
    new Date(site.createdAt).toLocaleDateString(),
    site.formData.phone,
    site.formData.email
  ]);
  
  const filename = `contractor-websites-${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(headers, rows, filename);
};

/**
 * UPDATED: Export RepliQ video results as CSV
 * Now includes Landing Page Link and Video Only Link
 */
export const exportVideosCSV = (videos) => {
  const headers = [
    'Id',
    'Success',
    'Website URL',
    'First Name',
    'Company Name',
    'Landing Page Link',
    'Video Only Link'
  ];

  const rows = videos.map(video => [
    video.id,
    video.success,
    video.originUrl,
    video.firstName,
    video.lastName,
    video.landingPageLink,
    video.videoOnlyLink
  ]);

  const filename = `repliq_videos_${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(headers, rows, filename);
};

/**
 * Legacy export format (for backward compatibility)
 */
export const exportVideosCSVLegacy = (videos) => {
  const headers = [
    'Id',
    'VideoSuccess',
    'OriginUrls',
    'FirstName',
    'LastName',
    'VideoLink',
    'VideoHtmlEmail',
    'ShortVideoHtml',
    'VideoPreview',
    'BackgroundImageLink',
    'ImgHtmlEmail'
  ];

  const rows = videos.map(video => [
    video.id,
    video.success,
    video.originUrl,
    video.firstName,
    video.lastName,
    video.videoLink,
    video.videoHtmlEmail || '',
    video.shortVideoHtml || '',
    video.videoPreview || '',
    video.backgroundImageLink || '',
    video.imgHtmlEmail || ''
  ]);

  const filename = `repliq_videos_legacy_${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(headers, rows, filename);
};