import React, { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Esempio 1: Editor di Testo Avanzato con useRef
 * 
 * Questo esempio dimostra:
 * - useRef per accesso diretto agli elementi DOM
 * - Manipolazione del cursore e selezione
 * - Gestione focus e input programmatico
 * - Integrazione con API del browser
 * - Gestione eventi keyboard avanzata
 * - Persistenza stato tra render
 */

// Hook personalizzato per gestire la cronologia
function useHistory(initialValue = '') {
  const [history, setHistory] = useState([initialValue]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const currentValue = history[currentIndex];
  
  const push = useCallback((value) => {
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(value);
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  }, [history, currentIndex]);
  
  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      return history[currentIndex - 1];
    }
    return currentValue;
  }, [currentIndex, history, currentValue]);
  
  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
      return history[currentIndex + 1];
    }
    return currentValue;
  }, [currentIndex, history, currentValue]);
  
  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;
  
  return {
    value: currentValue,
    push,
    undo,
    redo,
    canUndo,
    canRedo,
    history
  };
}

// Hook per gestire le statistiche del testo
function useTextStats() {
  const [stats, setStats] = useState({
    characters: 0,
    words: 0,
    lines: 0,
    paragraphs: 0,
    readingTime: 0
  });
  
  const updateStats = useCallback((text) => {
    const characters = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text.split('\n').length;
    const paragraphs = text.split('\n\n').filter(p => p.trim()).length;
    const readingTime = Math.ceil(words / 200); // 200 parole al minuto
    
    setStats({
      characters,
      words,
      lines,
      paragraphs,
      readingTime
    });
  }, []);
  
  return [stats, updateStats];
}

