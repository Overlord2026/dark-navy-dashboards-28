
import { Routes, Route } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';
import Dashboard from './pages/Index';
import Documents from './pages/Documents';
import Accounts from './pages/Accounts';
import Sharing from './pages/Sharing';
import CustomerProfile from './pages/CustomerProfile';
import NotFound from './pages/NotFound';
import { Toaster } from './components/ui/toaster';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/sharing" element={<Sharing />} />
          <Route path="/profile" element={<CustomerProfile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
