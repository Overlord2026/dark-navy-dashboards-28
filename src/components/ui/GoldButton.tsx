import * as React from 'react'

export function GoldButton({
  children, 
  className = '', 
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={[
        "relative group inline-flex items-center justify-center rounded-2xl px-4 py-2",
        "bg-ink text-gold-base border border-gold-base shadow-soft",
        "transition-colors duration-200 ease-out",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-base focus-visible:ring-offset-2",
        "hover:text-ink",
        className
      ].join(' ')}
    >
      <span className="relative z-10">{children}</span>
      <span 
        aria-hidden 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 btn-gold-grad" 
      />
    </button>
  )
}