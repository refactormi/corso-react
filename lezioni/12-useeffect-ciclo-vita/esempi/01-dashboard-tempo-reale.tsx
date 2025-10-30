import React, { useState, useEffect, useCallback } from 'react'

/**
 * Esempio 1: Dashboard con Dati in Tempo Reale
 * 
 * Questo esempio dimostra:
 * - useEffect per gestire connessioni WebSocket
 * - Cleanup per prevenire memory leaks
 * - Gestione stati di connessione e errori
 * - Aggiornamenti in tempo reale
 * - Hook personalizzati per logica complessa
 */

// Hook personalizzato per dati in tempo reale
function useRealTimeData(endpoint) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  
  const connect = useCallback(() => {
    try {
      const eventSource = new EventSource(endpoint);
      
      eventSource.onopen = () => {
        setConnected(true);
        setError(null);
        setReconnectAttempts(0);
        console.log('Connesso al server'
      };
      
      eventSource.onmessage = (event) => {
        try {
          const newData = JSON.parse(event.data);
          setData(prevData => ({
            ...prevData,
            ...newData,
            timestamp: new Date().toISOString()
          }));
        } catch (err) {
          setError('Errore nel parsing dei dati'
        }
      };
      
      eventSource.onerror = (event) => {
        setConnected(false);
        setError('Errore di connessione'
        setReconnectAttempts(prev => prev + 1);
        
        if (reconnectAttempts < 5) {
          setTimeout(() => {
            console.log(`Tentativo di riconnessione ${reconnectAttempts + 1}/5`);
            connect();
          }, 2000 * (reconnectAttempts + 1));
        }
      };
      
      return eventSource;
    } catch (err) {
      setError('Errore nella creazione della connessione'
      return null;
    }
  }, [endpoint, reconnectAttempts]);
  
  useEffect(() => {
    const eventSource = connect();
    
    return () => {
      if (eventSource) {
        eventSource.close();
        console.log('Connessione chiusa'
      }
    };
  }, [connect]);
  
  return { data, error, connected, reconnectAttempts };
}

// Hook per simulare dati in tempo reale (per demo)
function useMockRealTimeData() {
  const [data, setData] = useState({
    users: 0,
    orders: 0,
    revenue: 0,
    timestamp: new Date().toISOString()
  }
  const [connected, setConnected] = useState(false);
  
  useEffect(() => {
    setConnected(true);
    
    const interval = setInterval(() => {
      setData(prevData => ({
        users: prevData.users + Math.floor(Math.random() * 3),
        orders: prevData.orders + Math.floor(Math.random() * 2),
        revenue: prevData.revenue + Math.floor(Math.random() * 100),
        timestamp: new Date().toISOString()
      }));
    }, 2000);
    
    return () => {
      clearInterval(interval);
      setConnected(false);
    };
  }, []);
  
  return { data, connected, error: null };
}

// Componente per la card delle metriche
function MetricCard({ title, value, icon, color, trend }) {
  return (
    <div style={{ 
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      border: `1px solid ${color}20`,
      borderLeft: `4px solid ${color}`
    } as React.CSSProperties}>
      <div style={{  display: 'flex', alignItems: 'center', justifyContent: 'space-between' } as React.CSSProperties}>
        <div>
          <h3 style={{  
            margin: '0 0 8px 0', 
            fontSize: '14px', 
            color: '#666',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          } as React.CSSProperties}>
            {title}
          </h3>
          <div style={{  
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: '#333',
            marginBottom: '4px'
          } as React.CSSProperties}>
            {value.toLocaleString()}
          </div>
          {trend && (
            <div style={{  
              fontSize: '12px', 
              color: trend > 0 ? '#28a745' : '#dc3545',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            } as React.CSSProperties}>
              {trend > 0 ? '↗️' : '↘️'} {Math.abs(trend)}%
            </div>
          )}
        </div>
        <div style={{  
          fontSize: '32px',
          opacity: 0.8
        } as React.CSSProperties}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// Componente per il grafico delle vendite
function SalesChart({ data }) {
  const [chartData, setChartData] = useState([]);
  
  useEffect(() => {
    if (data) {
      setChartData(prev => {
        const newData = [...prev, {
          time: new Date().toLocaleTimeString(),
          revenue: data.revenue
        }];
        return newData.slice(-10); // Mantieni solo gli ultimi 10 punti
      }
    }
  }, [data]);
  
  if (chartData.length === 0) {
    return (
      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        textAlign: 'center',
        color: '#666'
      } as React.CSSProperties}>
        <div style={{  fontSize: '48px', marginBottom: '10px' } as React.CSSProperties}>📊</div>
        <p>Caricamento dati del grafico...</p>
      </div>
    );
  }
  
  const maxRevenue = Math.max(...chartData.map(d => d.revenue));
  
  return (
    <div style={{ 
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    } as React.CSSProperties}>
      <h3 style={{  margin: '0 0 20px 0', color: '#333' } as React.CSSProperties}>📈 Vendite in Tempo Reale</h3>
      
      <div style={{  
        display: 'flex', 
        alignItems: 'end', 
        height: '200px',
        gap: '8px',
        padding: '20px 0',
        borderBottom: '1px solid #eee'
      } as React.CSSProperties}>
        {chartData.map((point, index) => (
          <div key={index} style={{  flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' } as React.CSSProperties}>
            <div
              style={{ 
                width: '100%',
                height: `${(point.revenue / maxRevenue) * 150}px`,
                backgroundColor: '#007bff',
                borderRadius: '4px 4px 0 0',
                minHeight: '4px',
                transition: 'height 0.3s ease'
              }}
            />
            <div style={{  
              fontSize: '10px', 
              color: '#666', 
              marginTop: '8px',
              transform: 'rotate(-45deg)',
              transformOrigin: 'center'
            } as React.CSSProperties}>
              {point.time.split(':').slice(0, 2).join(':')}
            </div>
          </div>
        ))}
      </div>
      
      <div style={{  
        display: 'flex', 
        justifyContent: 'space-between', 
        marginTop: '15px',
        fontSize: '12px',
        color: '#666'
      } as React.CSSProperties}>
        <span>Ultimo aggiornamento: {data?.timestamp ? new Date(data.timestamp).toLocaleTimeString() : 'N/A'}</span>
        <span>Punti dati: {chartData.length}</span>
      </div>
    </div>
  );
}

// Componente per le notifiche
function NotificationCenter({ data }) {
  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
    if (data) {
      const newNotifications = [];
      
      if (data.users > 0 && data.users % 10 === 0) {
        newNotifications.push({
          id: Date.now(),
          type: 'success',
          message: `🎉 Raggiunti ${data.users} utenti!`,
          timestamp: new Date()
        }
      }
      
      if (data.orders > 0 && data.orders % 5 === 0) {
        newNotifications.push({
          id: Date.now() + 1,
          type: 'info',
          message: `📦 ${data.orders} ordini processati`,
          timestamp: new Date()
        }
      }
      
      if (data.revenue > 0 && data.revenue % 1000 === 0) {
        newNotifications.push({
          id: Date.now() + 2,
          type: 'warning',
          message: `💰 Raggiunti €${data.revenue.toLocaleString()} di fatturato!`,
          timestamp: new Date()
        }
      }
      
      if (newNotifications.length > 0) {
        setNotifications(prev => [...newNotifications, ...prev].slice(0, 5));
      }
    }
  }, [data]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications(prev => prev.slice(0, -1));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (notifications.length === 0) {
    return null;
  }
  
  return (
    <div style={{ 
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 1000,
      maxWidth: '300px'
    } as React.CSSProperties}>
      {notifications.map(notification => (
        <div
          key={notification.id}
          style={{ 
            backgroundColor: notification.type === 'success' ? '#d4edda' : 
                           notification.type === 'warning' ? '#fff3cd' : '#d1ecf1',
            border: `1px solid ${notification.type === 'success' ? '#c3e6cb' : 
                                notification.type === 'warning' ? '#ffeaa7' : '#bee5eb'}`,
            borderRadius: '6px',
            padding: '12px',
            marginBottom: '8px',
            fontSize: '14px',
            animation: 'slideIn 0.3s ease-out'
          }}
        >
          {notification.message}
        </div>
      ))}
    </div>
  );
}

// Componente principale del dashboard
function RealTimeDashboard() {
  const { data, connected, error } = useMockRealTimeData();
  
  if (error) {
    return (
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f8f9fa'
      } as React.CSSProperties}>
        <div style={{ 
          textAlign: 'center',
          padding: '40px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        } as React.CSSProperties}>
          <div style={{  fontSize: '64px', marginBottom: '20px' } as React.CSSProperties}>❌</div>
          <h2 style={{  color: '#dc3545', marginBottom: '10px' } as React.CSSProperties}>Errore di Connessione</h2>
          <p style={{  color: '#666' } as React.CSSProperties}>{error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: 'Arial, sans-serif'
    } as React.CSSProperties}>
      {/* Header */}
      <div style={{ 
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      } as React.CSSProperties}>
        <div style={{  display: 'flex', justifyContent: 'space-between', alignItems: 'center' } as React.CSSProperties}>
          <div>
            <h1 style={{  margin: 0, fontSize: '24px' } as React.CSSProperties}>📊 Dashboard Tempo Reale</h1>
            <p style={{  margin: '5px 0 0 0', opacity: 0.8 } as React.CSSProperties}>
              Monitoraggio in tempo reale delle metriche aziendali
            </p>
          </div>
          
          <div style={{  display: 'flex', alignItems: 'center', gap: '15px' } as React.CSSProperties}>
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: connected ? '#28a745' : '#dc3545',
              borderRadius: '20px',
              fontSize: '14px'
            } as React.CSSProperties}>
              <div style={{ 
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'white',
                animation: connected ? 'pulse 2s infinite' : 'none'
              }} />
              {connected ? 'Connesso' : 'Disconnesso'}
            </div>
            
            <div style={{  fontSize: '12px', opacity: 0.8 } as React.CSSProperties}>
              Ultimo aggiornamento: {data?.timestamp ? new Date(data.timestamp).toLocaleTimeString() : 'N/A'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Contenuto principale */}
      <div style={{  padding: '30px', maxWidth: '1200px', margin: '0 auto' } as React.CSSProperties}>
        
        {/* Metriche principali */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        } as React.CSSProperties}>
          <MetricCard
            title="Utenti Attivi"
            value={data?.users || 0}
            icon="👥"
            color="#007bff"
            trend={12}
          />
          
          <MetricCard
            title="Ordini Oggi"
            value={data?.orders || 0}
            icon="📦"
            color="#28a745"
            trend={8}
          />
          
          <MetricCard
            title="Fatturato"
            value={data?.revenue || 0}
            icon="💰"
            color="#ffc107"
            trend={15}
          />
          
          <MetricCard
            title="Tasso Conversione"
            value={data ? ((data.orders / data.users) * 100).toFixed(1) : 0}
            icon="📈"
            color="#17a2b8"
            trend={-2}
          />
        </div>
        
        {/* Grafico e informazioni aggiuntive */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '20px',
          marginBottom: '30px'
        } as React.CSSProperties}>
          <SalesChart data={data} />
          
          <div style={{ 
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          } as React.CSSProperties}>
            <h3 style={{  margin: '0 0 20px 0', color: '#333' } as React.CSSProperties}>📋 Informazioni Sistema</h3>
            
            <div style={{  marginBottom: '15px' } as React.CSSProperties}>
              <div style={{  fontSize: '12px', color: '#666', marginBottom: '5px' } as React.CSSProperties}>Stato Connessione</div>
              <div style={{  
                fontSize: '16px', 
                color: connected ? '#28a745' : '#dc3545',
                fontWeight: 'bold'
              } as React.CSSProperties}>
                {connected ? '🟢 Attiva' : '🔴 Inattiva'}
              </div>
            </div>
            
            <div style={{  marginBottom: '15px' } as React.CSSProperties}>
              <div style={{  fontSize: '12px', color: '#666', marginBottom: '5px' } as React.CSSProperties}>Frequenza Aggiornamento</div>
              <div style={{  fontSize: '16px', color: '#333' } as React.CSSProperties}>2 secondi</div>
            </div>
            
            <div style={{  marginBottom: '15px' } as React.CSSProperties}>
              <div style={{  fontSize: '12px', color: '#666', marginBottom: '5px' } as React.CSSProperties}>Versione API</div>
              <div style={{  fontSize: '16px', color: '#333' } as React.CSSProperties}>v1.2.3</div>
            </div>
            
            <div>
              <div style={{  fontSize: '12px', color: '#666', marginBottom: '5px' } as React.CSSProperties}>Ultimo Restart</div>
              <div style={{  fontSize: '16px', color: '#333' } as React.CSSProperties}>
                {new Date().toLocaleDateString('it-IT')}
              </div>
            </div>
          </div>
        </div>
        
        {/* Log delle attività */}
        <div style={{ 
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        } as React.CSSProperties}>
          <h3 style={{  margin: '0 0 20px 0', color: '#333' } as React.CSSProperties}>📝 Log Attività</h3>
          
          <div style={{ 
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            padding: '15px',
            fontFamily: 'monospace',
            fontSize: '12px',
            maxHeight: '200px',
            overflowY: 'auto'
          } as React.CSSProperties}>
            {data && (
              <div>
                <div style={{  color: '#28a745' } as React.CSSProperties}>
                  [{new Date(data.timestamp).toLocaleTimeString()}] ✅ Dati aggiornati
                </div>
                <div style={{  color: '#007bff' } as React.CSSProperties}>
                  [{new Date(data.timestamp).toLocaleTimeString()}] 📊 Utenti: {data.users}
                </div>
                <div style={{  color: '#ffc107' } as React.CSSProperties}>
                  [{new Date(data.timestamp).toLocaleTimeString()}] 📦 Ordini: {data.orders}
                </div>
                <div style={{  color: '#17a2b8' } as React.CSSProperties}>
                  [{new Date(data.timestamp).toLocaleTimeString()}] 💰 Fatturato: €{data.revenue.toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Notifiche */}
      <NotificationCenter data={data} />
      
      {/* CSS per animazioni */}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
          
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
}

export default RealTimeDashboard;
