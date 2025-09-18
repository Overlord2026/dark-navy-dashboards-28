// src/App.tsx - Fixed Navigation (No Page Reloads)
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

const App = () => {
  return (
    <BrowserRouter>
      <div className="app">
        <header
          style={{
            position: 'fixed',
            top: 0,
            width: '100%',
            zIndex: 1000,
            backgroundColor: '#001F3F',
            padding: '10px 20px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <img
            src="/brand/bfo-logo-gold.svg"
            alt="BFO Family Office Logo"
            style={{ height: '50px' }}
          />
        </header>
        
        <nav
          style={{
            position: 'fixed',
            top: '80px',
            width: '100%',
            zIndex: 900,
            backgroundColor: '#333333',
            padding: '10px 20px',
            display: 'flex',
            gap: '20px',
          }}
        >
          {/* FIXED: Using Link instead of <a> tags to prevent page reloads */}
          <Link 
            to="/professionals" 
            style={{ 
              color: '#FFFFFF', 
              textDecoration: 'none',
              padding: '8px 12px',
              borderRadius: '4px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#D4AF37')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            Service Professionals
          </Link>
          
          <Link 
            to="/families/aspiring"
            style={{ 
              color: '#FFFFFF', 
              textDecoration: 'none',
              padding: '8px 12px',
              borderRadius: '4px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#D4AF37')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            Aspiring Families
          </Link>
          
          <Link 
            to="/families/retirees"
            style={{ 
              color: '#FFFFFF', 
              textDecoration: 'none',
              padding: '8px 12px',
              borderRadius: '4px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#D4AF37')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            Retirees
          </Link>
          
          <Link 
            to="/marketplace"
            style={{ 
              color: '#FFFFFF', 
              textDecoration: 'none',
              padding: '8px 12px',
              borderRadius: '4px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#D4AF37')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            Family Office Marketplace
          </Link>
          
        </nav>
        
        <main style={{ marginTop: '140px' }}>
          <Routes>
            <Route path="/" element={<DashboardContent />} />
            <Route path="/professionals" element={<ProfessionalsPage />} />
            <Route path="/families/aspiring" element={<AspiringFamiliesPage />} />
            <Route path="/families/retirees" element={<RetireesPage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

// Dashboard content component
const DashboardContent = () => {
  return (
    <div style={{ 
      padding: '20px', 
      color: '#FFFFFF', 
      backgroundColor: '#0B0F14', 
      minHeight: '100vh' 
    }}>
      <h1 style={{ 
        fontSize: '2rem', 
        marginBottom: '20px', 
        color: '#D4AF37' 
      }}>
        Welcome to BFO Family Office
      </h1>
      <p style={{ 
        fontSize: '1.1rem', 
        marginBottom: '30px' 
      }}>
        Select your role above to access specialized tools and compliance features.
      </p>
      
      {/* Example tool cards would go here */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginTop: '30px'
      }}>
        <div style={{
          backgroundColor: '#001F3F',
          border: '2px solid #D4AF37',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
        }}>
          <h3 style={{ color: '#FFFFFF', marginBottom: '10px' }}>
            ⚖️ Reg BI Tracker
          </h3>
          <ul style={{ color: '#E0E0E0', paddingLeft: '0', listStyle: 'none' }}>
            <li style={{ margin: '5px 0' }}>• Monitors advice fairness</li>
            <li style={{ margin: '5px 0' }}>• Auto-logs interactions</li>
            <li style={{ margin: '5px 0' }}>• Flags conflicts</li>
          </ul>
          <p style={{ color: '#D4AF37', fontStyle: 'italic', marginTop: '15px' }}>
            Stay compliant, save hours
          </p>
        </div>
      </div>
    </div>
  );
};

// Page components
const ProfessionalsPage = () => (
  <div style={{ 
    padding: '20px', 
    color: '#FFFFFF', 
    backgroundColor: '#0B0F14', 
    minHeight: '100vh' 
  }}>
    <h1 style={{ color: '#D4AF37' }}>Service Professionals</h1>
    <p>Professional tools and compliance features will go here.</p>
  </div>
);

const AspiringFamiliesPage = () => (
  <div style={{ 
    padding: '20px', 
    color: '#FFFFFF', 
    backgroundColor: '#0B0F14', 
    minHeight: '100vh' 
  }}>
    <h1 style={{ color: '#D4AF37' }}>Aspiring Families</h1>
    <p>Wealth building tools and education for aspiring families.</p>
  </div>
);

const RetireesPage = () => (
  <div style={{ 
    padding: '20px', 
    color: '#FFFFFF', 
    backgroundColor: '#0B0F14', 
    minHeight: '100vh' 
  }}>
    <h1 style={{ color: '#D4AF37' }}>Retirees</h1>
    <p>Retirement planning and wealth preservation tools.</p>
  </div>
);

const MarketplacePage = () => (
  <div style={{ 
    padding: '20px', 
    color: '#FFFFFF', 
    backgroundColor: '#0B0F14', 
    minHeight: '100vh' 
  }}>
    <h1 style={{ color: '#D4AF37' }}>Family Office Marketplace</h1>
    <p>Connect with professionals and explore family office services.</p>
  </div>
);


export default App;