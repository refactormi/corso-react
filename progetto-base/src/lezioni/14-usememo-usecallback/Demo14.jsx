import AnalyticsDashboard from './esempi/DashboardAnalytics';
import VirtualizedListDemo from './esempi/ListaVirtualizzata';
import AdvancedSearchSystem from './esempi/RicercaAvanzata';

export default function Demo14() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ border: '1px solid #ddd', borderRadius: 8, overflow: 'hidden' }}>
        <h4 style={{ margin: 0, padding: 12, background: '#f8f9fa' }}>Dashboard Analytics</h4>
        <div style={{ height: 600 }}>
          <AnalyticsDashboard />
        </div>
      </div>
      <div style={{ border: '1px solid #ddd', borderRadius: 8, overflow: 'hidden' }}>
        <h4 style={{ margin: 0, padding: 12, background: '#f8f9fa' }}>Lista Virtualizzata</h4>
        <div style={{ height: 600 }}>
          <VirtualizedListDemo />
        </div>
      </div>
      <div style={{ border: '1px solid #ddd', borderRadius: 8, overflow: 'hidden' }}>
        <h4 style={{ margin: 0, padding: 12, background: '#f8f9fa' }}>Ricerca Avanzata</h4>
        <div style={{ minHeight: 300 }}>
          <AdvancedSearchSystem />
        </div>
      </div>
    </div>
  );
}


