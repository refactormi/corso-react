// Esempio 3: Progressive Loading - Caricamento a priorità per UX ottimale
import { Suspense, useState, useEffect, useMemo } from 'react';

// Simulazione di risorse con diverse priorità
function createPriorityResource(data, delay, priority = 'normal') {
  let status = 'pending';
  let result;
  
  // Simula priorità con delay diversi
  const actualDelay = priority === 'high' ? delay * 0.5 : 
                     priority === 'low' ? delay * 1.5 : delay;
  
  const promise = new Promise(resolve => {
    setTimeout(() => {
      status = 'success';
      result = { ...data, loadTime: actualDelay, priority };
      resolve(result);
    }, actualDelay);
  });
  
  return {
    read() {
      if (status === 'pending') throw promise;
      return result;
    }
  };
}

// Componente Header (priorità alta)
function AppHeader() {
  const [resource] = useState(() => 
    createPriorityResource({
      title: 'Dashboard Aziendale',
      user: 'Mario Rossi',
      notifications: 3
    }, 800, 'high')
  );
  
  const data = resource.read();
  
  return (
    <header style={{
      backgroundColor: '#007bff',
      color: 'white',
      padding: 16,
      borderRadius: '8px 8px 0 0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <h1 style={{ margin: 0, fontSize: 20 }}>{data.title}</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span>👤 {data.user}</span>
        <div style={{
          backgroundColor: '#dc3545',
          borderRadius: '50%',
          width: 24,
          height: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          fontWeight: 'bold'
        }}>
          {data.notifications}
        </div>
      </div>
    </header>
  );
}

// Componente Navigation (priorità alta)
function Navigation() {
  const [resource] = useState(() => 
    createPriorityResource({
      menuItems: [
        { id: 1, label: 'Dashboard', icon: '📊', active: true },
        { id: 2, label: 'Analytics', icon: '📈', active: false },
        { id: 3, label: 'Reports', icon: '📋', active: false },
        { id: 4, label: 'Settings', icon: '⚙️', active: false }
      ]
    }, 600, 'high')
  );
  
  const data = resource.read();
  
  return (
    <nav style={{
      backgroundColor: '#f8f9fa',
      padding: 16,
      borderBottom: '1px solid #dee2e6'
    }}>
      <div style={{ display: 'flex', gap: 8 }}>
        {data.menuItems.map(item => (
          <button
            key={item.id}
            style={{
              padding: '8px 12px',
              border: 'none',
              borderRadius: 4,
              backgroundColor: item.active ? '#007bff' : 'transparent',
              color: item.active ? 'white' : '#495057',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

// Componente Stats Cards (priorità normale)
function StatsCards() {
  const [resource] = useState(() => 
    createPriorityResource({
      stats: [
        { label: 'Vendite Oggi', value: '€12,450', change: '+8.2%', positive: true },
        { label: 'Ordini', value: '1,247', change: '+12.5%', positive: true },
        { label: 'Utenti Attivi', value: '8,932', change: '-2.1%', positive: false },
        { label: 'Conversioni', value: '4.8%', change: '+0.3%', positive: true }
      ]
    }, 1500, 'normal')
  );
  
  const data = resource.read();
  
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: 16,
      padding: 16
    }}>
      {data.stats.map((stat, index) => (
        <div key={index} style={{
          backgroundColor: 'white',
          padding: 16,
          borderRadius: 8,
          border: '1px solid #dee2e6',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: 14, color: '#6c757d', marginBottom: 8 }}>
            {stat.label}
          </div>
          <div style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 4 }}>
            {stat.value}
          </div>
          <div style={{ 
            fontSize: 12, 
            color: stat.positive ? '#28a745' : '#dc3545',
            fontWeight: 'bold'
          }}>
            {stat.change}
          </div>
        </div>
      ))}
    </div>
  );
}

// Componente Chart (priorità normale)
function MainChart() {
  const [resource] = useState(() => 
    createPriorityResource({
      title: 'Vendite Mensili',
      data: [65, 78, 90, 81, 95, 88, 92, 87, 94, 89, 96, 102],
      labels: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic']
    }, 2000, 'normal')
  );
  
  const data = resource.read();
  const maxValue = Math.max(...data.data);
  
  return (
    <div style={{
      backgroundColor: 'white',
      padding: 16,
      borderRadius: 8,
      border: '1px solid #dee2e6',
      margin: 16,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ margin: '0 0 16px 0' }}>{data.title}</h3>
      <div style={{ 
        display: 'flex', 
        alignItems: 'end', 
        height: 200, 
        gap: 4,
        padding: '0 8px'
      }}>
        {data.data.map((value, index) => (
          <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              height: `${(value / maxValue) * 100}%`,
              backgroundColor: '#007bff',
              borderRadius: '4px 4px 0 0',
              minHeight: 20,
              width: '100%',
              marginBottom: 8
            }} />
            <div style={{ fontSize: 10, color: '#6c757d' }}>
              {data.labels[index]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Componente Recent Activity (priorità bassa)
function RecentActivity() {
  const [resource] = useState(() => 
    createPriorityResource({
      activities: [
        { id: 1, user: 'Anna Verdi', action: 'ha completato un ordine', time: '2 min fa', type: 'order' },
        { id: 2, user: 'Marco Bianchi', action: 'si è registrato', time: '5 min fa', type: 'user' },
        { id: 3, user: 'Lucia Neri', action: 'ha lasciato una recensione', time: '8 min fa', type: 'review' },
        { id: 4, user: 'Paolo Rossi', action: 'ha aggiornato il profilo', time: '12 min fa', type: 'profile' },
        { id: 5, user: 'Sara Gialli', action: 'ha fatto un acquisto', time: '15 min fa', type: 'order' }
      ]
    }, 3000, 'low')
  );
  
  const data = resource.read();
  
  const getIcon = (type) => {
    switch (type) {
      case 'order': return '🛒';
      case 'user': return '👤';
      case 'review': return '⭐';
      case 'profile': return '✏️';
      default: return '📝';
    }
  };
  
  return (
    <div style={{
      backgroundColor: 'white',
      padding: 16,
      borderRadius: 8,
      border: '1px solid #dee2e6',
      margin: 16,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ margin: '0 0 16px 0' }}>Attività Recenti</h3>
      <div style={{ maxHeight: 200, overflowY: 'auto' }}>
        {data.activities.map(activity => (
          <div key={activity.id} style={{
            display: 'flex',
            alignItems: 'center',
            padding: 8,
            borderBottom: '1px solid #f8f9fa',
            gap: 12
          }}>
            <span style={{ fontSize: 20 }}>{getIcon(activity.type)}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14 }}>
                <strong>{activity.user}</strong> {activity.action}
              </div>
              <div style={{ fontSize: 12, color: '#6c757d' }}>
                {activity.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Componenti Skeleton per diverse priorità
const HighPrioritySkeleton = ({ height = 60 }) => (
  <div style={{
    height,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    animation: 'pulse 1s ease-in-out infinite',
    border: '2px solid #007bff'
  }} />
);

const NormalPrioritySkeleton = ({ height = 200 }) => (
  <div style={{
    height,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    animation: 'pulse 1.5s ease-in-out infinite',
    border: '1px solid #dee2e6'
  }} />
);

const LowPrioritySkeleton = ({ height = 150 }) => (
  <div style={{
    height,
    backgroundColor: '#f1f3f4',
    borderRadius: 8,
    animation: 'pulse 2s ease-in-out infinite',
    opacity: 0.7
  }} />
);

// Componente principale
export default function ProgressiveLoadingExample() {
  const [loadingPhase, setLoadingPhase] = useState('high');
  
  useEffect(() => {
    // Simula fasi di caricamento
    const phases = ['high', 'normal', 'low', 'complete'];
    let currentPhase = 0;
    
    const interval = setInterval(() => {
      currentPhase++;
      if (currentPhase < phases.length) {
        setLoadingPhase(phases[currentPhase]);
      } else {
        clearInterval(interval);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div style={{ padding: 20 }}>
      <h2>📈 Progressive Loading - Caricamento a Priorità</h2>
      <p style={{ color: '#666', marginBottom: 24 }}>
        Caricamento intelligente che prioritizza i componenti critici per l'UX.
      </p>
      
      {/* Indicatore fasi di caricamento */}
      <div style={{
        marginBottom: 24,
        padding: 16,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        border: '1px solid #dee2e6'
      }}>
        <h4 style={{ margin: '0 0 12px 0' }}>🎯 Fasi di Caricamento</h4>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {[
            { phase: 'high', label: '1. Alta Priorità', color: '#007bff' },
            { phase: 'normal', label: '2. Priorità Normale', color: '#28a745' },
            { phase: 'low', label: '3. Bassa Priorità', color: '#ffc107' },
            { phase: 'complete', label: '4. Completato', color: '#6c757d' }
          ].map(({ phase, label, color }) => (
            <div key={phase} style={{
              padding: '6px 12px',
              borderRadius: 4,
              backgroundColor: loadingPhase === phase ? color : '#e9ecef',
              color: loadingPhase === phase ? 'white' : '#6c757d',
              fontSize: 12,
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}>
              {label}
            </div>
          ))}
        </div>
      </div>
      
      {/* Layout dell'applicazione */}
      <div style={{
        border: '2px dashed #007bff',
        borderRadius: 8,
        backgroundColor: '#f8f9fa',
        overflow: 'hidden'
      }}>
        {/* Header - Priorità Alta */}
        <Suspense fallback={<HighPrioritySkeleton height={60} />}>
          <AppHeader />
        </Suspense>
        
        {/* Navigation - Priorità Alta */}
        <Suspense fallback={<HighPrioritySkeleton height={50} />}>
          <Navigation />
        </Suspense>
        
        {/* Stats Cards - Priorità Normale */}
        <Suspense fallback={<NormalPrioritySkeleton height={120} />}>
          <StatsCards />
        </Suspense>
        
        {/* Main Chart - Priorità Normale */}
        <Suspense fallback={<NormalPrioritySkeleton height={250} />}>
          <MainChart />
        </Suspense>
        
        {/* Recent Activity - Priorità Bassa */}
        <Suspense fallback={<LowPrioritySkeleton height={200} />}>
          <RecentActivity />
        </Suspense>
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
          💡 Strategia Progressive Loading:
        </h4>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14 }}>
          <li><strong>Priorità Alta (Header/Nav):</strong> Caricano per primi, skeleton più evidenti</li>
          <li><strong>Priorità Normale (Stats/Chart):</strong> Contenuto principale, caricamento medio</li>
          <li><strong>Priorità Bassa (Activity):</strong> Contenuto secondario, caricamento differito</li>
          <li><strong>Skeleton Differenziati:</strong> Stili diversi per indicare l'importanza</li>
          <li><strong>UX Ottimale:</strong> L'utente vede subito le parti più importanti</li>
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
