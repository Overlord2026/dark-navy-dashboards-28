import React from 'react'
import { cn } from '@/lib/utils'

interface SkipLinkProps {
  href?: string
  children: React.ReactNode
  className?: string
}

export function SkipLink({ href = "#main-content", children, className }: SkipLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50",
        "bg-primary text-primary-foreground px-4 py-2 rounded-md",
        "font-medium text-sm transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        className
      )}
      onClick={(e) => {
        e.preventDefault()
        const target = document.querySelector(href)
        if (target instanceof HTMLElement) {
          target.focus()
          target.scrollIntoView({ behavior: 'smooth' })
        }
      }}
    >
      {children}
    </a>
  )
}