import React from 'react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';

const schema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name:  z.string().min(1, 'Last name is required'),
  email:      z.string().email('Enter a valid email'),
  phone:      z.string().min(7, 'Phone required for verification'),
});

export default function FamilyOnboarding() {
  const [form, setForm] = React.useState({ first_name:'', last_name:'', email:'', phone:'' });
  const [busy, setBusy] = React.useState(false);
  const [msg, setMsg]   = React.useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    const parse = schema.safeParse(form);
    if (!parse.success) { setMsg(parse.error.issues[0].message); return; }

    setBusy(true);
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) { setBusy(false); setMsg('Please sign in first'); return; }

    // Save minimal profile (keyed by id)
    const { error } = await supabase.from('profiles')
      .upsert({ id: user.id, ...form }, { onConflict: 'id' });
    if (error) { setBusy(false); setMsg(error.message); return; }

    // Optional: store a friendly display name
    await supabase.auth.updateUser({ data: { first_name: form.first_name, last_name: form.last_name, phone: form.phone } });

    setBusy(false);
    setMsg('Saved. Redirecting…');
    // navigate to family dashboard or goals
    window.location.href = '/families/home';
  };

  return (
    <div className="min-h-[80vh] bg-[hsl(var(--bfo-black))] text-white">
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-3xl font-semibold mb-2 text-white">Create your family workspace</h1>
        <p className="text-white/70 mb-6">Just the basics—so we can personalize your experience.</p>

        <div className="bfo-card">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-white">First name</label>
                <input name="first_name" value={form.first_name} onChange={onChange}
                  className="input-black" />
              </div>
              <div>
                <label className="text-sm text-white">Last name</label>
                <input name="last_name" value={form.last_name} onChange={onChange}
                  className="input-black" />
              </div>
            </div>
            <div>
              <label className="text-sm text-white">Email</label>
              <input name="email" value={form.email} onChange={onChange} type="email"
                className="input-black" />
            </div>
            <div>
              <label className="text-sm text-white">Cell phone</label>
              <input name="phone" value={form.phone} onChange={onChange} placeholder="+1 555 555 5555"
                className="input-black" />
            </div>

            {msg && <div className="text-[#D4AF37] text-sm">{msg}</div>}

            <button disabled={busy} type="submit" className="btn-gold">
              {busy ? 'Saving…' : 'Save & continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}