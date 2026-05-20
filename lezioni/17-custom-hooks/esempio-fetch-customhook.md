# Custom Hook `useApi`: fetch al load e al click

Un pattern semplice per gestire chiamate HTTP con lo **stesso hook**, sia al mount del componente sia su azione dell'utente.

---

## L'hook `useApi`

Un **custom hook** è una funzione che incapsula logica riutilizzabile. Invece di riscrivere in ogni componente `useState` + `fetch` + gestione errori, la metti tutta in un unico posto e la richiami con una riga.

`useApi` fa esattamente questo per le chiamate HTTP: tu gli passi un URL, lui si occupa di caricare i dati e di tenere traccia se la richiesta è in corso, è andata a buon fine o ha fallito.

**Parametri:**

| Parametro | Cosa è | Esempio |
|-----------|--------|---------|
| `url` | Indirizzo dell'API da chiamare | `'/api/users'` |
| `options` | Opzioni extra (opzionali). La più importante è `autoFetch` | `{ autoFetch: false }` |

```tsx
import { useState, useCallback, useEffect } from 'react';

/**
 * Hook per chiamare un'API e gestire dati, caricamento ed errori.
 *
 * @param url - Indirizzo dell'endpoint (es. '/api/users')
 * @param options - Opzioni aggiuntive. autoFetch: false evita la chiamata automatica al mount
 */
function useApi(url, options = {}) {
  // Tre "caselle" di stato: cosa abbiamo ricevuto, se stiamo aspettando, se c'è un errore
  const [data, setData] = useState(null);       // null = ancora nessun dato
  const [loading, setLoading] = useState(false); // false = non stiamo caricando
  const [error, setError] = useState(null);      // null = nessun errore

  // Funzione che esegue la chiamata HTTP.
  // useCallback la memorizza: non viene ricreata a ogni render a meno che url/options cambino.
  const fetchData = useCallback(async () => {
    setLoading(true);   // mostriamo all'utente che stiamo caricando
    setError(null);     // cancelliamo eventuali errori precedenti

    try {
      const response = await fetch(url, options); // chiamata all'API

      // response.ok è false se il server risponde con errore (404, 500, ecc.)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json(); // convertiamo la risposta in oggetto JavaScript
      setData(result);                      // salviamo i dati nello stato
    } catch (err) {
      setError(err.message); // rete assente, URL sbagliato, risposta non valida...
    } finally {
      setLoading(false); // a prescindere da successo o errore, il caricamento è finito
    }
  }, [url, options]);

  // refetch fa la stessa cosa di fetchData — nome diverso, stessa funzione.
  // "refetch" comunica meglio l'intenzione quando ricarichi dati già mostrati.
  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // useEffect esegue codice quando il componente viene montato (appare a schermo).
  // Qui decidiamo se partire subito con la fetch o aspettare un click dell'utente.
  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchData(); // default: carica i dati appena il componente appare
    }
    // se autoFetch è false, non facciamo nulla — la fetch partirà solo quando chiami fetchData()
  }, [fetchData, options.autoFetch]);

  // Restituiamo tutto ciò che il componente può usare
  return {
    data,       // i dati ricevuti dall'API
    loading,    // true/false — utile per spinner e bottoni disabilitati
    error,      // messaggio di errore, o null
    fetchData,  // avvia la fetch manualmente (es. al click di un bottone)
    refetch,    // identico a fetchData, nome più chiaro per "ricarica"
  };
}
```

**Quando parte la fetch?**

| Come chiami l'hook | Cosa succede |
|--------------------|--------------|
| `useApi('/api/users')` | Fetch **automatica** quando il componente appare a schermo |
| `useApi('/api/users', { autoFetch: false })` | **Nessuna** fetch automatica — la avvii tu con `fetchData()` o `refetch()` |

**Cosa ottieni dal componente:**

| Valore | Tipo | Significato |
|--------|------|-------------|
| `data` | oggetto/array o `null` | Dati restituiti dall'API. `null` finché la prima fetch non termina |
| `loading` | `true` / `false` | `true` = richiesta in corso. Usalo per spinner o disabilitare bottoni |
| `error` | stringa o `null` | Messaggio descrittivo se qualcosa va storto. `null` = tutto ok |
| `fetchData` | funzione | Esegui la fetch quando vuoi (tipico: `onClick` di un bottone) |
| `refetch` | funzione | Stessa cosa di `fetchData`. Nome più naturale per un bottone "Ricarica" |

---

## Esempio 1 — Fetch al load del componente

### Contesto

Immagina una **pagina elenco utenti** (`/users`) in un'app di amministrazione: appena l'utente apre la pagina, la lista deve comparire subito. Non ha senso chiedere un click per vedere dati che l'utente si aspetta già lì.

**Quando usare questo pattern:**
- Dashboard con metriche in tempo reale
- Liste di prodotti, ordini, utenti
- Dettaglio di una risorsa quando l'URL contiene già l'ID (es. `/users/42`)

**Comportamento atteso:**
1. L'utente naviga su `/users`
2. Il componente `UserList` viene montato
3. `useApi` parte automaticamente e mostra uno spinner
4. Al termine, compare la tabella con nome, email e città
5. L'utente può cliccare "Aggiorna lista" per rifare la fetch

