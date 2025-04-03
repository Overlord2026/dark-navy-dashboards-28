
import { BrowserRouter as Router } from 'react-router-dom';
import { FeatureFlagProvider } from './context/FeatureFlagContext';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from './components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';
import Routes from './routes';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <FeatureFlagProvider>
          <Router>
            <Routes />
            <Toaster />
          </Router>
        </FeatureFlagProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
