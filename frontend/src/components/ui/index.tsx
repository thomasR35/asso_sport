// ─────────────────────────────────────────────
//  Composants UI réutilisables
//
//  RÈGLE : ces composants ne contiennent
//  aucune logique métier. Ils reçoivent des
//  props et affichent. C'est tout.
// ─────────────────────────────────────────────

import React from 'react';
import { Loader2 } from 'lucide-react';
import type { EventCategory } from '@/types';
import { EVENT_CATEGORY_LABELS, EVENT_CATEGORY_COLORS } from '@/types';

// ═══════════════════════════════════════════
//  Bouton
// ═══════════════════════════════════════════
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  'primary' | 'secondary' | 'ghost' | 'danger';
  size?:     'sm' | 'md' | 'lg';
  loading?:  boolean;
  fullWidth?: boolean;
}

export function Button({
  variant   = 'primary',
  size      = 'md',
  loading   = false,
  fullWidth = false,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <>
      <button
        {...props}
        disabled={disabled || loading}
        className={`btn btn--${variant} btn--${size} ${fullWidth ? 'btn--full' : ''} ${className}`.trim()}
      >
        {loading && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
        {children}
      </button>

      <style>{`
        .btn {
          display: inline-flex; align-items: center; justify-content: center;
          gap: 8px; font-family: var(--font-display); font-weight: 700;
          letter-spacing: 0.06em; text-transform: uppercase;
          border-radius: var(--radius-md); transition: all var(--transition-fast);
          position: relative; overflow: hidden; white-space: nowrap; cursor: pointer;
          border: none;
        }
        /* Effet "balayage diagonal" au survol */
        .btn::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          transform: translateX(-100%) skewX(-15deg);
          transition: transform 0.4s ease;
        }
        .btn:hover::after { transform: translateX(300%) skewX(-15deg); }
        .btn:disabled { opacity: 0.45; cursor: not-allowed; pointer-events: none; }

        .btn--primary  { background: var(--color-primary); color: #fff; box-shadow: 0 0 20px rgba(255,106,0,0.2); }
        .btn--primary:hover { background: var(--color-primary-dim); box-shadow: var(--shadow-glow); }
        .btn--secondary { background: var(--color-bg-elevated); color: var(--color-text); border: 1px solid var(--color-border); }
        .btn--secondary:hover { border-color: var(--color-primary); color: var(--color-primary); }
        .btn--ghost { background: transparent; color: var(--color-text-muted); }
        .btn--ghost:hover { color: var(--color-text); background: var(--color-bg-elevated); }
        .btn--danger { background: var(--color-error); color: #fff; }
        .btn--danger:hover { background: #dc2626; }

        .btn--sm  { padding: 8px 16px;  font-size: 0.75rem; }
        .btn--md  { padding: 12px 24px; font-size: 0.85rem; }
        .btn--lg  { padding: 16px 32px; font-size: 1rem;    }
        .btn--full { width: 100%; }
      `}</style>
    </>
  );
}

// ═══════════════════════════════════════════
//  Champ de formulaire (Input)
// ═══════════════════════════════════════════
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?:  string;
  icon?:  React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, className = '', ...props }, ref) => (
    <>
      <div className="field">
        {label && <label className="field__label">{label}</label>}
        <div className="field__wrap">
          {icon && <span className="field__icon" aria-hidden="true">{icon}</span>}
          <input
            ref={ref}
            className={`field__input ${icon ? 'field__input--has-icon' : ''} ${error ? 'field__input--error' : ''} ${className}`}
            aria-invalid={!!error}
            aria-describedby={error ? `${props.id}-error` : undefined}
            {...props}
          />
        </div>
        {error && <p id={`${props.id}-error`} className="field__error" role="alert">{error}</p>}
        {hint && !error && <p className="field__hint">{hint}</p>}
      </div>

      <style>{`
        .field { display: flex; flex-direction: column; gap: 6px; }
        .field__label {
          font-family: var(--font-display); font-weight: 700; font-size: 0.78rem;
          letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-text-muted);
        }
        .field__wrap { position: relative; }
        .field__icon {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          color: var(--color-text-dim); pointer-events: none; display: flex; align-items: center;
        }
        .field__input {
          width: 100%; padding: 12px 16px;
          background: var(--color-bg-card); border: 1px solid var(--color-border);
          border-radius: var(--radius-md); color: var(--color-text);
          font-size: 0.95rem; font-family: var(--font-body);
          transition: all var(--transition-fast); outline: none;
        }
        .field__input--has-icon { padding-left: 44px; }
        .field__input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px rgba(255,106,0,0.12); }
        .field__input--error { border-color: var(--color-error); }
        .field__input--error:focus { box-shadow: 0 0 0 3px rgba(239,68,68,0.12); }
        .field__input::placeholder { color: var(--color-text-dim); }
        .field__input:disabled { opacity: 0.5; cursor: not-allowed; }
        .field__error { font-size: 0.78rem; color: var(--color-error); font-weight: 500; }
        .field__hint  { font-size: 0.78rem; color: var(--color-text-muted); }
      `}</style>
    </>
  )
);
Input.displayName = 'Input';

// ═══════════════════════════════════════════
//  Badge de catégorie d'événement
// ═══════════════════════════════════════════
export function CategoryBadge({ category }: { category: EventCategory }) {
  const color = EVENT_CATEGORY_COLORS[category];
  const label = EVENT_CATEGORY_LABELS[category];

  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        padding: '3px 10px', borderRadius: 999,
        background: `${color}22`, border: `1px solid ${color}55`,
        color, fontSize: '0.72rem', fontWeight: 700,
        fontFamily: 'var(--font-display)', letterSpacing: '0.06em', textTransform: 'uppercase',
      }}
      aria-label={`Catégorie : ${label}`}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color }} aria-hidden="true" />
      {label}
    </span>
  );
}

// ═══════════════════════════════════════════
//  Indicateur de chargement
// ═══════════════════════════════════════════
export function Spinner({ size = 24 }: { size?: number }) {
  return (
    <Loader2
      size={size}
      style={{ animation: 'spin 1s linear infinite', color: 'var(--color-primary)' }}
      aria-label="Chargement en cours"
      role="status"
    />
  );
}

// ═══════════════════════════════════════════
//  Alerte / message de retour
// ═══════════════════════════════════════════
const ALERT_STYLES = {
  success: { bg: 'rgba(34,197,94,0.1)',  border: 'rgba(34,197,94,0.3)',  color: '#22c55e' },
  error:   { bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.3)',  color: '#ef4444' },
  warning: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', color: '#f59e0b' },
  info:    { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.3)', color: '#3b82f6' },
} as const;

export function Alert({ variant, children }: {
  variant: keyof typeof ALERT_STYLES;
  children: React.ReactNode;
}) {
  const s = ALERT_STYLES[variant];
  return (
    <div
      role="alert"
      style={{
        padding: '12px 16px', borderRadius: 'var(--radius-md)',
        background: s.bg, border: `1px solid ${s.border}`, color: s.color,
        fontSize: '0.9rem', fontWeight: 500, animation: 'fadeIn 0.2s ease',
      }}
    >
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════
//  Carte (conteneur visuel)
// ═══════════════════════════════════════════
export function Card({ children, className = '', style }: {
  children:  React.ReactNode;
  className?: string;
  style?:     React.CSSProperties;
}) {
  return (
    <div
      className={className}
      style={{
        background: 'var(--color-bg-card)', border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)', padding: '24px',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
