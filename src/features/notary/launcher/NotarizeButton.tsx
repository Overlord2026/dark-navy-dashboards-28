import React from 'react';
import { useNavigate } from 'react-router-dom';
import analytics from '@/lib/analytics';
import { recordHealthRDS } from '@/features/healthcare/receipts';
import { buildNotaryLink, NotaryLaunchParams } from './link';

type Props = {
  docId: string;
  state?: string;
  mode?: 'RON'|'IN_PERSON';
  title?: string;
  back?: string;
  signerName?: string;
  signerEmail?: string;
  className?: string;
};

export default function NotarizeButton(props: Props){
  const nav = useNavigate();
  
  function go(){
    const href = buildNotaryLink({
      docId: props.docId,
      state: props.state,
      mode: props.mode,
      back: props.back || window.location.pathname + window.location.search,
      title: props.title,
      signerEmail: props.signerEmail,
      signerName: props.signerName
    });
    
    // Analytics + content-free receipt
    analytics.track('notary.launch.click', { 
      docId: props.docId, 
      state: props.state, 
      mode: props.mode, 
      title: props.title 
    });
    
    recordHealthRDS(
      'notary.prefill',
      {},
      'allow',
      [props.state || '', 'mode:' + (props.mode || '')]
    );
    
    nav(href);
  }
  
  return (
    <button 
      onClick={go} 
      className={props.className || 'rounded-xl border border-primary/20 bg-primary/5 px-4 py-2 text-primary hover:bg-primary/10 transition-colors'}
    >
      Notarize this PDF
    </button>
  );
}