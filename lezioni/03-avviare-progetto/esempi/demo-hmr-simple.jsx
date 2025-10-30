// Demo Hot Module Replacement (HMR) - Versione Semplice
// Questo file dimostra come l'HMR aggiorna il codice senza ricaricare la pagina
// Versione semplificata che usa solo props e rendering statico

// Componente principale che dimostra l'HMR
function HMRDemoSimple() {
  // Per ora usiamo valori statici - imparerai a gestire lo stato dinamico nella Lezione 8!
  const title = "🔥 Demo Hot Module Replacement";
  const subtitle = "Versione Semplice - Solo Rendering Statico";
  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>{title}</h1>
      <p style={{ color: '#666', fontSize: '14px' }}>{subtitle}</p>
      
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
        <h2>Cos'è l'HMR?</h2>
        <p>
          <strong>Hot Module Replacement</strong> permette di aggiornare il codice 
          dell'applicazione senza dover ricaricare l'intera pagina.
        </p>
        <ul style={{ textAlign: 'left' }}>
          <li>Aggiornamenti istantanei</li>
          <li>Nessuna perdita di contesto</li>
          <li>Sviluppo più veloce</li>
        </ul>
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e8f5e8', borderRadius: '8px' }}>
        <h2>🧪 Prova l'HMR:</h2>
        <ol style={{ textAlign: 'left' }}>
          <li>Modifica il testo del titolo sopra in questo file</li>
          <li>Salva il file (Ctrl+S / Cmd+S)</li>
          <li>Osserva che il titolo cambia immediatamente!</li>
          <li>Prova a modificare i colori o gli stili</li>
          <li>Nota che la pagina NON si ricarica</li>
        </ol>
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
        <h3>📋 Esempi di Modifiche da Provare:</h3>
        <ul style={{ textAlign: 'left' }}>
          <li>Cambia il colore di sfondo di questo box</li>
          <li>Aggiungi un nuovo elemento nella lista sopra</li>
          <li>Modifica il testo del titolo principale</li>
          <li>Cambia le dimensioni dei font</li>
        </ul>
      </div>

      <div style={{ padding: '15px', backgroundColor: '#d1ecf1', borderRadius: '8px' }}>
        <h3>💡 Nota per gli Studenti:</h3>
        <p style={{ margin: '10px 0' }}>
          Questo è un esempio semplificato che usa solo <strong>rendering statico</strong>.
          Nella <strong>Lezione 8</strong>, imparerai come creare componenti veramente 
          interattivi che possono cambiare in risposta alle azioni dell'utente!
        </p>
        <p style={{ margin: '10px 0', fontSize: '14px', color: '#666' }}>
          Per ora, concentrati sull'esperienza dell'HMR: modifica il codice e 
          vedi i cambiamenti istantaneamente senza ricaricare la pagina! 🚀
        </p>
      </div>
    </div>
  );
}

export default HMRDemoSimple;

