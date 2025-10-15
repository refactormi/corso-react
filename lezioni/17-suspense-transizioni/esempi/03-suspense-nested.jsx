// Esempio 3: Suspense Nested - Boundary multipli per UI granulare
import { Suspense, useState, useEffect } from 'react';

// Simulazione di diverse API con tempi di caricamento diversi
const createDelayedResource = (data, delay) => {
  let status = 'pending';
  let result;
  
  const promise = new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
  
  const suspender = promise.then(
    (data) => {
      status = 'success';
      result = data;
    },
    (error) => {
      status = 'error';
      result = error;
    }
  );
  
  return {
    read() {
      if (status === 'pending') {
        throw suspender;
      } else if (status === 'error') {
        throw result;
      } else if (status === 'success') {
        return result;
      }
    }
  };
};

// Componente Header veloce
function DashboardHeader({ resource }) {
  const data = resource.read();
  
  return (
    <header style={{
      backgroundColor: '#007bff',
      color: 'white',
      padding: 16,
      borderRadius: '8px 8px 0 0',
      marginBottom: 16
    }}>
      <h1 style={{ margin: 0, fontSize: 24 }}>
        📊 {data.title}
      </h1>
      <p style={{ margin: '8px 0 0 0', opacity: 0.9 }}>
        {data.subtitle}
      </p>
    </header>
  );
}

// Componente Sidebar medio
function DashboardSidebar({ resource }) {
  const data = resource.read();
  
  return (
    <aside style={{
      width: 250,
      backgroundColor: '#f8f9fa',
      border: '1px solid #dee2e6',
      borderRadius: 8,
      padding: 16
    }}>
      <h3 style={{ margin: '0 0 16px 0', color: '#495057' }}>
        🔗 Menu Navigazione
      </h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {data.menuItems.map((item, index) => (
          <li key={index} style={{
            padding: '8px 12px',
            marginBottom: 4,
            backgroundColor: item.active ? '#007bff' : 'transparent',
            color: item.active ? 'white' : '#495057',
            borderRadius: 4,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}>
            {item.icon} {item.label}
          </li>
        ))}
      </ul>
    </aside>
  );
}

// Componente Stats Cards medio-lento
function StatsCards({ resource }) {
  const data = resource.read();
  
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: 16,
      marginBottom: 16
    }}>
      {data.stats.map((stat, index) => (
        <div key={index} style={{
          backgroundColor: 'white',
          border: '1px solid #dee2e6',
          borderRadius: 8,
          padding: 16,
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>
            {stat.icon}
          </div>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: '#007bff' }}>
            {stat.value}
          </div>
          <div style={{ fontSize: 14, color: '#6c757d' }}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}

// Componente Chart lento
function DashboardChart({ resource }) {
  const data = resource.read();
  
  return (
    <div style={{
      backgroundColor: 'white',
      border: '1px solid #dee2e6',
      borderRadius: 8,
      padding: 16,
      minHeight: 300
    }}>
      <h3 style={{ margin: '0 0 16px 0', color: '#495057' }}>
        📈 {data.title}
      </h3>
      
      {/* Simulazione di un grafico */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'end', 
        height: 200, 
        gap: 4,
        padding: '0 16px'
      }}>
        {data.chartData.map((value, index) => (
          <div key={index} style={{
            flex: 1,
            height: `${(value / Math.max(...data.chartData)) * 100}%`,
            backgroundColor: '#007bff',
            borderRadius: '4px 4px 0 0',
            minHeight: 20,
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: -20,
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: 10,
              color: '#6c757d'
            }}>
              {value}
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ 
        marginTop: 16, 
        fontSize: 12, 
        color: '#6c757d',
        textAlign: 'center'
      }}>
        Dati aggiornati: {data.lastUpdate}
      </div>
    </div>
  );
}

// Skeleton components
function HeaderSkeleton() {
  return (
    <div style={{
      backgroundColor: '#e9ecef',
      height: 80,
      borderRadius: '8px 8px 0 0',
      marginBottom: 16,
      animation: 'pulse 1.5s ease-in-out infinite'
    }} />
  );
}

function SidebarSkeleton() {
  return (
    <div style={{
      width: 250,
      backgroundColor: '#e9ecef',
      borderRadius: 8,
      padding: 16
    }}>
      <div style={{ 
        height: 20, 
        backgroundColor: '#dee2e6', 
        borderRadius: 4, 
        marginBottom: 16 
      }} />
      {[...Array(5)].map((_, i) => (
        <div key={i} style={{
          height: 16,
          backgroundColor: '#dee2e6',
          borderRadius: 4,
          marginBottom: 8,
          animation: `pulse 1.5s ease-in-out infinite ${i * 0.1}s`
        }} />
      ))}
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: 16,
      marginBottom: 16
    }}>
      {[...Array(4)].map((_, i) => (
        <div key={i} style={{
          backgroundColor: '#e9ecef',
          borderRadius: 8,
          padding: 16,
          height: 120,
          animation: `pulse 1.5s ease-in-out infinite ${i * 0.2}s`
        }} />
      ))}
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div style={{
      backgroundColor: '#e9ecef',
      borderRadius: 8,
      padding: 16,
      height: 300,
      animation: 'pulse 1.5s ease-in-out infinite'
    }} />
  );
}

