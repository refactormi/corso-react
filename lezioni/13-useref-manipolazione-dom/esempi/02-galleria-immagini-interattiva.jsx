import React, { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Esempio 2: Galleria Immagini Interattiva con useRef
 * 
 * Questo esempio dimostra:
 * - useRef per gestire elementi DOM complessi
 * - Intersection Observer per lazy loading
 * - Gestione eventi mouse e touch
 * - Manipolazione DOM per animazioni
 * - Gestione focus e keyboard navigation
 * - Integrazione con API del browser
 */

// Hook personalizzato per Intersection Observer
function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef(null);
  const observerRef = useRef(null);
  
  useEffect(() => {
    if (elementRef.current) {
      observerRef.current = new IntersectionObserver(([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      }, options);
      
      observerRef.current.observe(elementRef.current);
    }
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [options, hasIntersected]);
  
  return [elementRef, isIntersecting, hasIntersected];
}

// Hook per gestire il drag and drop
function useDragAndDrop() {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const elementRef = useRef(null);
  
  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  }, []);
  
  const handleMouseMove = useCallback((e) => {
    if (isDragging && elementRef.current) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      elementRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
    }
  }, [isDragging, dragOffset]);
  
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);
  
  return {
    elementRef,
    isDragging,
    handleMouseDown
  };
}

// Componente per la singola immagine
function ImageItem({ 
  image, 
  index, 
  isSelected, 
  onSelect, 
  onDoubleClick,
  onLoad,
  onError 
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [ref, isIntersecting, hasIntersected] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px'
  });
  
  const dragDrop = useDragAndDrop();
  
  const handleImageLoad = () => {
    setIsLoaded(true);
    onLoad?.(index);
  };
  
  const handleImageError = () => {
    setHasError(true);
    onError?.(index);
  };
  
  const handleClick = () => {
    onSelect(index);
  };
  
  const handleDoubleClick = () => {
    onDoubleClick(index);
  };
  
  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        aspectRatio: '1',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        overflow: 'hidden',
        cursor: 'pointer',
        border: isSelected ? '3px solid #007bff' : '2px solid transparent',
        transition: 'all 0.3s ease',
        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
        boxShadow: isSelected ? '0 8px 25px rgba(0,123,255,0.3)' : '0 2px 8px rgba(0,0,0,0.1)'
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseDown={dragDrop.handleMouseDown}
    >
      {hasIntersected ? (
        <>
          {!hasError ? (
            <img
              src={image.url}
              alt={image.alt}
              onLoad={handleImageLoad}
              onError={handleImageError}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: isLoaded ? 1 : 0,
                transition: 'opacity 0.3s ease'
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#e9ecef',
              color: '#6c757d',
              fontSize: '14px'
            }}>
              ❌ Errore caricamento
            </div>
          )}
          
          {!isLoaded && !hasError && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f8f9fa',
              color: '#6c757d'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏳</div>
                <div style={{ fontSize: '12px' }}>Caricamento...</div>
              </div>
            </div>
          )}
          
          {/* Overlay informazioni */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
            color: 'white',
            padding: '10px',
            transform: isSelected ? 'translateY(0)' : 'translateY(100%)',
            transition: 'transform 0.3s ease'
          }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
              {image.title || `Immagine ${index + 1}`}
            </div>
            {image.description && (
              <div style={{ fontSize: '10px', opacity: 0.9, marginTop: '2px' }}>
                {image.description}
              </div>
            )}
          </div>
          
          {/* Indicatore selezione */}
          {isSelected && (
            <div style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '24px',
              height: '24px',
              backgroundColor: '#007bff',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              ✓
            </div>
          )}
        </>
      ) : (
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8f9fa',
          color: '#6c757d'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>👁️</div>
            <div style={{ fontSize: '12px' }}>In attesa...</div>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente per la vista a schermo intero
function FullscreenView({ 
  image, 
  isOpen, 
  onClose, 
  onPrevious, 
  onNext, 
  hasPrevious, 
  hasNext 
}) {
  const imageRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isOpen) {
        switch (e.key) {
          case 'Escape':
            onClose();
            break;
          case 'ArrowLeft':
            if (hasPrevious) onPrevious();
            break;
          case 'ArrowRight':
            if (hasNext) onNext();
            break;
          case '+':
          case '=':
            setZoom(prev => Math.min(prev + 0.2, 3));
            break;
          case '-':
            setZoom(prev => Math.max(prev - 0.2, 0.5));
            break;
          case '0':
            setZoom(1);
            setPosition({ x: 0, y: 0 });
            break;
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onPrevious, onNext, hasPrevious, hasNext]);
  
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };
  
  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };
  
  const handleMouseMove = (e) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  if (!isOpen) return null;
  
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.9)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={onClose}
      onWheel={handleWheel}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Controlli */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        display: 'flex',
        gap: '10px',
        zIndex: 1001
      }}>
        <button
          onClick={() => setZoom(prev => Math.max(0.5, prev - 0.2))}
          style={{
            padding: '8px 12px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          -
        </button>
        
        <span style={{ color: 'white', padding: '8px 12px' }}>
          {Math.round(zoom * 100)}%
        </span>
        
        <button
          onClick={() => setZoom(prev => Math.min(3, prev + 0.2))}
          style={{
            padding: '8px 12px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          +
        </button>
        
        <button
          onClick={() => {
            setZoom(1);
            setPosition({ x: 0, y: 0 });
          }}
          style={{
            padding: '8px 12px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reset
        </button>
        
        <button
          onClick={onClose}
          style={{
            padding: '8px 12px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ✕
        </button>
      </div>
      
      {/* Navigazione */}
      {hasPrevious && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrevious();
          }}
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            padding: '15px 20px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '18px'
          }}
        >
          ‹
        </button>
      )}
      
      {hasNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            padding: '15px 20px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '18px'
          }}
        >
          ›
        </button>
      )}
      
      {/* Immagine */}
      <img
        ref={imageRef}
        src={image.url}
        alt={image.alt}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={handleMouseDown}
        style={{
          maxWidth: '90%',
          maxHeight: '90%',
          objectFit: 'contain',
          transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease',
          cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
        }}
      />
      
      {/* Informazioni */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'white',
        textAlign: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: '10px 20px',
        borderRadius: '4px'
      }}>
        <div style={{ fontWeight: 'bold' }}>
          {image.title || 'Immagine'}
        </div>
        {image.description && (
          <div style={{ fontSize: '14px', opacity: 0.9 }}>
            {image.description}
          </div>
        )}
      </div>
    </div>
  );
}

