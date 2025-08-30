import React from 'react';

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode };

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