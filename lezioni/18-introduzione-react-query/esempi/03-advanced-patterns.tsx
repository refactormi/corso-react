// Esempio 3: Pattern Avanzati - Paginazione, Ricerca, Prefetch
import { useQuery, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useDeferredValue } from 'react';

// Simulazione database con molti dati
const generatePosts = (count = 100) => {
  const categories = ['Tech', 'Design', 'Business', 'Marketing', 'Development'];
  const authors = ['Mario Rossi', 'Anna Verdi', 'Luca Bianchi', 'Sara Neri', 'Paolo Gialli'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `Post interessante numero ${i + 1}`,
    content: `Questo è il contenuto del post ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    author: authors[Math.floor(Math.random() * authors.length)],
    category: categories[Math.floor(Math.random() * categories.length)],
    likes: Math.floor(Math.random() * 100),
    views: Math.floor(Math.random() * 1000),
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    published: Math.random() > 0.1
  }));
};

const POSTS_DB = generatePosts(100);
const POSTS_PER_PAGE = 8;

// Simulazione API con paginazione e ricerca
const api = {
  getPosts: async ({ page = 1, search = '', category = '' }) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let filteredPosts = POSTS_DB.filter(post => {
      const matchesSearch = !search || 
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.content.toLowerCase().includes(search.toLowerCase()) ||
        post.author.toLowerCase().includes(search.toLowerCase());
      
      const matchesCategory = !category || post.category === category;
      
      return matchesSearch && matchesCategory && post.published;
    });
    
    const totalPosts = filteredPosts.length;
    const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
    const startIndex = (page - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    
    const posts = filteredPosts.slice(startIndex, endIndex);
    
    return {
      posts,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    };
  },
  
  getPost: async (postId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const post = POSTS_DB.find(p => p.id === postId);
    if (!post) {
      throw new Error('Post non trovato');
    }
    
    return {
      ...post,
      relatedPosts: POSTS_DB
        .filter(p => p.category === post.category && p.id !== post.id)
        .slice(0, 3)
    };
  },
  
  getCategories: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const categories = [...new Set(POSTS_DB.map(p => p.category))];
    return categories.map(cat => ({
      name: cat,
      count: POSTS_DB.filter(p => p.category === cat && p.published).length
    }));
  }
};

// Componente per la ricerca
function SearchBar({ search, onSearchChange, category, onCategoryChange }) {
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: api.getCategories,
    staleTime: 10 * 60 * 1000, // 10 minuti
  });
  
  return (
    <div style={{
      display: 'flex',
      gap: 16,
      marginBottom: 24,
      padding: 16,
      backgroundColor: '#f8f9fa',
      borderRadius: 8,
      border: '1px solid #dee2e6'
    }}>
      <div style={{ flex: 1 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold', fontSize: 14 }}>
          🔍 Cerca nei post:
        </label>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Titolo, contenuto o autore..."
          style={{
            width: '100%',
            padding: 10,
            border: '1px solid #ccc',
            borderRadius: 4,
            fontSize: 14
          }}
        />
      </div>
      
      <div style={{ minWidth: 200 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold', fontSize: 14 }}>
          📂 Categoria:
        </label>
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          style={{
            width: '100%',
            padding: 10,
            border: '1px solid #ccc',
            borderRadius: 4,
            fontSize: 14
          }}
        >
          <option value="">Tutte le categorie</option>
          {categories?.map(cat => (
            <option key={cat.name} value={cat.name}>
              {cat.name} ({cat.count})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

// Componente per la paginazione
function Pagination({ pagination, onPageChange }) {
  const { currentPage, totalPages, hasNextPage, hasPreviousPage } = pagination;
  
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };
  
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
      marginTop: 24,
      padding: 16
    }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPreviousPage}
        style={{
          padding: '8px 12px',
          backgroundColor: hasPreviousPage ? '#007bff' : '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: hasPreviousPage ? 'pointer' : 'not-allowed'
        }}
      >
        ← Precedente
      </button>
      
      {getPageNumbers().map(pageNum => (
        <button
          key={pageNum}
          onClick={() => onPageChange(pageNum)}
          style={{
            padding: '8px 12px',
            backgroundColor: pageNum === currentPage ? '#007bff' : 'white',
            color: pageNum === currentPage ? 'white' : '#007bff',
            border: '1px solid #007bff',
            borderRadius: 4,
            cursor: 'pointer',
            fontWeight: pageNum === currentPage ? 'bold' : 'normal'
          }}
        >
          {pageNum}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        style={{
          padding: '8px 12px',
          backgroundColor: hasNextPage ? '#007bff' : '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: hasNextPage ? 'pointer' : 'not-allowed'
        }}
      >
        Successiva →
      </button>
      
      <span style={{ marginLeft: 16, fontSize: 14, color: '#6c757d' }}>
        Pagina {currentPage} di {totalPages}
      </span>
    </div>
  );
}

// Componente card post con prefetch
function PostCard({ post }) {
  const queryClient = useQueryClient();
  
  const handleMouseEnter = () => {
    // Prefetch dei dettagli del post al hover
    queryClient.prefetchQuery({
      queryKey: ['post', post.id],
      queryFn: () => api.getPost(post.id),
      staleTime: 5 * 60 * 1000, // 5 minuti
    });
  };
  
  return (
    <div
      onMouseEnter={handleMouseEnter}
      style={{
        border: '1px solid #dee2e6',
        borderRadius: 8,
        padding: 16,
        backgroundColor: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
      }}
    >
      <div style={{
        display: 'inline-block',
        padding: '4px 8px',
        backgroundColor: '#007bff',
        color: 'white',
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 12
      }}>
        {post.category}
      </div>
      
      <h3 style={{ margin: '0 0 8px 0', fontSize: 16, lineHeight: 1.4 }}>
        {post.title}
      </h3>
      
      <p style={{ 
        margin: '0 0 12px 0', 
        color: '#6c757d', 
        fontSize: 14,
        lineHeight: 1.4,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>
        {post.content}
      </p>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        fontSize: 12,
        color: '#6c757d'
      }}>
        <div>
          <strong>👤 {post.author}</strong>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <span>❤️ {post.likes}</span>
          <span>👁️ {post.views}</span>
        </div>
      </div>
      
      <div style={{ 
        marginTop: 8, 
        fontSize: 11, 
        color: '#999' 
      }}>
        {new Date(post.createdAt).toLocaleDateString('it-IT')}
      </div>
    </div>
  );
}

// Componente principale per la lista post
function PostList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  
  // Debounce della ricerca
  const deferredSearch = useDeferredValue(search);
  
  // Query per i post con paginazione
  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    isPreviousData
  } = useQuery({
    queryKey: ['posts', { page, search: deferredSearch, category }],
    queryFn: () => api.getPosts({ page, search: deferredSearch, category }),
    keepPreviousData: true, // Mantieni dati precedenti durante il caricamento
    staleTime: 2 * 60 * 1000, // 2 minuti
  });
  
  const queryClient = useQueryClient();
  
  // Prefetch della pagina successiva
  const prefetchNextPage = () => {
    if (data?.pagination.hasNextPage) {
      queryClient.prefetchQuery({
        queryKey: ['posts', { page: page + 1, search: deferredSearch, category }],
        queryFn: () => api.getPosts({ page: page + 1, search: deferredSearch, category }),
        staleTime: 2 * 60 * 1000,
      });
    }
  };
  
  // Prefetch quando i dati sono caricati
  React.useEffect(() => {
    if (data && !isFetching) {
      prefetchNextPage();
    }
  }, [data, isFetching, page, deferredSearch, category]);
  
  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleSearchChange = (newSearch) => {
    setSearch(newSearch);
    setPage(1); // Reset alla prima pagina
  };
  
  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setPage(1); // Reset alla prima pagina
  };
  
  return (
    <div>
      <SearchBar
        search={search}
        onSearchChange={handleSearchChange}
        category={category}
        onCategoryChange={handleCategoryChange}
      />
      
      {isError && (
        <div style={{
          padding: 16,
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: 8,
          marginBottom: 24
        }}>
          ❌ Errore: {error.message}
        </div>
      )}
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 16
      }}>
        <h3 style={{ margin: 0 }}>
          📝 Post {data ? `(${data.pagination.totalPosts} trovati)` : ''}
        </h3>
        
        {(isFetching || isLoading) && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 8,
            color: '#007bff',
            fontSize: 14
          }}>
            <div style={{
              width: 16,
              height: 16,
              border: '2px solid #f3f3f3',
              borderTop: '2px solid #007bff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            {isPreviousData ? 'Aggiornamento...' : 'Caricamento...'}
          </div>
        )}
      </div>
      
      {isLoading ? (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 16
        }}>
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{
              height: 200,
              backgroundColor: '#f8f9fa',
              borderRadius: 8,
              animation: `pulse 1.5s ease-in-out infinite ${i * 0.1}s`
            }} />
          ))}
        </div>
      ) : (
        <>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 16,
            opacity: isPreviousData ? 0.7 : 1,
            transition: 'opacity 0.2s ease'
          }}>
            {data?.posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          
          {data?.posts.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: 40,
              color: '#6c757d'
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <div>Nessun post trovato per i criteri di ricerca.</div>
            </div>
          )}
          
          {data?.pagination && data.pagination.totalPages > 1 && (
            <Pagination
              pagination={data.pagination}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}

// Query Client setup
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000, // 2 minuti
      cacheTime: 5 * 60 * 1000, // 5 minuti
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

// Componente principale
export default function AdvancedPatternsExample() {
  return (
    <div style={{ padding: 20 }}>
      <h2>🚀 React Query - Pattern Avanzati</h2>
      <p style={{ color: '#666', marginBottom: 24 }}>
        Paginazione, ricerca con debouncing, prefetch intelligente e gestione cache avanzata.
      </p>
      
      <QueryClientProvider client={queryClient}>
        <PostList />
      </QueryClientProvider>
      
      <div style={{
        marginTop: 32,
        padding: 16,
        backgroundColor: '#e7f3ff',
        borderRadius: 8,
        border: '1px solid #b3d9ff'
      }}>
        <h4 style={{ margin: '0 0 12px 0', color: '#0056b3' }}>
          💡 Pattern Avanzati Implementati:
        </h4>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14 }}>
          <li><strong>Paginazione:</strong> keepPreviousData per transizioni fluide</li>
          <li><strong>Ricerca Debounced:</strong> useDeferredValue per ottimizzare le query</li>
          <li><strong>Prefetch Intelligente:</strong> Pagina successiva e dettagli al hover</li>
          <li><strong>Cache Stratificata:</strong> Categorie, post e dettagli con TTL diversi</li>
          <li><strong>UX Ottimizzata:</strong> Loading states, skeleton e feedback visivo</li>
        </ul>
      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
