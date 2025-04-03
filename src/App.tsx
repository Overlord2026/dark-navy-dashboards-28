
import { BrowserRouter as Router } from 'react-router-dom';
import { FeatureFlagProvider } from './context/FeatureFlagContext';
import { ConfigProvider } from './context/ConfigContext';
import { ThemeProvider as NextThemesProvider } from './components/ThemeProvider';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider } from './context/UserContext';
import { Toaster } from './components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';
import Routes from './routes';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <NextThemesProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <ConfigProvider>
            <FeatureFlagProvider>
              <UserProvider>
                <Router>
                  <Routes />
                  <Toaster />
                </Router>
              </UserProvider>
            </FeatureFlagProvider>
          </ConfigProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </NextThemesProvider>
  );
}

export default App;
