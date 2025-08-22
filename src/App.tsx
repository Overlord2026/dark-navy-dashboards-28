import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from "next-themes";
import { Toaster } from '@/components/ui/toaster';
import NILOnboarding from '@/pages/nil/Onboarding';
import Education from '@/pages/nil/Education';
import Disclosures from '@/pages/nil/Disclosures';
import Offers from '@/pages/nil/Offers';
import Marketplace from '@/pages/nil/Marketplace';
import Contract from '@/pages/nil/Contract';
import Payments from '@/pages/nil/Payments';
import Disputes from '@/pages/nil/Disputes';
import Receipts from '@/pages/nil/Receipts';
import Admin from '@/pages/nil/Admin';
import Pricing from '@/pages/Pricing';

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <Router>
        <div className="min-h-screen bg-background text-foreground">
          <Routes>
            <Route path="/" element={<Navigate to="/nil/onboarding" replace />} />
            <Route path="/nil/onboarding" element={<NILOnboarding />} />
            <Route path="/nil/education" element={<Education />} />
            <Route path="/nil/disclosures" element={<Disclosures />} />
            <Route path="/nil/offers" element={<Offers />} />
            <Route path="/nil/marketplace" element={<Marketplace />} />
            <Route path="/nil/contract/:id" element={<Contract />} />
            <Route path="/nil/payments" element={<Payments />} />
            <Route path="/nil/disputes" element={<Disputes />} />
            <Route path="/nil/receipts" element={<Receipts />} />
            <Route path="/nil/admin" element={<Admin />} />
            <Route path="/pricing" element={<Pricing />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;