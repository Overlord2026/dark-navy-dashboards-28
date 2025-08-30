import React from 'react';
import { Link, LinkProps } from 'react-router-dom';

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode };
type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & { children: React.ReactNode };
type RouterLinkProps = LinkProps & { children: React.ReactNode };

export function GoldButton({ children, className='', ...rest }: BtnProps) {
  return (
    <button
      {...rest}
      className={`rounded-md bg-[#D4AF37] text-black px-3 py-1 hover:brightness-95 transition-colors ${className}`}
    >
      {children}
    </button>
  );
}

export function GoldOutlineButton({ children, className='', ...rest }: BtnProps) {
  return (
    <button
      {...rest}
      className={`rounded-md border border-[#D4AF37] px-3 py-1 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors ${className}`}
    >
      {children}
    </button>
  );
}

/** Anchor-based brand buttons */
export function GoldLinkButton({ children, className='', ...rest }: AnchorProps) {
  return (
    <a
      {...rest}
      className={`rounded-md bg-[#D4AF37] text-black px-3 py-1 hover:brightness-95 transition-colors ${className}`}
    >
      {children}
    </a>
  );
}

export function GoldOutlineLinkButton({ children, className='', ...rest }: AnchorProps) {
  return (
    <a
      {...rest}
      className={`rounded-md border border-[#D4AF37] px-3 py-1 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors ${className}`}
    >
      {children}
    </a>
  );
}

/** Router-based brand buttons (optional convenience) */
export function GoldRouterLink({ children, className='', ...rest }: RouterLinkProps) {
  return (
    <Link
      {...rest}
      className={`rounded-md bg-[#D4AF37] text-black px-3 py-1 hover:brightness-95 transition-colors ${className}`}
    >
      {children}
    </Link>
  );
}

export function GoldOutlineRouterLink({ children, className='', ...rest }: RouterLinkProps) {
  return (
    <Link
      {...rest}
      className={`rounded-md border border-[#D4AF37] px-3 py-1 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors ${className}`}
    >
      {children}
    </Link>
  );
}