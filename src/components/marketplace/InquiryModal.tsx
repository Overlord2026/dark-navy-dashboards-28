import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { GoldButton, GoldOutlineButton } from '@/components/ui/brandButtons';
import { ReceiptChip } from '@/components/receipts/ReceiptChip';

type InquiryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    full_name: string;
    email: string;
    phone?: string;
    message?: string;
    consent_tos: boolean;
  }) => Promise<{ receiptHash?: string | null }>;
  advisorName?: string;
  loading?: boolean;
};

export function InquiryModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  advisorName = '',
  loading = false 
}: InquiryModalProps) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    message: '',
    consent_tos: false
  });
  const [receiptHash, setReceiptHash] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        message: '',
        consent_tos: false
      });
      setReceiptHash(null);
      setSubmitted(false);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consent_tos) return;
    
    try {
      const result = await onSubmit(formData);
      setReceiptHash(result.receiptHash);
      setSubmitted(true);
    } catch (error) {
      console.error('Inquiry submission failed:', error);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="bfo-card border border-bfo-gold bg-bfo-black w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-bfo-gold/20">
          <h2 className="text-xl font-semibold text-white">
            Contact {advisorName || 'Advisor'}
          </h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Full Name */}
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-white mb-1">
              Full Name *
            </label>
            <input
              id="full_name"
              type="text"
              required
              value={formData.full_name}
              onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
              className="w-full px-3 py-2 bg-bfo-purple border border-bfo-gold/30 rounded text-white placeholder-white/50 focus:outline-none focus:border-bfo-gold"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
              Email *
            </label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 bg-bfo-purple border border-bfo-gold/30 rounded text-white placeholder-white/50 focus:outline-none focus:border-bfo-gold"
              placeholder="Enter your email"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-white mb-1">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-3 py-2 bg-bfo-purple border border-bfo-gold/30 rounded text-white placeholder-white/50 focus:outline-none focus:border-bfo-gold"
              placeholder="Enter your phone number"
            />
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-white mb-1">
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              className="w-full px-3 py-2 bg-bfo-purple border border-bfo-gold/30 rounded text-white placeholder-white/50 focus:outline-none focus:border-bfo-gold resize-none"
              placeholder="How can this advisor help you?"
            />
          </div>

          {/* Consent */}
          <div className="flex items-start gap-2">
            <input
              id="consent_tos"
              type="checkbox"
              required
              checked={formData.consent_tos}
              onChange={(e) => setFormData(prev => ({ ...prev, consent_tos: e.target.checked }))}
              className="mt-1 w-4 h-4 text-bfo-gold bg-bfo-purple border border-bfo-gold/30 rounded focus:ring-bfo-gold focus:ring-2"
            />
            <label htmlFor="consent_tos" className="text-sm text-white/80">
              I agree to be contacted and acknowledge the privacy policy *
            </label>
          </div>

          {/* Receipt Display */}
          {submitted && receiptHash && (
            <div className="pt-4 border-t border-bfo-gold/20">
              <div className="mb-2">
                <span className="text-sm text-white/80">Inquiry Receipt:</span>
              </div>
              <ReceiptChip hash={receiptHash} anchored={true} />
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            {!submitted ? (
              <>
                <GoldButton
                  type="submit"
                  disabled={!formData.consent_tos || loading}
                  className="flex-1"
                >
                  {loading ? 'Sending...' : 'Send Inquiry'}
                </GoldButton>
                
                <GoldOutlineButton
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </GoldOutlineButton>
              </>
            ) : (
              <GoldButton
                type="button"
                onClick={onClose}
                className="flex-1"
              >
                Close
              </GoldButton>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}