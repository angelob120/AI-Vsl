/**
 * CSV Parsing and Export Utilities
 */

/**
 * Parse CSV text into array of arrays
 * Handles quoted fields and commas within quotes
 */
export const parseCSV = (text) => {
  const lines = text.trim().split('\n');
  return lines.map(line => {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    return values;
  });
};

/**
 * Escape a value for CSV format
 */
export const escapeCSV = (str) => {
  if (typeof str !== 'string') str = String(str);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

/**
 * Export data as CSV file download
 */
export const downloadCSV = (headers, rows, filename) => {
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(escapeCSV).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
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
 * Export RepliQ video results as CSV
 */
export const exportVideosCSV = (videos) => {
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
    video.videoHtmlEmail,
    video.shortVideoHtml,
    video.videoPreview,
    video.backgroundImageLink,
    video.imgHtmlEmail
  ]);

  const filename = `repliq_videos_${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(headers, rows, filename);
};
