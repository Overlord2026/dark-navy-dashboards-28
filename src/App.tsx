
import { BrowserRouter as Router } from 'react-router-dom';
import { FeatureFlagProvider } from './context/FeatureFlagContext';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from './components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from './context/UserContext';
import { ThemeProvider as CustomThemeProvider } from './context/ThemeContext';
import './App.css';
import Routes from './routes';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <CustomThemeProvider>
        <QueryClientProvider client={queryClient}>
          <UserProvider>
            <FeatureFlagProvider>
              <Router>
                <Routes />
                <Toaster />
              </Router>
            </FeatureFlagProvider>
          </UserProvider>
        </QueryClientProvider>
      </CustomThemeProvider>
    </ThemeProvider>
  );
}

export default App;
