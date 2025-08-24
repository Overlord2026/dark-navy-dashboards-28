import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getRonRule } from '@/features/notary/states/ronRules';
import analytics from '@/lib/analytics';
import { recordHealthRDS } from '@/features/healthcare/receipts';
import { NotaryRequest } from '@/features/notary/components/NotaryRequest';

function useQuery(){
  const { search } = useLocation();
  return React.useMemo(()=> new URLSearchParams(search), [search]);
}

export default function NotaryRequestPage() {
  const qp = useQuery();
  const docId = qp.get('docId') || '';
  const state = qp.get('state') || '';
  const mode = qp.get('mode') as 'RON' | 'IN_PERSON' | '' || '';
  const title = qp.get('title') || '';
  const signerName = qp.get('signerName') || '';
  const signerEmail = qp.get('signerEmail') || '';
  const back = qp.get('back') || '/';

  React.useEffect(() => {
    if (docId) {
      analytics.track('notary.prefill.view', { docId, state, mode });
      recordHealthRDS('notary.prefill', {}, 'allow', ['view']);
    }
  }, [docId, state, mode]);

  return (
    <div className="container mx-auto max-w-4xl p-6 space-y-4">
      {back !== '/' && (
        <div className="text-sm">
          <Link to={back} className="text-primary hover:text-primary/80 underline">
            ← Back
          </Link>
        </div>
      )}
      
      {title && (
        <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
          Document: {title}
        </div>
      )}

      <NotaryRequest 
        standalone={true}
        docId={docId}
        docName={title}
        prefillData={{
          state,
          mode: mode || undefined,
          signerName,
          signerEmail
        }}
      />
    </div>
  );
}