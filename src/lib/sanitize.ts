import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHtml(html: string) {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b','i','em','strong','a','p','ul','ol','li','br','span'],
    ALLOWED_ATTR: ['href','target','rel'],
  });
}