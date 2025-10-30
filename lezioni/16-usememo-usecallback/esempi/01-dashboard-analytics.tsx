import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';

/**
 * Esempio 1: Dashboard Analytics con Memoizzazione
 * 
 * Questo esempio dimostra:
 * - useMemo per calcoli costosi di analytics
 * - useCallback per funzioni di callback
 * - React.memo per ottimizzare componenti figli
 * - Misurazione delle performance
 * - Pattern di ottimizzazione avanzati
 */

// Hook per misurare le performance
function usePerformanceMonitor(componentName) {
  const renderCount = useRef(0);
  const startTime = useRef(performance.now());
  const renderTimes = useRef([]);
  
  useEffect(() => {
    renderCount.current += 1;
    const endTime = performance.now();
    const renderTime = endTime - startTime.current;
    
    renderTimes.current.push(renderTime);
    if (renderTimes.current.length > 10) {
      renderTimes.current.shift();
    }
    
    const averageTime = renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length;
    
    console.log(`${componentName} - Render ${renderCount.current}: ${renderTime.toFixed(2)}ms (Media: ${averageTime.toFixed(2)}ms)`);
    
    startTime.current = performance.now();
  });
  
  return {
    renderCount: renderCount.current,
    averageRenderTime: renderTimes.current.length > 0 
      ? renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length 
      : 0
  };
}

// Componente per le metriche (memoizzato)
const MetricCard = React.memo(function MetricCard({ title, value, trend, color, icon }) {
  usePerformanceMonitor(`MetricCard-${title}`);
  
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      border: `1px solid ${color}20`,
      borderLeft: `4px solid ${color}`,
      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ 
            margin: '0 0 8px 0', 
            fontSize: '14px', 
            color: '#666',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontWeight: '500'
          }}>
            {title}
          </h3>
          <div style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            color: '#333',
            marginBottom: '8px'
          }}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
          {trend !== undefined && (
            <div style={{ 
              fontSize: '14px', 
              color: trend >= 0 ? '#28a745' : '#dc3545',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              {trend >= 0 ? '↗️' : '↘️'} {Math.abs(trend).toFixed(1)}%
            </div>
          )}
        </div>
        <div style={{ 
          fontSize: '40px',
          opacity: 0.8,
          color: color
        }}>
          {icon}
        </div>
      </div>
    </div>
  );
});

// Componente per il grafico (memoizzato)
const ChartComponent = React.memo(function ChartComponent({ data, title, type = 'bar' }) {
  usePerformanceMonitor(`Chart-${title}`);
  
  const chartData = useMemo(() => {
    console.log(`Preparazione dati grafico: ${title}`);
    
    if (type === 'line') {
      return {
        labels: data.map(item => item.label),
        datasets: [{
          label: title,
          data: data.map(item => item.value),
          borderColor: '#007bff',
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }]
      };
    }
    
    return {
      labels: data.map(item => item.label),
      datasets: [{
        label: title,
        data: data.map(item => item.value),
        backgroundColor: [
          '#007bff',
          '#28a745',
          '#ffc107',
          '#dc3545',
          '#6f42c1',
          '#17a2b8'
        ],
        borderColor: '#fff',
        borderWidth: 2
      }]
    };
  }, [data, title, type]);
  
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      marginBottom: '20px'
    }}>
      <h3 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '18px' }}>
        📊 {title}
      </h3>
      
      <div style={{
        height: '300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '2px dashed #dee2e6'
      }}>
        <div style={{ textAlign: 'center', color: '#666' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>📈</div>
          <p>Grafico {type === 'line' ? 'a Linee' : 'a Barre'}</p>
          <p style={{ fontSize: '12px' }}>Dati: {chartData.labels.length} punti</p>
        </div>
      </div>
    </div>
  );
});

