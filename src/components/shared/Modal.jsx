import React from 'react';

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  content: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #0d1520 100%)',
    borderRadius: '20px',
    padding: '48px',
    textAlign: 'center',
    maxWidth: '500px',
    width: '100%',
    border: '1px solid rgba(255,255,255,0.1)',
    position: 'relative',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  contentLight: {
    background: 'white',
    border: '1px solid #e5e7eb',
  },
  closeBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '24px',
    cursor: 'pointer',
    transition: 'color 0.2s',
  },
  closeBtnLight: {
    color: '#9ca3af',
  },
  icon: {
    fontSize: '64px',
    marginBottom: '24px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '12px',
    color: '#fff',
  },
  titleLight: {
    color: '#1a1a2e',
  },
  subtitle: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: '32px',
  },
  subtitleLight: {
    color: '#6b7280',
  },
};

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  subtitle,
  icon,
  showClose = true,
  theme = 'dark',
  maxWidth = '500px',
}) {
  if (!isOpen) return null;

  const isDark = theme === 'dark';

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div
        style={{
          ...styles.content,
          ...(!isDark && styles.contentLight),
          maxWidth,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {showClose && (
          <button
            style={{
              ...styles.closeBtn,
              ...(!isDark && styles.closeBtnLight),
            }}
            onClick={onClose}
          >
            ×
          </button>
        )}
        
        {icon && <div style={styles.icon}>{icon}</div>}
        
        {title && (
          <h2 style={{
            ...styles.title,
            ...(!isDark && styles.titleLight),
          }}>
            {title}
          </h2>
        )}
        
        {subtitle && (
          <p style={{
            ...styles.subtitle,
            ...(!isDark && styles.subtitleLight),
          }}>
            {subtitle}
          </p>
        )}
        
        {children}
      </div>
    </div>
  );
}
