import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { sound, type SeKind } from '../lib/sound';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'md' | 'sm';
  auto?: boolean;
  blink?: boolean;
  glow?: boolean;
  /** 押したときの SE。null で無音 */
  se?: SeKind | null;
  children: ReactNode;
}

export function PixelButton({
  variant = 'primary',
  size = 'md',
  auto = false,
  blink = false,
  glow = false,
  se = 'tap',
  className = '',
  onClick,
  children,
  ...rest
}: Props) {
  const classes = [
    'pixel-btn',
    variant !== 'primary' ? `pixel-btn--${variant}` : '',
    size === 'sm' ? 'pixel-btn--sm' : '',
    auto ? 'pixel-btn--auto' : '',
    blink ? 'is-blink' : '',
    glow ? 'pixel-btn--glow' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classes}
      onClick={(e) => {
        if (se) sound.play(se);
        onClick?.(e);
      }}
      {...rest}
    >
      <span className="pixel-btn__label">{children}</span>
    </button>
  );
}
