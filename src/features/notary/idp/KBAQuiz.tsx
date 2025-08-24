import React from 'react';
import { recordDecisionRDS } from '@/lib/rds';

interface KBAQuizProps {
  level?: 'kb2' | 'kb5';
  sessionId: string;
  onPass: () => void;
  onFail: () => void;
}

export default function KBAQuiz({ level = 'kb2', sessionId, onPass, onFail }: KBAQuizProps) {
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [loading, setLoading] = React.useState(false);
  
  const questions = level === 'kb5'
    ? [
        'Street you lived on in 2014?',
        'Which car did you lease?',
        'Mortgage servicer name?',
        'Bank you opened in 2016?',
        'Color of your 2019 sedan?'
      ]
    : [
        'Street you lived on in 2014?',
        'Which car did you lease?'
      ];

  function submit() {
    setLoading(true);
    
    // Demo: pass if at least 1 answer is non-empty
    const pass = Object.values(answers).some(Boolean);
    const action = pass ? 'notary.kba.pass' : 'notary.kba.fail';
    const reasons = [action, level, 'demo_mode'];
    
    // Record Decision-RDS receipt
    recordDecisionRDS({
      action,
      sessionId,
      state: 'DEMO',
      mode: 'RON',
      reasons,
      result: pass ? 'approve' : 'deny',
      metadata: { 
        questionsAnswered: Object.keys(answers).length,
        level,
        demo: true 
      }
    });

    // Analytics tracking
    console.log('[Analytics]', action, { level, questionsAnswered: Object.keys(answers).length });
    
    setTimeout(() => {
      setLoading(false);
      pass ? onPass() : onFail();
    }, 1000);
  }

  return (
    <div className="space-y-4 p-6 bg-card rounded-lg border">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Knowledge-Based Authentication</h3>
        <p className="text-sm text-muted-foreground">
          Demo mode: Answer any one question to proceed. ({level.toUpperCase()} - {questions.length} questions)
        </p>
      </div>
      
      <div className="space-y-3">
        {questions.map((q, i) => (
          <div key={i} className="space-y-1">
            <label className="text-sm font-medium">
              Question {i + 1}: {q}
            </label>
            <input 
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Your answer..."
              onChange={(e) => setAnswers(a => ({ ...a, [String(i)]: e.target.value }))}
              disabled={loading}
            />
          </div>
        ))}
      </div>
      
      <div className="flex gap-2">
        <button 
          className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
          onClick={submit}
          disabled={loading || Object.values(answers).every(v => !v)}
        >
          {loading ? 'Verifying...' : 'Submit Answers'}
        </button>
        <button 
          className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
          onClick={onFail}
          disabled={loading}
        >
          Skip (Fail)
        </button>
      </div>
      
      <div className="text-xs text-muted-foreground">
        ✓ PII-free demo • ✓ Content-free receipts • ✓ Analytics logged
      </div>
    </div>
  );
}