```tsx
// Tipo che descrive un utente restituito dall'API
interface User {
  id: number;
  name: string;
  email: string;
  address: { city: string };
}

/**
 * Componente per visualizzare l'elenco degli utenti registrati.
 * Tipico di una sezione "Gestione utenti" in un pannello admin.
 *
 * Montato su una route tipo: <Route path="/users" element={<UserList />} />
 */
function UserList() {
  const { data, loading, error, refetch } = useApi(
    'https://jsonplaceholder.typicode.com/users'
    // autoFetch non specificato → fetch automatica al mount ✅
  );

  // Stato 1: prima risposta in arrivo
  if (loading && !data) {
    return (
      <section aria-busy="true">
        <h2>Utenti registrati</h2>
        <p>Caricamento elenco utenti...</p>
      </section>
    );
  }

  // Stato 2: qualcosa è andato storto (rete, 404, 500...)
  if (error) {
    return (
      <section>
        <h2>Utenti registrati</h2>
        <p role="alert">Impossibile caricare gli utenti: {error}</p>
        <button onClick={refetch}>Riprova</button>
      </section>
    );
  }

  // Stato 3: dati disponibili (lista vuota o popolata)
  return (
    <section>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Utenti registrati</h2>
          <p>{data?.length ?? 0} utenti trovati</p>
        </div>
        <button onClick={refetch} disabled={loading}>
          {loading ? 'Aggiornamento...' : 'Aggiorna lista'}
        </button>
      </header>

      {data?.length === 0 ? (
        <p>Nessun utente presente.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Città</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.address.city}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
```

**Punti pratici:**
- Al **mount** → `useEffect` interno chiama `fetchData()` senza che tu scriva nulla
- `refetch` sul bottone "Aggiorna lista" riusa la stessa logica (loading, error, data)
- `loading && !data` distingue il **primo caricamento** dal **refresh** (in quel caso la tabella resta visibile mentre aggiorni)

---

## Esempio 2 — Fetch al click del bottone

### Contesto

Immagina una **pagina report** o un **modulo di export**: i dati sono pesanti o costosi da recuperare, quindi non vuoi chiamare l'API finché l'utente non lo chiede esplicitamente. Oppure l'URL della fetch dipende da un'azione (es. "Genera report del mese corrente").

**Quando usare questo pattern:**
- Export CSV/PDF su richiesta
- Ricerche che partono solo dopo conferma dell'utente
- Chiamate a API a pagamento o con rate limit
- Form "Anteprima" dove l'utente compila i campi e poi clicca "Calcola"

**Comportamento atteso:**
1. L'utente apre la pagina → vede solo istruzioni e un bottone, **nessuna chiamata di rete**
2. Clicca "Carica utenti attivi"
3. Parte la fetch, il bottone si disabilita e mostra "Caricamento..."
4. Al termine, compare la lista; in caso di errore, un messaggio con possibilità di riprovare

```tsx
interface User {
  id: number;
  name: string;
  email: string;
}

/**
 * Componente per caricare e visualizzare utenti solo su richiesta.
 * Utile in una sezione "Report" o "Export dati" dove la fetch
 * non deve partire automaticamente all'apertura della pagina.
 *
 * Montato su una route tipo: <Route path="/reports/users" element={<UserReportPanel />} />
 */
function UserReportPanel() {
  const { data, loading, error, fetchData } = useApi(
    'https://jsonplaceholder.typicode.com/users',
    { autoFetch: false } // ⛔ nessuna fetch al mount — solo al click
  );

  const handleLoadUsers = () => {
    fetchData(); // avvia la fetch quando l'utente è pronto
  };

  return (
    <section>
      <h2>Report utenti attivi</h2>
      <p>
        Clicca il pulsante per scaricare l'elenco aggiornato degli utenti.
        I dati non vengono caricati finché non lo richiedi.
      </p>

      <button onClick={handleLoadUsers} disabled={loading}>
        {loading ? 'Caricamento in corso...' : 'Carica utenti attivi'}
      </button>

      {error && (
        <div role="alert" style={{ marginTop: '1rem' }}>
          <p>Errore durante il caricamento: {error}</p>
          <button onClick={handleLoadUsers}>Riprova</button>
        </div>
      )}

      {data && !loading && (
        <div style={{ marginTop: '1rem' }}>
          <p><strong>{data.length}</strong> utenti caricati con successo.</p>
          <ul>
            {data.map((user) => (
              <li key={user.id}>
                {user.name} — {user.email}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!data && !loading && !error && (
        <p style={{ marginTop: '1rem', color: '#666' }}>
          Nessun dato ancora caricato. Premi il pulsante per iniziare.
        </p>
      )}
    </section>
  );
}
```

**Punti pratici:**
- Con `autoFetch: false` la pagina si apre **istantaneamente**, senza spinner iniziale
- `fetchData` e `refetch` sono la stessa funzione: usa `fetchData` quando è la prima volta, `refetch` se preferisci enfatizzare un "ricarica"
- Lo stato vuoto iniziale (`!data && !loading && !error`) guida l'utente verso l'azione da compiere

---

## Confronto rapido

| | Esempio 1 — `UserList` | Esempio 2 — `UserReportPanel` |
|--|------------------------|-------------------------------|
| **Scopo** | Visualizzare subito gli utenti | Caricare utenti solo on-demand |
| **Route tipica** | `/users` | `/reports/users` |
| **Chiamata hook** | `useApi(url)` | `useApi(url, { autoFetch: false })` |
| **Trigger fetch** | Mount del componente | Click su "Carica utenti attivi" |
| **Prima impressione** | Spinner → tabella | Istruzioni + bottone |
| **Rete al mount** | Sì | No |

Stesso hook, due modalità d'uso — basta cambiare l'opzione `autoFetch`.
