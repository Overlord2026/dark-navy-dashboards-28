import React from 'react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';

const schema = z.object({
  firm_name:  z.string().min(1, 'Firm name is required'),
  first_name: z.string().min(1),
  last_name:  z.string().min(1),
  email:      z.string().email(),
  phone:      z.string().min(7),
});

export default function AdvisorOnboarding() {
  const [form, setForm] = React.useState({ firm_name:'', first_name:'', last_name:'', email:'', phone:'' });
  const [busy, setBusy] = React.useState(false);
  const [msg, setMsg]   = React.useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    const ok = schema.safeParse(form);
    if (!ok.success) { setMsg(ok.error.issues[0].message); return; }

    setBusy(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setBusy(false); setMsg('Please sign in'); return; }

    // Save profile
    const { error } = await supabase.from('profiles')
      .upsert({ id: user.id, email: form.email, first_name: form.first_name, last_name: form.last_name, phone: form.phone, role: 'advisor' }, { onConflict: 'id' });
    
    if (error) { setBusy(false); setMsg(error.message); return; }

    // Save firm data to localStorage (pros table doesn't have firm fields yet)
    localStorage.setItem('advisor_firm_data', JSON.stringify({
      id: user.id,
      firm_name: form.firm_name,
      contact_first_name: form.first_name,
      contact_last_name: form.last_name,
      email: form.email,
      phone: form.phone
    }));

    setBusy(false);
    setMsg('Saved. Redirecting…');
    window.location.href = '/advisors/home';
  };

  return (
    <div className="min-h-[80vh] bg-bfo-black text-white">
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-3xl font-semibold mb-2">Set up your practice</h1>
        <p className="text-gray-300 mb-6">We'll tune your workspace for your firm.</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-400">Firm name</label>
            <input name="firm_name" value={form.firm_name} onChange={onChange}
              className="w-full p-3 rounded border border-bfo-gold bg-bfo-black text-white" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400">First name</label>
              <input name="first_name" value={form.first_name} onChange={onChange}
                className="w-full p-3 rounded border border-bfo-gold bg-bfo-black text-white" />
            </div>
            <div>
              <label className="text-sm text-gray-400">Last name</label>
              <input name="last_name" value={form.last_name} onChange={onChange}
                className="w-full p-3 rounded border border-bfo-gold bg-bfo-black text-white" />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-400">Email</label>
            <input name="email" value={form.email} onChange={onChange} type="email"
              className="w-full p-3 rounded border border-bfo-gold bg-bfo-black text-white" />
          </div>
          <div>
            <label className="text-sm text-gray-400">Cell phone</label>
            <input name="phone" value={form.phone} onChange={onChange}
              className="w-full p-3 rounded border border-bfo-gold bg-bfo-black text-white" />
          </div>

          {msg && <div className="text-bfo-gold text-sm">{msg}</div>}

          <button disabled={busy}
            className="px-4 py-3 rounded bg-bfo-gold text-black hover:opacity-90 disabled:opacity-50">
            {busy ? 'Saving…' : 'Save & continue'}
          </button>
        </form>
      </div>
    </div>
  );
}