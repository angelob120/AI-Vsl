import React from 'react';

const buttonStyles = {
  base: {
    padding: '12px 20px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    border: 'none',
    fontFamily: 'inherit',
  },
  primary: {
    background: 'linear-gradient(135deg, #10b981, #059669)',
    color: 'white',
  },
  secondary: {
    background: '#f3f4f6',
    color: '#374151',
    border: '1px solid #e5e7eb',
  },
  danger: {
    background: '#fef2f2',
    color: '#dc2626',
    border: '1px solid #fecaca',
  },
  accent: {
    background: 'linear-gradient(135deg, #04CFAF 0%, #00a896 100%)',
    color: '#000',
  },
  ghost: {
    background: 'transparent',
    color: '#6b7280',
    border: '1px solid #e5e7eb',
  },
  small: {
    padding: '8px 14px',
    fontSize: '12px',
  },
  large: {
    padding: '16px 32px',
    fontSize: '16px',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
};

export default function Button({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  onClick,
  style = {},
  ...props
}) {
  const combinedStyles = {
    ...buttonStyles.base,
    ...buttonStyles[variant],
    ...(size === 'small' && buttonStyles.small),
    ...(size === 'large' && buttonStyles.large),
    ...(fullWidth && buttonStyles.fullWidth),
    ...(disabled && buttonStyles.disabled),
    ...style,
  };

  return (
    <button
      style={combinedStyles}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
