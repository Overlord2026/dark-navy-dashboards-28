-- MICRO_SEC_3: HTML Sanitization Security Enhancement
INSERT INTO public.security_audit_logs (
  table_name,
  operation,
  user_id,
  severity,
  new_data
) VALUES (
  'html_sanitization_hardening',
  'micro_sec_3_sanitize_html',
  auth.uid(),
  'critical',
  jsonb_build_object(
    'security_enhancement', 'MICRO_SEC_3',
    'improvement_type', 'html_sanitization',
    'files_patched', ARRAY[
      'src/components/seo/SchemaBreadcrumbs.tsx',
      'src/components/seo/SchemaLocalBusiness.tsx', 
      'src/components/seo/SchemaOrganization.tsx',
      'src/components/seo/SchemaWebSite.tsx',
      'src/components/ui/chart.tsx'
    ],
    'files_already_secure', ARRAY[
      'src/components/security/SecureHTMLRenderer.tsx',
      'src/features/notary/components/SealPreview.tsx',
      'src/pages/SearchPage.tsx'
    ],
    'sanitizer_library', 'isomorphic-dompurify',
    'total_dangerous_html_usages', 11,
    'patched_usages', 5,
    'already_secured_usages', 3,
    'comment_only_usages', 3,
    'security_benefits', ARRAY[
      'Prevents XSS attacks via malicious HTML injection',
      'Sanitizes JSON-LD schema tags for SEO safety',
      'Secures dynamic CSS generation in chart components',
      'Maintains functionality while preventing script execution',
      'Uses DOMPurify with restricted allowed tags/attributes'
    ],
    'allowed_tags', ARRAY['b','i','em','strong','a','p','ul','ol','li','br','span'],
    'allowed_attributes', ARRAY['href','target','rel'],
    'implementation_date', now(),
    'next_audit_due', now() + interval '30 days'
  )
);