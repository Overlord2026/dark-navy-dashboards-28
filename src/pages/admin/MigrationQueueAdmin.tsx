import React from 'react';
import { addJob, listJobs, setJobStatus } from '@/features/migrate/queue/store';
import { processJob, retryJob } from '@/features/migrate/queue/worker';
import type { Job, JobStatus } from '@/features/migrate/queue/types';

export default function MigrationQueueAdmin() {
  const [jobs, setJobs] = React.useState<Job[]>(listJobs());
  const [persona, setPersona] = React.useState<'advisor'|'accountant'|'attorney'|'realtor'|'nil'|'smb'>('advisor');
  const [incumbent, setIncumbent] = React.useState<string>('emoney');
  const [submitter, setSubmitter] = React.useState('user@example.com');

  function refresh() { 
    setJobs(listJobs()); 
  }

  async function enqueue() {
    const j = addJob({
      jobId: crypto.randomUUID(),
      createdAt: new Date().toISOString(), 
      updatedAt: new Date().toISOString(),
      persona, 
      incumbent, 
      submitter,
      files: [{ name: 'vault-ref.csv', vaultId: 'vault://import/placeholder.csv' }],
      status: 'queued', 
      attempts: 0
    });
    refresh(); 
    alert(`Enqueued ${j.jobId}`);
  }

  async function run(id: string) { 
    await processJob(id); 
    refresh(); 
  }

  async function retry(id: string) { 
    await retryJob(id); 
    refresh(); 
  }

  async function cancel(id: string) { 
    setJobStatus(id, 'cancelled'); 
    refresh(); 
  }

  return (
    <div className="p-6 space-y-3">
      <h1 className="text-2xl font-semibold">Migration Queue (Admin)</h1>
      
      <div className="grid md:grid-cols-4 gap-2">
        <label className="text-sm">
          Persona
          <select 
            className="w-full rounded-xl border px-2 py-1" 
            value={persona} 
            onChange={e => setPersona(e.target.value as any)}
          >
            <option>advisor</option>
            <option>accountant</option>
            <option>attorney</option>
            <option>realtor</option>
            <option>nil</option>
            <option>smb</option>
          </select>
        </label>
        
        <label className="text-sm">
          Incumbent
          <select 
            className="w-full rounded-xl border px-2 py-1" 
            value={incumbent} 
            onChange={e => setIncumbent(e.target.value)}
          >
            {['emoney','moneyguidepro','rightcapital','ultratax','proseries','lacerte','drake','qbo','xero','clio','mycase','dotloop','docusign_rooms','opendorse','adp','gusto','rippling','custom_csv'].map(k => 
              <option key={k}>{k}</option>
            )}
          </select>
        </label>
        
        <label className="text-sm">
          Notify (email)
          <input 
            className="w-full rounded-xl border px-3 py-2" 
            value={submitter} 
            onChange={e => setSubmitter(e.target.value)} 
          />
        </label>
        
        <div className="flex items-end gap-2">
          <button 
            className="rounded-xl border px-3 py-2" 
            onClick={enqueue}
          >
            Enqueue
          </button>
        </div>
      </div>

      <div className="rounded-xl border overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-2">Job</th>
              <th className="text-left p-2">Persona</th>
              <th className="text-left p-2">Incumbent</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Attempts</th>
              <th className="text-left p-2">Result</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-5 text-center text-gray-500">
                  No jobs
                </td>
              </tr>
            ) : (
              jobs.map(j => (
                <tr key={j.jobId} className="border-t">
                  <td className="p-2 font-mono text-xs">{j.jobId}</td>
                  <td className="p-2">{j.persona}</td>
                  <td className="p-2">{j.incumbent}</td>
                  <td className="p-2">{j.status}</td>
                  <td className="p-2">{j.attempts}</td>
                  <td className="p-2 text-xs">
                    {j.result ? JSON.stringify(j.result) : '-'}
                  </td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      <button 
                        className="rounded-xl border px-2 py-1" 
                        onClick={() => run(j.jobId)} 
                        disabled={j.status !== 'queued'}
                      >
                        Run
                      </button>
                      <button 
                        className="rounded-xl border px-2 py-1" 
                        onClick={() => retry(j.jobId)} 
                        disabled={j.status !== 'error'}
                      >
                        Retry
                      </button>
                      <button 
                        className="rounded-xl border px-2 py-1" 
                        onClick={() => cancel(j.jobId)} 
                        disabled={j.status === 'done' || j.status === 'cancelled'}
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-gray-600">
        Receipts: migrate.queue.start|done|error. Emails: Comms-RDS (sent). All content-free.
      </div>
    </div>
  );
}