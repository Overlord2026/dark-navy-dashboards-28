import { Button } from '@/components/ui/button';

export default function RunAdvisorDemo() {
  const handleRunDemo = () => {
    // Navigate to advisor demo or trigger demo functionality
    window.location.href = '/personas/advisors';
  };

  return (
    <div className="rounded-2xl border border-bfo-gold bg-black/20 p-6">
      <h3 className="text-xl mb-3 text-white">Try the Advisor Demo</h3>
      <p className="text-sm opacity-70 mb-4 text-white">
        Load a sample advisor workspace with client data, tools, and workflows to see the platform in action.
      </p>
      <Button 
        onClick={handleRunDemo}
        className="bg-bfo-gold text-black hover:bg-bfo-gold/90"
      >
        Launch Demo →
      </Button>
    </div>
  );
}