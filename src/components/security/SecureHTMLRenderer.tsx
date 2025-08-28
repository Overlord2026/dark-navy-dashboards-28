import React from 'react';
import DOMPurify from 'dompurify';
import { sanitizeHtml } from '@/lib/sanitize';

interface SecureHTMLRendererProps {
  content: string;
  className?: string;
  allowedTags?: string[];
  allowedAttributes?: string[];
}

export const SecureHTMLRenderer: React.FC<SecureHTMLRendererProps> = ({
  content,
  className = '',
  allowedTags = ['b', 'i', 'em', 'strong', 'mark', 'span'],
  allowedAttributes = ['class']
}) => {
  const sanitizedContent = React.useMemo(() => {
    const config = {
      ALLOWED_TAGS: allowedTags,
      ALLOWED_ATTR: allowedAttributes,
      KEEP_CONTENT: true,
      FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'iframe'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'href', 'src'],
      ADD_TAGS: [],
      ADD_ATTR: []
    };

    // Additional XSS protection checks
    const xssPatterns = [
      /javascript:/gi,
      /data:(?!image\/)/gi,
      /vbscript:/gi,
      /on\w+\s*=/gi
    ];

    for (const pattern of xssPatterns) {
      if (pattern.test(content)) {
        console.warn('SecureHTMLRenderer: Potentially malicious content detected and blocked');
        return '';
      }
    }

    return DOMPurify.sanitize(content, config);
  }, [content, allowedTags, allowedAttributes]);

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(sanitizedContent) }}
    />
  );
};

// Safe text renderer with minimal HTML support
export const SafeTextRenderer: React.FC<{ text: string; className?: string }> = ({ 
  text, 
  className = '' 
}) => {
  return <span className={className}>{text}</span>;
};