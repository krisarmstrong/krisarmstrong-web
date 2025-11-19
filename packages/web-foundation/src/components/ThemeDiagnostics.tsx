import React, { useEffect, useState } from 'react';

const tokens = [
  'brand-primary',
  'brand-accent',
  'surface-base',
  'surface-raised',
  'surface-border',
  'surface-hover',
  'text-primary',
  'text-muted',
  'text-accent',
  'text-inverse',
  'interactive-default',
  'interactive-hover',
  'interactive-active',
  'interactive-focus',
  'interactive-disabled',
  'status-success',
  'status-warning',
  'status-error',
  'status-info',
];

export const ThemeDiagnostics: React.FC = () => {
  const [values, setValues] = useState<Record<string, string>>({});
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const getVal = (name: string) =>
      getComputedStyle(root).getPropertyValue(`--theme-${name}`).trim();
    const next: Record<string, string> = {};
    tokens.forEach((t) => (next[t] = getVal(t)));
    setValues(next);
  }, []);

  return (
    <div
      className="theme-diagnostics"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: 'var(--theme-surface-raised)',
        borderTop: '2px solid var(--theme-surface-border)',
        boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1)',
        maxHeight: isOpen ? '400px' : '40px',
        overflow: 'hidden',
        transition: 'max-height 0.3s ease-in-out',
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '8px 12px',
          fontWeight: 600,
          textAlign: 'left',
          cursor: 'pointer',
          backgroundColor: 'transparent',
          border: 'none',
          color: 'var(--theme-text-primary)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>Theme Diagnostics (Dev)</span>
        <span style={{ fontSize: 12 }}>{isOpen ? '▼' : '▲'}</span>
      </button>
      {isOpen && (
        <div style={{ padding: '8px 12px', overflowY: 'auto', maxHeight: '350px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: 8,
            }}
          >
            {tokens.map((t) => (
              <div
                key={t}
                style={{
                  border: '1px solid var(--theme-surface-border)',
                  borderRadius: 6,
                  padding: 8,
                }}
              >
                <div style={{ fontSize: 12, color: 'var(--theme-text-muted)' }}>{t}</div>
                <div style={{ fontSize: 14 }}>{values[t] || ''}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeDiagnostics;
