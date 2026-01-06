import React from 'react';

const styles = {
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 12px',
    background: '#fafafa',
    border: '1.5px solid #e5e7eb',
    borderRadius: '10px',
  },
  wrapperDark: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  input: {
    width: '32px',
    height: '32px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    padding: 0,
  },
  value: {
    fontSize: '12px',
    fontFamily: "'SF Mono', monospace",
    color: '#6b7280',
    textTransform: 'uppercase',
  },
  valueDark: {
    color: 'rgba(255,255,255,0.6)',
  },
  label: {
    display: 'block',
    fontSize: '11px',
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: '6px',
  },
  labelLight: {
    color: '#374151',
    fontSize: '13px',
    fontWeight: '500',
  },
  // Compact style for inline use
  compact: {
    textAlign: 'center',
  },
  compactInput: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: '2px solid rgba(255,255,255,0.2)',
    cursor: 'pointer',
    padding: 0,
  },
  compactLabel: {
    fontSize: '9px',
    color: 'rgba(255,255,255,0.5)',
    marginTop: '4px',
  },
};

export default function ColorPicker({
  label,
  value,
  onChange,
  theme = 'light',
  variant = 'default',
}) {
  const isDark = theme === 'dark';
  const isCompact = variant === 'compact';

  if (isCompact) {
    return (
      <div style={styles.compact}>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={styles.compactInput}
        />
        {label && <p style={styles.compactLabel}>{label}</p>}
      </div>
    );
  }

  return (
    <div>
      {label && (
        <label style={{
          ...styles.label,
          ...(!isDark && styles.labelLight),
        }}>
          {label}
        </label>
      )}
      <div style={{
        ...styles.wrapper,
        ...(isDark && styles.wrapperDark),
      }}>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={styles.input}
        />
        <span style={{
          ...styles.value,
          ...(isDark && styles.valueDark),
        }}>
          {value}
        </span>
      </div>
    </div>
  );
}
