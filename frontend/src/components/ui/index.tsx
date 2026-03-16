// ─────────────────────────────────────────────
//  Composants UI réutilisables
//  RÈGLE : zéro style inline — tout est dans
//  src/styles/components/
// ─────────────────────────────────────────────
import React from 'react';
import { Loader2 } from 'lucide-react';
import type { EventCategory } from '@/types';
import { EVENT_CATEGORY_LABELS, EVENT_CATEGORY_COLORS } from '@/types';

// ── Bouton ────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:   'primary' | 'secondary' | 'ghost' | 'danger';
  size?:      'sm' | 'md' | 'lg';
  loading?:   boolean;
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
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth  ? 'btn--full'    : '',
    loading    ? 'btn--loading' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button {...props} disabled={disabled || loading} className={classes}>
      {loading && (
        <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} aria-hidden="true" />
      )}
      {children}
    </button>
  );
}

// ── Input ─────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?:  string;
  icon?:  React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, className = '', ...props }, ref) => {
    const inputClasses = [
      'field__input',
      icon      ? 'field__input--has-icon' : '',
      error     ? 'field__input--error'    : '',
      className,
    ].filter(Boolean).join(' ');

    return (
      <div className="field">
        {label && (
          <label className="field__label" htmlFor={props.id}>
            {label}
          </label>
        )}
        <div className="field__wrap">
          {icon && (
            <span className="field__icon" aria-hidden="true">{icon}</span>
          )}
          <input
            ref={ref}
            className={inputClasses}
            aria-invalid={!!error}
            aria-describedby={error ? `${props.id}-error` : undefined}
            {...props}
          />
        </div>
        {error && (
          <p id={`${props.id}-error`} className="field__error" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="field__hint">{hint}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

// ── Badge de catégorie ────────────────────────
export function CategoryBadge({ category }: { category: EventCategory }) {
  const color = EVENT_CATEGORY_COLORS[category];
  const label = EVENT_CATEGORY_LABELS[category];

  return (
    <span
      className="category-badge"
      style={{
        background: `${color}22`,
        border:     `1px solid ${color}55`,
        color,
      }}
      aria-label={`Catégorie : ${label}`}
    >
      <span
        className="category-badge__dot"
        style={{ background: color }}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}

// ── Spinner ───────────────────────────────────
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

// ── Alert ─────────────────────────────────────
export function Alert({
  variant,
  children,
}: {
  variant: 'success' | 'error' | 'warning' | 'info';
  children: React.ReactNode;
}) {
  return (
    <div className={`alert alert--${variant}`} role="alert">
      {children}
    </div>
  );
}

// ── Card ──────────────────────────────────────
export function Card({
  children,
  className = '',
  style,
}: {
  children:   React.ReactNode;
  className?: string;
  style?:     React.CSSProperties;
}) {
  return (
    <div className={`card ${className}`.trim()} style={style}>
      {children}
    </div>
  );
}
