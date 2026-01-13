import React, { useState, useEffect } from 'react';
import { getArchivedWebsites, getExportHistory, getExportById, getArchiveStats } from '../../api/archive';
import { getTemplateById } from '../ContractorBuilder/templates';
import { downloadCSV } from '../../utils/csv';
import './styles.css';

/**
 * Archive History Component - "Search & Export History" Page
 * 
 * Top Panel: Website Archive - All websites ever created (searchable, permanent)
 * Bottom Panel: CSV Export History - All past exports with re-download capability
 */
export default function ArchiveHistory({ isDarkMode = false }) {
  // Stats
  const [stats, setStats] = useState({
    totalArchivedWebsites: 0,
    totalExports: 0,
    totalWebsitesExported: 0
  });

  // Archived websites
  const [archivedWebsites, setArchivedWebsites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatchFilter, setSelectedBatchFilter] = useState('');
  const [isLoadingWebsites, setIsLoadingWebsites] = useState(true);

  // Export history
  const [exports, setExports] = useState([]);
  const [isLoadingExports, setIsLoadingExports] = useState(true);
  const [downloadingExportId, setDownloadingExportId] = useState(null);

  // Load data on mount
  useEffect(() => {
    loadStats();
    loadArchivedWebsites();
    loadExportHistory();
  }, []);

  // Reload archived websites when search or filter changes
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      loadArchivedWebsites();
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, selectedBatchFilter]);

  const loadStats = async () => {
    const statsData = await getArchiveStats();
    setStats(statsData);
  };

  const loadArchivedWebsites = async () => {
    setIsLoadingWebsites(true);
    const websites = await getArchivedWebsites(searchTerm, selectedBatchFilter);
    setArchivedWebsites(websites);
    setIsLoadingWebsites(false);
  };

  const loadExportHistory = async () => {
    setIsLoadingExports(true);
    const exportsData = await getExportHistory();
    setExports(exportsData);
    setIsLoadingExports(false);
  };

  // Re-download a past CSV export (produces identical CSV from original batch)
  const handleRedownload = async (exportRecord) => {
    setDownloadingExportId(exportRecord.id);
    try {
      const fullExport = await getExportById(exportRecord.id);
      if (fullExport && fullExport.websitesData) {
        const websites = fullExport.websitesData;
        
        // Generate CSV with same format as original
        const headers = ['Business Name', 'Website Link', 'Created Date', 'Phone', 'Email'];
        const rows = websites.map(site => [
          site.formData?.companyName || '',
          site.link || '',
          new Date(site.createdAt).toLocaleDateString(),
          site.formData?.phone || '',
          site.formData?.email || ''
        ]);

        // Use original export date in filename for traceability
        const exportDate = new Date(fullExport.exportedAt).toISOString().split('T')[0];
        const filename = `contractor-websites-${exportDate}-${exportRecord.batchId.slice(-6)}.csv`;
        
        downloadCSV(headers, rows, filename);
      }
    } catch (error) {
      console.error('Re-download failed:', error);
      alert('Failed to re-download CSV. Please try again.');
    }
    setDownloadingExportId(null);
  };

  // Copy link to clipboard
  const copyLink = async (link) => {
    try {
      await navigator.clipboard.writeText(link);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  // Format date nicely
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`archive-history ${isDarkMode ? 'dark' : ''}`}>
      {/* Stats Banner */}
      <div className="archive-stats-banner">
        <div className="stat-card">
          <span className="stat-icon">📦</span>
          <div className="stat-content">
            <span className="stat-value">{stats.totalArchivedWebsites}</span>
            <span className="stat-label">Archived Websites</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">📥</span>
          <div className="stat-content">
            <span className="stat-value">{stats.totalExports}</span>
            <span className="stat-label">CSV Exports</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🔄</span>
          <div className="stat-content">
            <span className="stat-value">{stats.totalWebsitesExported}</span>
            <span className="stat-label">Total Exported</span>
          </div>
        </div>
      </div>

      {/* Top Panel: Website Archive */}
      <div className="archive-panel">
        <div className="panel-header">
          <h2 className="panel-title">
            <span className="panel-icon">🏛️</span>
            Website Archive
          </h2>
          <p className="panel-subtitle">
            All websites ever created. This is your permanent study record.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="archive-toolbar">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by company name, owner, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`search-input ${isDarkMode ? 'dark' : ''}`}
            />
            {searchTerm && (
              <button className="search-clear" onClick={() => setSearchTerm('')}>×</button>
            )}
          </div>

          <div className="filter-box">
            <select
              value={selectedBatchFilter}
              onChange={(e) => setSelectedBatchFilter(e.target.value)}
              className={`filter-select ${isDarkMode ? 'dark' : ''}`}
            >
              <option value="">All Batches</option>
              {exports.map(exp => (
                <option key={exp.batchId} value={exp.batchId}>
                  {formatDate(exp.exportedAt)} ({exp.websiteCount} sites)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Archived Websites List */}
        <div className="archive-list">
          {isLoadingWebsites ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <span>Loading archived websites...</span>
            </div>
          ) : archivedWebsites.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📭</span>
              <span className="empty-text">
                {searchTerm || selectedBatchFilter 
                  ? 'No websites match your search criteria.'
                  : 'No archived websites yet. Download a CSV to archive websites.'}
              </span>
            </div>
          ) : (
            <div className="website-grid">
              {archivedWebsites.map(site => {
                const template = getTemplateById(site.template || 'general');
                return (
                  <div key={site.id} className={`archived-website-card ${isDarkMode ? 'dark' : ''}`}>
                    <div 
                      className="website-color-bar"
                      style={{ 
                        background: `linear-gradient(135deg, ${site.formData?.primaryColor || '#1a3a5c'}, ${site.formData?.accentColor || '#c9a227'})` 
                      }}
                    />
                    <div className="website-card-content">
                      <div className="website-card-header">
                        <h3 className="website-name">{site.formData?.companyName || 'Unnamed'}</h3>
                        <span className="website-template">{template.icon} {template.name}</span>
                      </div>
                      <div className="website-meta">
                        <span className="meta-item">📅 {new Date(site.createdAt).toLocaleDateString()}</span>
                        {site.formData?.phone && <span className="meta-item">📞 {site.formData.phone}</span>}
                      </div>
                      <div className="website-batch">
                        <span className="batch-label">Batch:</span>
                        <span className="batch-id">{site.batchId?.slice(-8)}</span>
                      </div>
                      <div className="website-card-actions">
                        <button 
                          className="card-action-btn"
                          onClick={() => copyLink(site.link)}
                          title="Copy Link"
                        >
                          🔗 Copy
                        </button>
                        <a 
                          href={site.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="card-action-btn"
                          title="Open Website"
                        >
                          🌐 View
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {archivedWebsites.length > 0 && (
          <div className="archive-count">
            Showing {archivedWebsites.length} website{archivedWebsites.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Bottom Panel: CSV Export History */}
      <div className="archive-panel exports-panel">
        <div className="panel-header">
          <h2 className="panel-title">
            <span className="panel-icon">📥</span>
            CSV Export History
          </h2>
          <p className="panel-subtitle">
            All past CSV downloads. Re-download any export to get the exact same CSV.
          </p>
        </div>

        <div className="exports-list">
          {isLoadingExports ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <span>Loading export history...</span>
            </div>
          ) : exports.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📄</span>
              <span className="empty-text">
                No exports yet. Download a CSV from the Website Builder to create your first export.
              </span>
            </div>
          ) : (
            <table className={`exports-table ${isDarkMode ? 'dark' : ''}`}>
              <thead>
                <tr>
                  <th>Export Date</th>
                  <th>Websites</th>
                  <th>Batch ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {exports.map(exp => (
                  <tr key={exp.id}>
                    <td className="export-date">{formatDate(exp.exportedAt)}</td>
                    <td className="export-count">
                      <span className="count-badge">{exp.websiteCount}</span>
                    </td>
                    <td className="export-batch">{exp.batchId.slice(-12)}</td>
                    <td className="export-actions">
                      <button
                        className={`redownload-btn ${downloadingExportId === exp.id ? 'loading' : ''}`}
                        onClick={() => handleRedownload(exp)}
                        disabled={downloadingExportId === exp.id}
                      >
                        {downloadingExportId === exp.id ? (
                          <>⏳ Downloading...</>
                        ) : (
                          <>📥 Re-download CSV</>
                        )}
                      </button>
                      <button
                        className="view-batch-btn"
                        onClick={() => setSelectedBatchFilter(exp.batchId)}
                        title="View websites in this batch"
                      >
                        👁️ View Batch
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