// Componente principale della galleria
function InteractiveImageGallery({ images = [] }) {
  const [selectedImages, setSelectedImages] = useState(new Set());
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [fullscreenIndex, setFullscreenIndex] = useState(-1);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [errorImages, setErrorImages] = useState(new Set());
  
  const handleImageSelect = (index) => {
    setSelectedImages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };
  
  const handleImageDoubleClick = (index) => {
    setFullscreenImage(images[index]);
    setFullscreenIndex(index);
  };
  
  const handleImageLoad = (index) => {
    setLoadedImages(prev => new Set([...prev, index]));
  };
  
  const handleImageError = (index) => {
    setErrorImages(prev => new Set([...prev, index]));
  };
  
  const handleSelectAll = () => {
    setSelectedImages(new Set(images.map((_, index) => index)));
  };
  
  const handleDeselectAll = () => {
    setSelectedImages(new Set());
  };
  
  const handleDeleteSelected = () => {
    if (selectedImages.size > 0) {
      const confirmDelete = window.confirm(
        `Sei sicuro di voler eliminare ${selectedImages.size} immagine/i?`
      );
      if (confirmDelete) {
        // Qui implementeresti la logica di eliminazione
        console.log('Eliminazione immagini:', Array.from(selectedImages));
        setSelectedImages(new Set());
      }
    }
  };
  
  const handleDownloadSelected = () => {
    selectedImages.forEach(index => {
      const image = images[index];
      const link = document.createElement('a');
      link.href = image.url;
      link.download = image.title || `immagine-${index + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };
  
  const handleFullscreenClose = () => {
    setFullscreenImage(null);
    setFullscreenIndex(-1);
  };
  
  const handleFullscreenPrevious = () => {
    if (fullscreenIndex > 0) {
      const newIndex = fullscreenIndex - 1;
      setFullscreenImage(images[newIndex]);
      setFullscreenIndex(newIndex);
    }
  };
  
  const handleFullscreenNext = () => {
    if (fullscreenIndex < images.length - 1) {
      const newIndex = fullscreenIndex + 1;
      setFullscreenImage(images[newIndex]);
      setFullscreenIndex(newIndex);
    }
  };
  
  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
        🖼️ Galleria Immagini Interattiva
      </h2>
      
      {/* Controlli */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleSelectAll}
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Seleziona Tutto
          </button>
          
          <button
            onClick={handleDeselectAll}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Deseleziona Tutto
          </button>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ color: '#666' }}>
            {selectedImages.size} di {images.length} selezionate
          </span>
          
          {selectedImages.size > 0 && (
            <>
              <button
                onClick={handleDownloadSelected}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                📥 Scarica
              </button>
              
              <button
                onClick={handleDeleteSelected}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                🗑️ Elimina
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Statistiche */}
      <div style={{
        display: 'flex',
        gap: '20px',
        marginBottom: '20px',
        padding: '10px',
        backgroundColor: '#e9ecef',
        borderRadius: '6px',
        fontSize: '14px',
        color: '#495057'
      }}>
        <span>📊 Totale: {images.length}</span>
        <span>✅ Caricate: {loadedImages.size}</span>
        <span>❌ Errori: {errorImages.size}</span>
        <span>👁️ Visibili: {loadedImages.size - errorImages.size}</span>
      </div>
      
      {/* Griglia immagini */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '20px'
      }}>
        {images.map((image, index) => (
          <ImageItem
            key={index}
            image={image}
            index={index}
            isSelected={selectedImages.has(index)}
            onSelect={handleImageSelect}
            onDoubleClick={handleImageDoubleClick}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ))}
      </div>
      
      {/* Vista a schermo intero */}
      {fullscreenImage && (
        <FullscreenView
          image={fullscreenImage}
          isOpen={!!fullscreenImage}
          onClose={handleFullscreenClose}
          onPrevious={handleFullscreenPrevious}
          onNext={handleFullscreenNext}
          hasPrevious={fullscreenIndex > 0}
          hasNext={fullscreenIndex < images.length - 1}
        />
      )}
      
      {/* Istruzioni */}
      <div style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#d1ecf1',
        borderRadius: '8px',
        border: '1px solid #bee5eb'
      }}>
        <h4 style={{ margin: '0 0 15px 0', color: '#0c5460' }}>
          ℹ️ Istruzioni
        </h4>
        <ul style={{ margin: 0, paddingLeft: '20px', color: '#0c5460' }}>
          <li><strong>Click</strong> per selezionare/deselezionare un'immagine</li>
          <li><strong>Doppio click</strong> per aprire in schermo intero</li>
          <li><strong>Drag</strong> per spostare le immagini selezionate</li>
          <li><strong>Frecce</strong> per navigare in schermo intero</li>
          <li><strong>+/-</strong> per zoomare in schermo intero</li>
          <li><strong>0</strong> per resettare zoom e posizione</li>
          <li><strong>ESC</strong> per chiudere la vista a schermo intero</li>
        </ul>
      </div>
    </div>
  );
}

// Dati di esempio
const sampleImages = [
  {
    url: 'https://picsum.photos/400/400?random=1',
    alt: 'Immagine 1',
    title: 'Paesaggio Montano',
    description: 'Una vista mozzafiato delle montagne'
  },
  {
    url: 'https://picsum.photos/400/400?random=2',
    alt: 'Immagine 2',
    title: 'Città Moderna',
    description: 'Skyline di una metropoli contemporanea'
  },
  {
    url: 'https://picsum.photos/400/400?random=3',
    alt: 'Immagine 3',
    title: 'Natura Selvaggia',
    description: 'Foresta incontaminata'
  },
  {
    url: 'https://picsum.photos/400/400?random=4',
    alt: 'Immagine 4',
    title: 'Oceano Infinito',
    description: 'Onde che si infrangono sulla costa'
  },
  {
    url: 'https://picsum.photos/400/400?random=5',
    alt: 'Immagine 5',
    title: 'Architettura Classica',
    description: 'Edificio storico con dettagli architettonici'
  },
  {
    url: 'https://picsum.photos/400/400?random=6',
    alt: 'Immagine 6',
    title: 'Vita Urbana',
    description: 'Strada animata nel cuore della città'
  }
];

export default function InteractiveImageGalleryDemo() {
  return <InteractiveImageGallery images={sampleImages} />;
}