// Componente per la toolbar dell'editor
function EditorToolbar({ 
  onBold, 
  onItalic, 
  onUnderline, 
  onInsertLink, 
  onInsertImage,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onSave,
  onLoad,
  onExport
}) {
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      padding: '10px',
      backgroundColor: '#f8f9fa',
      borderBottom: '1px solid #dee2e6',
      borderRadius: '4px 4px 0 0'
    }}>
      {/* Formattazione */}
      <div style={{ display: 'flex', gap: '4px', marginRight: '10px' }}>
        <button
          onClick={onBold}
          style={{
            padding: '6px 12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
          title="Grassetto (Ctrl+B)"
        >
          B
        </button>
        
        <button
          onClick={onItalic}
          style={{
            padding: '6px 12px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontStyle: 'italic'
          }}
          title="Corsivo (Ctrl+I)"
        >
          I
        </button>
        
        <button
          onClick={onUnderline}
          style={{
            padding: '6px 12px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
          title="Sottolineato (Ctrl+U)"
        >
          U
        </button>
      </div>
      
      {/* Inserimento */}
      <div style={{ display: 'flex', gap: '4px', marginRight: '10px' }}>
        <button
          onClick={onInsertLink}
          style={{
            padding: '6px 12px',
            backgroundColor: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          title="Inserisci Link"
        >
          🔗
        </button>
        
        <button
          onClick={onInsertImage}
          style={{
            padding: '6px 12px',
            backgroundColor: '#ffc107',
            color: 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          title="Inserisci Immagine"
        >
          🖼️
        </button>
      </div>
      
      {/* Cronologia */}
      <div style={{ display: 'flex', gap: '4px', marginRight: '10px' }}>
        <button
          onClick={onUndo}
          disabled={!canUndo}
          style={{
            padding: '6px 12px',
            backgroundColor: canUndo ? '#6f42c1' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: canUndo ? 'pointer' : 'not-allowed'
          }}
          title="Annulla (Ctrl+Z)"
        >
          ↶
        </button>
        
        <button
          onClick={onRedo}
          disabled={!canRedo}
          style={{
            padding: '6px 12px',
            backgroundColor: canRedo ? '#e83e8c' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: canRedo ? 'pointer' : 'not-allowed'
          }}
          title="Ripeti (Ctrl+Y)"
        >
          ↷
        </button>
      </div>
      
      {/* File */}
      <div style={{ display: 'flex', gap: '4px' }}>
        <button
          onClick={onSave}
          style={{
            padding: '6px 12px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          title="Salva (Ctrl+S)"
        >
          💾
        </button>
        
        <button
          onClick={onLoad}
          style={{
            padding: '6px 12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          title="Carica"
        >
          📁
        </button>
        
        <button
          onClick={onExport}
          style={{
            padding: '6px 12px',
            backgroundColor: '#fd7e14',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          title="Esporta"
        >
          📤
        </button>
      </div>
    </div>
  );
}

// Componente per le statistiche del testo
function TextStats({ stats }) {
  return (
    <div style={{
      display: 'flex',
      gap: '20px',
      padding: '10px',
      backgroundColor: '#e9ecef',
      borderTop: '1px solid #dee2e6',
      borderRadius: '0 0 4px 4px',
      fontSize: '14px',
      color: '#495057'
    }}>
      <span>📝 Caratteri: {stats.characters}</span>
      <span>📖 Parole: {stats.words}</span>
      <span>📄 Righe: {stats.lines}</span>
      <span>📑 Paragrafi: {stats.paragraphs}</span>
      <span>⏱️ Tempo lettura: {stats.readingTime} min</span>
    </div>
  );
}

// Componente principale dell'editor
function AdvancedTextEditor() {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const [content, setContent] = useState('');
  const [isModified, setIsModified] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  
  const history = useHistory('');
  const [stats, updateStats] = useTextStats();
  
  // Aggiorna le statistiche quando il contenuto cambia
  useEffect(() => {
    updateStats(content);
  }, [content, updateStats]);
  
  // Gestione keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'b':
            e.preventDefault();
            handleBold();
            break;
          case 'i':
            e.preventDefault();
            handleItalic();
            break;
          case 'u':
            e.preventDefault();
            handleUnderline();
            break;
          case 's':
            e.preventDefault();
            handleSave();
            break;
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              handleRedo();
            } else {
              handleUndo();
            }
            break;
          case 'y':
            e.preventDefault();
            handleRedo();
            break;
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Funzioni per la formattazione
  const applyFormatting = (format, startTag, endTag) => {
    if (editorRef.current) {
      const start = editorRef.current.selectionStart;
      const end = editorRef.current.selectionEnd;
      const selectedText = content.substring(start, end);
      
      if (selectedText) {
        const newText = `${startTag}${selectedText}${endTag}`;
        const newContent = content.substring(0, start) + newText + content.substring(end);
        
        setContent(newContent);
        history.push(newContent);
        setIsModified(true);
        
        // Ripristina la selezione
        setTimeout(() => {
          editorRef.current.focus();
          editorRef.current.setSelectionRange(start + startTag.length, end + startTag.length);
        }, 0);
      }
    }
  };
  
  const handleBold = () => applyFormatting('bold', '**', '**');
  const handleItalic = () => applyFormatting('italic', '*', '*');
  const handleUnderline = () => applyFormatting('underline', '<u>', '</u>');
  
  // Funzioni per l'inserimento
  const handleInsertLink = () => {
    const url = prompt('Inserisci URL:');
    if (url) {
      const linkText = prompt('Testo del link:', url);
      const link = `[${linkText || url}](${url})`;
      insertTextAtCursor(link);
    }
  };
  
  const handleInsertImage = () => {
    const url = prompt('Inserisci URL immagine:');
    if (url) {
      const altText = prompt('Testo alternativo:');
      const image = `![${altText || 'immagine'}](${url})`;
      insertTextAtCursor(image);
    }
  };
  
  const insertTextAtCursor = (text) => {
    if (editorRef.current) {
      const start = editorRef.current.selectionStart;
      const end = editorRef.current.selectionEnd;
      const newContent = content.substring(0, start) + text + content.substring(end);
      
      setContent(newContent);
      history.push(newContent);
      setIsModified(true);
      
      // Ripristina il focus e la posizione
      setTimeout(() => {
        editorRef.current.focus();
        editorRef.current.setSelectionRange(start + text.length, start + text.length);
      }, 0);
    }
  };
  
  // Funzioni per la cronologia
  const handleUndo = () => {
    const previousContent = history.undo();
    if (previousContent !== content) {
      setContent(previousContent);
      setIsModified(true);
    }
  };
  
  const handleRedo = () => {
    const nextContent = history.redo();
    if (nextContent !== content) {
      setContent(nextContent);
      setIsModified(true);
    }
  };
  
  // Funzioni per il file
  const handleSave = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'documento.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setIsModified(false);
    alert('Documento salvato!');
  };
  
  const handleLoad = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileLoad = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        setContent(text);
        history.push(text);
        setIsModified(false);
      };
      reader.readAsText(file);
    }
  };
  
  const handleExport = () => {
    const htmlContent = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">')
      .replace(/\n/g, '<br>');
    
    const blob = new Blob([`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Documento Esportato</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          img { max-width: 100%; height: auto; }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `], { type: 'text/html' });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'documento.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Gestione eventi dell'editor
  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    setIsModified(true);
    
    // Aggiorna la posizione del cursore
    setCursorPosition(e.target.selectionStart);
    setSelection({
      start: e.target.selectionStart,
      end: e.target.selectionEnd
    });
  };
  
  const handleSelectionChange = () => {
    if (editorRef.current) {
      setCursorPosition(editorRef.current.selectionStart);
      setSelection({
        start: editorRef.current.selectionStart,
        end: editorRef.current.selectionEnd
      });
    }
  };
  
  const handleKeyUp = () => {
    if (editorRef.current) {
      setCursorPosition(editorRef.current.selectionStart);
    }
  };
  
  // Salva automaticamente nella cronologia
  useEffect(() => {
    if (content && content !== history.value) {
      const timeoutId = setTimeout(() => {
        history.push(content);
      }, 1000); // Salva dopo 1 secondo di inattività
      
      return () => clearTimeout(timeoutId);
    }
  }, [content, history]);
  
  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
        📝 Editor di Testo Avanzato
      </h2>
      
      <div style={{
        border: '2px solid #007bff',
        borderRadius: '8px',
        backgroundColor: 'white',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <EditorToolbar
          onBold={handleBold}
          onItalic={handleItalic}
          onUnderline={handleUnderline}
          onInsertLink={handleInsertLink}
          onInsertImage={handleInsertImage}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={history.canUndo}
          canRedo={history.canRedo}
          onSave={handleSave}
          onLoad={handleLoad}
          onExport={handleExport}
        />
        
        <textarea
          ref={editorRef}
          value={content}
          onChange={handleContentChange}
          onSelect={handleSelectionChange}
          onKeyUp={handleKeyUp}
          placeholder="Inizia a scrivere il tuo documento..."
          style={{
            width: '100%',
            height: '400px',
            padding: '20px',
            border: 'none',
            outline: 'none',
            fontSize: '16px',
            lineHeight: '1.6',
            fontFamily: 'Arial, sans-serif',
            resize: 'vertical'
          }}
        />
        
        <TextStats stats={stats} />
      </div>
      
      {/* Informazioni aggiuntive */}
      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '6px',
        fontSize: '14px',
        color: '#666'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>ℹ️ Informazioni</h4>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li>Posizione cursore: {cursorPosition}</li>
          <li>Selezione: {selection.start} - {selection.end}</li>
          <li>Stato: {isModified ? 'Modificato' : 'Salvato'}</li>
          <li>Cronologia: {history.history.length} versioni</li>
        </ul>
        
        <h4 style={{ margin: '15px 0 10px 0', color: '#333' }}>⌨️ Shortcuts</h4>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li><strong>Ctrl+B</strong> - Grassetto</li>
          <li><strong>Ctrl+I</strong> - Corsivo</li>
          <li><strong>Ctrl+U</strong> - Sottolineato</li>
          <li><strong>Ctrl+S</strong> - Salva</li>
          <li><strong>Ctrl+Z</strong> - Annulla</li>
          <li><strong>Ctrl+Y</strong> - Ripeti</li>
        </ul>
      </div>
      
      {/* Input file nascosto */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.md"
        onChange={handleFileLoad}
        style={{ display: 'none' }}
      />
    </div>
  );
}

export default AdvancedTextEditor;
