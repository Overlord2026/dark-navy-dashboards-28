import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import VipEditorialLanding from '@/components/campaign/VipEditorialLanding';

const CampaignVipEditorial: React.FC = () => {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  
  // Extract editor information from URL params or token
  const editorName = searchParams.get('editor') || undefined;
  const publication = searchParams.get('publication') || undefined;
  const region = searchParams.get('region') || undefined;

  return (
    <VipEditorialLanding
      editorName={editorName}
      publication={publication}
      region={region}
    />
  );
};

export default CampaignVipEditorial;