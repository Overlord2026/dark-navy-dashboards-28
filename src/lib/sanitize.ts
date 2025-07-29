import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param html - The HTML string to sanitize
 * @returns Sanitized HTML string safe for rendering
 */
export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['mark', 'span', 'strong', 'em', 'b', 'i'],
    ALLOWED_ATTR: ['class'],
    KEEP_CONTENT: true,
  });
};

/**
 * Renders sanitized HTML content with highlight support
 * @param text - Original text content
 * @param highlights - Highlighted HTML content (potentially unsafe)
 * @returns Object with sanitized HTML string
 */
export const renderSafeHighlight = (text: string, highlights?: string) => {
  if (!highlights || highlights === text) {
    return { __html: text };
  }
  
  return { __html: sanitizeHtml(highlights) };
};