// Componente principale con Suspense nested
export default function SuspenseNestedExample() {
  const [key, setKey] = useState(0);
  
  // Risorse con tempi di caricamento diversi
  const [resources] = useState(() => ({
    header: createDelayedResource({
      title: 'Dashboard Aziendale',
      subtitle: 'Panoramica delle performance aziendali'
    }, 500), // 0.5s - veloce
    
    sidebar: createDelayedResource({
      menuItems: [
        { icon: '🏠', label: 'Dashboard', active: true },
        { icon: '📊', label: 'Analytics', active: false },
        { icon: '👥', label: 'Utenti', active: false },
        { icon: '💰', label: 'Vendite', active: false },
        { icon: '⚙️', label: 'Impostazioni', active: false }
      ]
    }, 1500), // 1.5s - medio
    
    stats: createDelayedResource({
      stats: [
        { icon: '👥', value: '1,234', label: 'Utenti Attivi' },
        { icon: '💰', value: '€45,678', label: 'Ricavi Mensili' },
        { icon: '📦', value: '567', label: 'Ordini' },
        { icon: '⭐', value: '4.8', label: 'Rating Medio' }
      ]
    }, 2000), // 2s - medio-lento
    
    chart: createDelayedResource({
      title: 'Vendite Ultime 12 Settimane',
      chartData: [45, 52, 38, 67, 73, 89, 94, 87, 92, 78, 85, 96],
      lastUpdate: new Date().toLocaleString('it-IT')
    }, 3000) // 3s - lento
  }));
  
  const reloadAll = () => {
    setKey(prev => prev + 1);
  };
  
  return (
    <div style={{ padding: 20 }}>
      <h2>🎭 Suspense Nested - Caricamento Granulare</h2>
      
      <div style={{ marginBottom: 20 }}>
        <button 
          onClick={reloadAll}
          style={{
            padding: '10px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 'bold'
          }}
        >
          🔄 Ricarica Dashboard
        </button>
        <span style={{ marginLeft: 12, fontSize: 14, color: '#6c757d' }}>
          Tempi: Header 0.5s, Sidebar 1.5s, Stats 2s, Chart 3s
        </span>
      </div>
      
      <div style={{
        border: '2px solid #007bff',
        borderRadius: 8,
        overflow: 'hidden'
      }}>
        {/* Header con Suspense separato */}
        <Suspense fallback={<HeaderSkeleton />}>
          <DashboardHeader key={`header-${key}`} resource={resources.header} />
        </Suspense>
        
        <div style={{ display: 'flex', gap: 16, padding: '0 16px 16px 16px' }}>
          {/* Sidebar con Suspense separato */}
          <Suspense fallback={<SidebarSkeleton />}>
            <DashboardSidebar key={`sidebar-${key}`} resource={resources.sidebar} />
          </Suspense>
          
          <div style={{ flex: 1 }}>
            {/* Stats con Suspense separato */}
            <Suspense fallback={<StatsSkeleton />}>
              <StatsCards key={`stats-${key}`} resource={resources.stats} />
            </Suspense>
            
            {/* Chart con Suspense separato */}
            <Suspense fallback={<ChartSkeleton />}>
              <DashboardChart key={`chart-${key}`} resource={resources.chart} />
            </Suspense>
          </div>
        </div>
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
          💡 Vantaggi del Suspense Nested:
        </h4>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li><strong>Caricamento granulare:</strong> Ogni sezione si carica indipendentemente</li>
          <li><strong>UX migliorata:</strong> L'utente vede contenuto appena disponibile</li>
          <li><strong>Skeleton specifici:</strong> Ogni sezione ha il suo placeholder</li>
          <li><strong>Performance:</strong> Non blocca l'intera UI per una risorsa lenta</li>
          <li><strong>Resilienza:</strong> Un errore in una sezione non blocca le altre</li>
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
