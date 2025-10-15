// Esempio 2: Lazy Loading + Routing con Preload Strategico
import { Suspense, lazy, useState, useEffect } from 'react';

// Simulazione di React Router (semplificata per l'esempio)
const Router = ({ children }) => children;
const Routes = ({ children }) => {
  const [currentPath, setCurrentPath] = useState(window.location.hash || '#home');
  
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash || '#home');
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  const activeRoute = React.Children.toArray(children).find(child => 
    child.props.path === currentPath
  );
  
  return activeRoute || <div>Route non trovata</div>;
};

const Route = ({ path, element }) => element;

// Cache per i componenti precaricati
const componentCache = new Map();

// Funzione di preload con cache
function preloadComponent(importFn, cacheKey) {
  if (componentCache.has(cacheKey)) {
    return componentCache.get(cacheKey);
  }
  
  const componentPromise = importFn();
  componentCache.set(cacheKey, componentPromise);
  
  return componentPromise;
}

// Simulazione componenti pesanti con delay
const createLazyComponent = (name, delay = 2000, content) => {
  return lazy(() => 
    new Promise(resolve => {
      setTimeout(() => {
        resolve({
          default: () => (
            <div style={{
              padding: 24,
              border: '2px solid #28a745',
              borderRadius: 8,
              backgroundColor: '#d4edda',
              color: '#155724'
            }}>
              <h2 style={{ margin: '0 0 16px 0' }}>📄 {name}</h2>
              <p style={{ margin: '0 0 16px 0' }}>{content}</p>
              <div style={{ 
                fontSize: 12, 
                color: '#666',
                padding: 8,
                backgroundColor: 'rgba(255,255,255,0.5)',
                borderRadius: 4
              }}>
                ⏱️ Caricato in {delay}ms • {new Date().toLocaleTimeString()}
              </div>
            </div>
          )
        });
      }, delay);
    })
  );
};

// Componenti lazy con diversi tempi di caricamento
const HomePage = createLazyComponent(
  'Home Page', 
  1000, 
  'Benvenuto nella home page! Questo componente si carica velocemente.'
);

const AboutPage = createLazyComponent(
  'About Page', 
  2000, 
  'Informazioni su di noi. Questo componente ha un tempo di caricamento medio.'
);

const DashboardPage = createLazyComponent(
  'Dashboard', 
  3000, 
  'Dashboard completa con grafici e statistiche. Componente pesante che richiede più tempo.'
);

const ProfilePage = createLazyComponent(
  'Profilo Utente', 
  1500, 
  'Pagina del profilo utente con informazioni personali.'
);

const SettingsPage = createLazyComponent(
  'Impostazioni', 
  2500, 
  'Pannello delle impostazioni dell\'applicazione.'
);

// Link di navigazione con preload intelligente
function NavLink({ to, children, preloadDelay = 100 }) {
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  
  const isActive = window.location.hash === to;
  
  const handleMouseEnter = () => {
    setIsHovering(true);
    
    // Preload dopo un breve delay (evita preload accidentali)
    setTimeout(() => {
      if (!isPreloaded) {
        console.log(`🚀 Preloading component for ${to}`);
        
        // Mappa delle route ai componenti
        const routeMap = {
          '#home': () => import('./HomePage'),
          '#about': () => import('./AboutPage'),
          '#dashboard': () => import('./DashboardPage'),
          '#profile': () => import('./ProfilePage'),
          '#settings': () => import('./SettingsPage')
        };
        
        if (routeMap[to]) {
          preloadComponent(routeMap[to], to);
          setIsPreloaded(true);
        }
      }
    }, preloadDelay);
  };
  
  const handleMouseLeave = () => {
    setIsHovering(false);
  };
  
  const handleClick = (e) => {
    e.preventDefault();
    window.location.hash = to;
  };
  
  return (
    <a
      href={to}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        display: 'inline-block',
        padding: '12px 16px',
        margin: '0 4px',
        textDecoration: 'none',
        borderRadius: 6,
        border: '2px solid',
        borderColor: isActive ? '#007bff' : '#dee2e6',
        backgroundColor: isActive ? '#007bff' : isHovering ? '#f8f9fa' : 'white',
        color: isActive ? 'white' : '#495057',
        fontWeight: isActive ? 'bold' : 'normal',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        position: 'relative'
      }}
    >
      {children}
      
      {/* Indicatore preload */}
      {isPreloaded && (
        <span style={{
          position: 'absolute',
          top: -8,
          right: -8,
          width: 16,
          height: 16,
          backgroundColor: '#28a745',
          borderRadius: '50%',
          fontSize: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          ✓
        </span>
      )}
      
      {/* Indicatore hover */}
      {isHovering && !isActive && (
        <span style={{
          position: 'absolute',
          bottom: -2,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 10
        }}>
          🚀
        </span>
      )}
    </a>
  );
}

