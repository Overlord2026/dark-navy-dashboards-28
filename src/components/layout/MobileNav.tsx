import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, VolumeX, Volume2 } from 'lucide-react';
import { useAudio } from '@/context/AudioContext';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { isMuted, setIsMuted } = useAudio();

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent scroll
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navItems = [
    { label: 'Families', href: '/families' },
    { label: 'Professionals', href: '/pros' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Learn', href: '/learn' },
  ];

  const secondaryItems = [
    { label: 'Marketplace', href: '/marketplace' },
    { label: 'HQ', href: '/admin/hq' },
    { label: 'Book Demo', href: '/book' },
    { label: 'Log In', href: '/login' },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Button - Only on mobile */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 text-bfo-gold hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label="Open menu"
        aria-expanded={isOpen}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Slide-out Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-[280px] bg-bfo-black border-l border-bfo-gold/30 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Close Button */}
        <div className="flex justify-end p-4 border-b border-bfo-gold/30">
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-bfo-gold hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Menu Content */}
        <nav className="flex flex-col p-4 space-y-2">
          {/* Main Navigation */}
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={handleLinkClick}
                className="block px-4 py-3 text-bfo-ivory hover:bg-bfo-gold/10 hover:text-bfo-gold rounded-lg transition-colors min-h-[44px] flex items-center"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-bfo-gold/30 my-4" />

          {/* Secondary Navigation */}
          <div className="space-y-1">
            {secondaryItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={handleLinkClick}
                className="block px-4 py-3 text-bfo-ivory hover:bg-bfo-gold/10 hover:text-bfo-gold rounded-lg transition-colors min-h-[44px] flex items-center"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-bfo-gold/30 my-4" />

          {/* Mute Linda Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
              isMuted
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'text-bfo-ivory hover:bg-bfo-gold/10 hover:text-bfo-gold'
            }`}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            <span>{isMuted ? 'Linda Muted' : 'Mute Linda'}</span>
          </button>
        </nav>
      </div>
    </>
  );
}