// Componente per la tabella (memoizzato)
const DataTable = React.memo(function DataTable({ data, columns, onRowClick }) {
  usePerformanceMonitor('DataTable');
  
  const sortedData = useMemo(() => {
    console.log('Ordinamento dati tabella...');
    return [...data].sort((a, b) => b.value - a.value);
  }, [data]);
  
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    }}>
      <h3 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '18px' }}>
        📋 Dati Dettagliati
      </h3>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '14px'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              {columns.map(column => (
                <th
                  key={column.key}
                  style={{
                    padding: '12px',
                    textAlign: 'left',
                    borderBottom: '2px solid #dee2e6',
                    fontWeight: '600',
                    color: '#495057'
                  }}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, index) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row)}
                style={{
                  cursor: onRowClick ? 'pointer' : 'default',
                  borderBottom: '1px solid #dee2e6',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (onRowClick) {
                    e.target.closest('tr').style.backgroundColor = '#f8f9fa';
                  }
                }}
                onMouseLeave={(e) => {
                  if (onRowClick) {
                    e.target.closest('tr').style.backgroundColor = 'transparent';
                  }
                }}
              >
                {columns.map(column => (
                  <td
                    key={column.key}
                    style={{
                      padding: '12px',
                      borderBottom: '1px solid #dee2e6'
                    }}
                  >
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

// Componente principale del dashboard
function AnalyticsDashboard() {
  const { renderCount, averageRenderTime } = usePerformanceMonitor('AnalyticsDashboard');
  
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [showDetails, setShowDetails] = useState(false);
  
  // Dati di esempio (simulati)
  const rawData = useMemo(() => {
    console.log('Generazione dati raw...');
    
    const generateSalesData = () => {
      const data = [];
      const categories = ['Elettronica', 'Abbigliamento', 'Casa', 'Sport', 'Libri'];
      const regions = ['Nord', 'Centro', 'Sud', 'Isole'];
      
      for (let i = 0; i < 1000; i++) {
        data.push({
          id: i,
          date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          category: categories[Math.floor(Math.random() * categories.length)],
          region: regions[Math.floor(Math.random() * regions.length)],
          amount: Math.floor(Math.random() * 1000) + 10,
          quantity: Math.floor(Math.random() * 10) + 1,
          profit: Math.floor(Math.random() * 200) + 5
        });
      }
      
      return data;
    };
    
    return generateSalesData();
  }, [timeRange]);
  
  // Calcoli di analytics (memoizzati)
  const analytics = useMemo(() => {
    console.log('Calcolo analytics...');
    
    const totalRevenue = rawData.reduce((sum, item) => sum + item.amount, 0);
    const totalProfit = rawData.reduce((sum, item) => sum + item.profit, 0);
    const totalQuantity = rawData.reduce((sum, item) => sum + item.quantity, 0);
    const averageOrderValue = totalRevenue / rawData.length;
    
    // Calcoli per categoria
    const categoryStats = rawData.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = { revenue: 0, profit: 0, quantity: 0, count: 0 };
      }
      acc[item.category].revenue += item.amount;
      acc[item.category].profit += item.profit;
      acc[item.category].quantity += item.quantity;
      acc[item.category].count += 1;
      return acc;
    }, {});
    
    // Calcoli per regione
    const regionStats = rawData.reduce((acc, item) => {
      if (!acc[item.region]) {
        acc[item.region] = { revenue: 0, profit: 0, quantity: 0, count: 0 };
      }
      acc[item.region].revenue += item.amount;
      acc[item.region].profit += item.profit;
      acc[item.region].quantity += item.quantity;
      acc[item.region].count += 1;
      return acc;
    }, {});
    
    // Calcoli per giorno
    const dailyStats = rawData.reduce((acc, item) => {
      const day = item.date.toISOString().split('T')[0];
      if (!acc[day]) {
        acc[day] = { revenue: 0, profit: 0, quantity: 0, count: 0 };
      }
      acc[day].revenue += item.amount;
      acc[day].profit += item.profit;
      acc[day].quantity += item.quantity;
      acc[day].count += 1;
      return acc;
    }, {});
    
    return {
      totalRevenue,
      totalProfit,
      totalQuantity,
      averageOrderValue,
      categoryStats,
      regionStats,
      dailyStats,
      profitMargin: (totalProfit / totalRevenue) * 100
    };
  }, [rawData]);
  
  // Dati per i grafici (memoizzati)
  const chartData = useMemo(() => {
    console.log('Preparazione dati grafici...');
    
    const categoryChartData = Object.entries(analytics.categoryStats).map(([category, stats]) => ({
      label: category,
      value: stats.revenue
    }));
    
    const regionChartData = Object.entries(analytics.regionStats).map(([region, stats]) => ({
      label: region,
      value: stats.revenue
    }));
    
    const dailyChartData = Object.entries(analytics.dailyStats)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .slice(-30) // Ultimi 30 giorni
      .map(([day, stats]) => ({
        label: new Date(day).toLocaleDateString('it-IT', { month: 'short', day: 'numeric' }),
        value: stats.revenue
      }));
    
    return {
      category: categoryChartData,
      region: regionChartData,
      daily: dailyChartData
    };
  }, [analytics]);
  
  // Callback memoizzati
  const handleTimeRangeChange = useCallback((newRange) => {
    setTimeRange(newRange);
  }, []);
  
  const handleMetricChange = useCallback((newMetric) => {
    setSelectedMetric(newMetric);
  }, []);
  
  const handleRowClick = useCallback((row) => {
    console.log('Riga cliccata:', row);
    setShowDetails(!showDetails);
  }, [showDetails]);
  
  const handleRefresh = useCallback(() => {
    console.log('Aggiornamento dati...');
    // Simula refresh dei dati
    window.location.reload();
  }, []);
  
  // Colonne della tabella
  const tableColumns = useMemo(() => [
    { key: 'date', title: 'Data', render: (value) => new Date(value).toLocaleDateString('it-IT') },
    { key: 'category', title: 'Categoria' },
    { key: 'region', title: 'Regione' },
    { key: 'amount', title: 'Importo', render: (value) => `€${value.toLocaleString()}` },
    { key: 'quantity', title: 'Quantità' },
    { key: 'profit', title: 'Profitto', render: (value) => `€${value.toLocaleString()}` }
  ], []);
  
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '30px',
        borderRadius: '12px',
        marginBottom: '30px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>
              📊 Dashboard Analytics
            </h1>
            <p style={{ margin: '10px 0 0 0', opacity: 0.9, fontSize: '16px' }}>
              Analisi delle performance e metriche aziendali
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <select
              value={timeRange}
              onChange={(e) => handleTimeRangeChange(e.target.value)}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontSize: '14px'
              }}
            >
              <option value="7d">Ultimi 7 giorni</option>
              <option value="30d">Ultimi 30 giorni</option>
              <option value="90d">Ultimi 90 giorni</option>
              <option value="1y">Ultimo anno</option>
            </select>
            
            <button
              onClick={handleRefresh}
              style={{
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              🔄 Aggiorna
            </button>
          </div>
        </div>
      </div>
      
      {/* Metriche principali */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <MetricCard
          title="Ricavi Totali"
          value={analytics.totalRevenue}
          trend={12.5}
          color="#007bff"
          icon="💰"
        />
        
        <MetricCard
          title="Profitto Totale"
          value={analytics.totalProfit}
          trend={8.3}
          color="#28a745"
          icon="📈"
        />
        
        <MetricCard
          title="Quantità Vendute"
          value={analytics.totalQuantity}
          trend={15.2}
          color="#ffc107"
          icon="📦"
        />
        
        <MetricCard
          title="Valore Medio Ordine"
          value={`€${analytics.averageOrderValue.toFixed(2)}`}
          trend={-2.1}
          color="#dc3545"
          icon="🛒"
        />
        
        <MetricCard
          title="Margine di Profitto"
          value={`${analytics.profitMargin.toFixed(1)}%`}
          trend={5.7}
          color="#6f42c1"
          icon="📊"
        />
      </div>
      
      {/* Grafici */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <ChartComponent
          data={chartData.category}
          title="Vendite per Categoria"
          type="bar"
        />
        
        <ChartComponent
          data={chartData.region}
          title="Vendite per Regione"
          type="bar"
        />
        
        <ChartComponent
          data={chartData.daily}
          title="Andamento Giornaliero"
          type="line"
        />
      </div>
      
      {/* Tabella dati */}
      <DataTable
        data={rawData.slice(0, 50)} // Mostra solo i primi 50 elementi
        columns={tableColumns}
        onRowClick={handleRowClick}
      />
      
      {/* Performance info */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '6px',
        fontSize: '12px',
        fontFamily: 'monospace'
      }}>
        <div>Render: {renderCount}</div>
        <div>Media: {averageRenderTime.toFixed(2)}ms</div>
        <div>Dati: {rawData.length} record</div>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;