// Skeleton personalizzati per ogni pagina
const PageSkeletons = {
  home: () => (
    <div style={{ padding: 24 }}>
      <div style={{ 
        width: 200, 
        height: 32, 
        backgroundColor: '#dee2e6', 
        borderRadius: 4, 
        marginBottom: 16,
        animation: 'pulse 1.5s ease-in-out infinite'
      }} />
      <div style={{ 
        width: '100%', 
        height: 16, 
        backgroundColor: '#dee2e6', 
        borderRadius: 4, 
        marginBottom: 8,
        animation: 'pulse 1.5s ease-in-out infinite'
      }} />
      <div style={{ 
        width: '80%', 
        height: 16, 
        backgroundColor: '#dee2e6', 
        borderRadius: 4,
        animation: 'pulse 1.5s ease-in-out infinite'
      }} />
    </div>
  ),
  
  dashboard: () => (
    <div style={{ padding: 24 }}>
      <div style={{ 
        width: 150, 
        height: 32, 
        backgroundColor: '#dee2e6', 
        borderRadius: 4, 
        marginBottom: 16,
        animation: 'pulse 1.5s ease-in-out infinite'
      }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            height: 100,
            backgroundColor: '#dee2e6',
            borderRadius: 8,
            animation: `pulse 1.5s ease-in-out infinite ${i * 0.1}s`
          }} />
        ))}
      </div>
    </div>
  ),
  
  default: () => (
    <div style={{ padding: 24 }}>
      <div style={{ 
        width: 180, 
        height: 32, 
        backgroundColor: '#dee2e6', 
        borderRadius: 4, 
        marginBottom: 16,
        animation: 'pulse 1.5s ease-in-out infinite'
      }} />
      <div style={{ 
        width: '100%', 
        height: 200, 
        backgroundColor: '#dee2e6', 
        borderRadius: 8,
        animation: 'pulse 1.5s ease-in-out infinite'
      }} />
    </div>
  )
};

// Componente principale
export default function LazyRoutingPreloadExample() {
  const [loadingStats, setLoadingStats] = useState({});
  
  // Monitora i tempi di caricamento
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.name.includes('component')) {
          setLoadingStats(prev => ({
            ...prev,
            [entry.name]: entry.duration
          }));
        }
      });
    });
    
    observer.observe({ entryTypes: ['measure'] });
    
    return () => observer.disconnect();
  }, []);
  
  const currentPath = window.location.hash || '#home';
  
  // Scegli skeleton appropriato
  const getSkeleton = () => {
    if (currentPath === '#home') return <PageSkeletons.home />;
    if (currentPath === '#dashboard') return <PageSkeletons.dashboard />;
    return <PageSkeletons.default />;
  };
  
  return (
    <div style={{ padding: 20 }}>
      <h2>🚀 Lazy Loading + Routing con Preload</h2>
      <p style={{ color: '#666', marginBottom: 24 }}>
        Navigazione ottimizzata con preload intelligente al hover e skeleton personalizzati.
      </p>
      
      {/* Statistiche preload */}
      <div style={{
        marginBottom: 24,
        padding: 16,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        border: '1px solid #dee2e6'
      }}>
        <h4 style={{ margin: '0 0 12px 0' }}>📊 Statistiche Preload</h4>
        <div style={{ fontSize: 14, color: '#666' }}>
          <div><strong>Cache componenti:</strong> {componentCache.size} precaricati</div>
          <div><strong>Pagina corrente:</strong> {currentPath}</div>
          <div><strong>Tip:</strong> Passa il mouse sui link per precaricare i componenti!</div>
        </div>
      </div>
      
      {/* Navigazione */}
      <nav style={{ 
        marginBottom: 24, 
        padding: 16, 
        backgroundColor: 'white',
        borderRadius: 8,
        border: '1px solid #dee2e6',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ marginBottom: 12, fontWeight: 'bold', color: '#495057' }}>
          🧭 Navigazione (Hover per Preload)
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <NavLink to="#home">🏠 Home (1s)</NavLink>
          <NavLink to="#about">ℹ️ About (2s)</NavLink>
          <NavLink to="#dashboard">📊 Dashboard (3s)</NavLink>
          <NavLink to="#profile">👤 Profile (1.5s)</NavLink>
          <NavLink to="#settings">⚙️ Settings (2.5s)</NavLink>
        </div>
      </nav>
      
      {/* Contenuto delle route */}
      <div style={{
        border: '2px dashed #007bff',
        borderRadius: 8,
        backgroundColor: '#f8f9fa',
        minHeight: 300
      }}>
        <div style={{ 
          padding: '12px 16px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          borderRadius: '6px 6px 0 0',
          fontWeight: 'bold'
        }}>
          Route Container
        </div>
        
        <Router>
          <Suspense fallback={getSkeleton()}>
            <Routes>
              <Route path="#home" element={<HomePage />} />
              <Route path="#about" element={<AboutPage />} />
              <Route path="#dashboard" element={<DashboardPage />} />
              <Route path="#profile" element={<ProfilePage />} />
              <Route path="#settings" element={<SettingsPage />} />
            </Routes>
          </Suspense>
        </Router>
      </div>
      
      {/* Spiegazione */}
      <div style={{
        marginTop: 24,
        padding: 16,
        backgroundColor: '#e7f3ff',
        borderRadius: 8,
        border: '1px solid #b3d9ff'
      }}>
        <h4 style={{ margin: '0 0 12px 0', color: '#0056b3' }}>
          💡 Ottimizzazioni Implementate:
        </h4>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14 }}>
          <li><strong>Preload al Hover:</strong> Componenti precaricati quando l'utente passa il mouse</li>
          <li><strong>Cache Intelligente:</strong> Evita download multipli dello stesso componente</li>
          <li><strong>Skeleton Personalizzati:</strong> Loading states specifici per ogni pagina</li>
          <li><strong>Feedback Visivo:</strong> Indicatori di preload e stato attivo</li>
          <li><strong>Performance Monitoring:</strong> Tracciamento tempi di caricamento</li>
        </ul>
      </div>
      
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
