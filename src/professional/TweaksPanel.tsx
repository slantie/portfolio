import React from 'react';

const STORAGE_KEY = 'portfolio-tweaks';

export interface TweakState {
  theme: 'light' | 'device' | 'dark';
  accent: string;
}

const DEFAULTS: TweakState = { theme: 'device', accent: 'indigo' };

export function useTweaks(): [TweakState, (key: keyof TweakState, value: any) => void] {
  const [state, setState] = React.useState<TweakState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return { ...DEFAULTS, ...JSON.parse(stored) };
    } catch {}
    return DEFAULTS;
  });

  const setTweak = React.useCallback((key: keyof TweakState, value: any) => {
    setState((prev) => {
      const next = { ...prev, [key]: value };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  return [state, setTweak];
}

const ACCENT_SWATCHES: { key: string; hex: string }[] = [
  { key: 'indigo',  hex: '#6366f1' },
  { key: 'cyan',    hex: '#06b6d4' },
  { key: 'emerald', hex: '#10b981' },
  { key: 'violet',  hex: '#8b5cf6' },
  { key: 'rose',    hex: '#f43f5e' },
];

const THEME_OPTS = [
  { value: 'light',  icon: '☀' },
  { value: 'device', icon: '◑' },
  { value: 'dark',   icon: '☾' },
] as const;

interface TweaksPanelProps {
  tweaks: TweakState;
  setTweak: (key: keyof TweakState, value: any) => void;
}

export function TweaksPanel({ tweaks, setTweak }: TweaksPanelProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '8px',
    }}>
      {open && (
        <div style={{
          background: 'var(--bg-overlay)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '12px 14px',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            {THEME_OPTS.map(({ value, icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setTweak('theme', value)}
                title={value.charAt(0).toUpperCase() + value.slice(1)}
                style={{
                  width: '34px',
                  height: '28px',
                  border: '1px solid',
                  borderColor: tweaks.theme === value ? 'var(--accent-emphasis)' : 'var(--border-default)',
                  borderRadius: '6px',
                  background: tweaks.theme === value ? 'var(--accent-surface)' : 'transparent',
                  color: tweaks.theme === value ? 'var(--accent-emphasis)' : 'var(--fg-3)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.12s',
                }}
              >
                {icon}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '7px', alignItems: 'center', paddingLeft: '1px' }}>
            {ACCENT_SWATCHES.map(({ key, hex }) => (
              <button
                key={key}
                type="button"
                onClick={() => setTweak('accent', key)}
                title={key.charAt(0).toUpperCase() + key.slice(1)}
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: hex,
                  border: 'none',
                  boxShadow: tweaks.accent === key
                    ? `0 0 0 2px var(--bg-overlay), 0 0 0 3.5px ${hex}`
                    : 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.12s',
                  opacity: tweaks.accent === key ? 1 : 0.4,
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title="Tweaks"
        style={{
          width: '34px',
          height: '34px',
          border: '1px solid var(--border-default)',
          borderRadius: '50%',
          background: 'var(--bg-elevated)',
          color: 'var(--fg-3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-md)',
          transition: 'all 0.12s',
          fontSize: '15px',
          lineHeight: 1,
        }}
      >
        ⚙
      </button>
    </div>
  );
}
