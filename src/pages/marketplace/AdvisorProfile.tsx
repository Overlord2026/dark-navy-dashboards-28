import React from 'react';
import { getAdvisor, submitInquiry, type Pro } from '@/services/advisors';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export default function AdvisorProfile() {
  const { id } = useParams<{id:string}>();
  const nav = useNavigate();
  const { toast } = useToast();
  const [pro, setPro] = React.useState<Pro | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [name,setName]=React.useState(''); const [email,setEmail]=React.useState('');
  const [phone,setPhone]=React.useState(''); const [message,setMessage]=React.useState('');

  React.useEffect(()=>{ if(id) getAdvisor(id).then(setPro); },[id]);

  async function onSubmit(e:React.FormEvent) {
    e.preventDefault();
    if (!id) return;
    
    try {
      setLoading(true);
      await submitInquiry({ pro_id:id, name, email, phone, message });
      toast({
        title: "Inquiry sent. We'll follow up shortly.",
        description: "Thank you for your interest!"
      });
      // Clear form
      setName(''); setEmail(''); setPhone(''); setMessage('');
    } catch (error) {
      toast({
        title: "Failed to send inquiry",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  if(!pro) return <div className="p-6 text-gray-400">Loading…</div>;
  return (
    <div className="container mx-auto p-6 space-y-6">
      <button onClick={()=>nav(-1)} className="text-bfo-gold">← Back</button>
      <div className="bfo-card">
        <div className="flex gap-4 items-center">
          <img src={pro.avatar_url ?? '/images/avatar-advisor.png'} className="h-16 w-16 rounded-full border border-bfo-gold"/>
          <div>
            <h1 className="text-2xl text-white">{pro.name}</h1>
            <div className="text-gray-400">{pro.title ?? 'Financial Advisor'} · {pro.location ?? ''}</div>
          </div>
        </div>
        <p className="mt-4 text-gray-300">
          {`Experienced financial advisor with ${pro.years_exp || 'several years'} of experience specializing in ${pro.tags?.join(', ').toLowerCase() || 'wealth management'}.`}
        </p>
      </div>

      <form onSubmit={onSubmit} className="bfo-card space-y-3">
        <h2 className="text-white text-xl">Contact {pro.name}</h2>
        <input className="input-black" placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} required/>
        <input className="input-black" placeholder="Your email" value={email} onChange={e=>setEmail(e.target.value)} type="email" required/>
        <input className="input-black" placeholder="Your phone" value={phone} onChange={e=>setPhone(e.target.value)}/>
        <textarea className="input-black" placeholder="Message (optional)" value={message} onChange={e=>setMessage(e.target.value)}/>
        <button className="btn-gold" type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send inquiry'}
        </button>
      </form>
    </div>
  );
}