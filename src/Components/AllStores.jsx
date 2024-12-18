import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const StoreCard = ({ store, onFavorite, isFavorite }) => {
  const renderCashbackText = () => {
    if (store.cashback_enabled === 0) return 'No cashback available';
    
    const { rate_type, amount_type, cashback_amount } = store;
    const formattedAmount = parseFloat(cashback_amount).toFixed(2);
    
    const prefix = amount_type === 'fixed' ? '$' : '';
    const suffix = amount_type === 'percent' ? '%' : '';
    
    return `${rate_type} ${prefix}${formattedAmount}${suffix} cashback`;
  };

  return (
    <div 
      className="store-card border rounded p-4 relative cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => window.open(store.url, '_blank')}
    >
      <button 
        className="absolute top-2 right-2"
        onClick={(e) => {
          e.stopPropagation();
          onFavorite(store);
        }}
      >
        <span className={`text-2xl ${isFavorite ? 'text-red-500' : 'text-gray-300'}`}>
          ♥
        </span>
      </button>
      
      <div className="flex flex-col items-center">
        <img 
          src={store.logo} 
          alt={`${store.name} logo`} 
          className="w-24 h-24 object-contain mb-4"
        />
        <h3 className="text-lg font-bold">{store.name}</h3>
        <p className="text-sm text-gray-600 mt-2">
          {renderCashbackText()}
        </p>
      </div>
    </div>
  );
};

const AllStores = () => {
  const [stores, setStores] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [favorites, setFavorites] = useState(() => 
    JSON.parse(localStorage.getItem('favoriteStores') || '[]')
  );

  const location = useLocation();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    category: null,
    sortBy: 'name',
    order: 'asc',
    searchQuery: '',
    cashbackEnabled: null,
    isPromoted: null
  });

  // Parse URL parameters on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const newFilters = { ...filters };

    if (searchParams.get('category')) {
      newFilters.category = parseInt(searchParams.get('category'));
    }
    if (searchParams.get('sort')) newFilters.sortBy = searchParams.get('sort');
    if (searchParams.get('order')) newFilters.order = searchParams.get('order');
    if (searchParams.get('search')) newFilters.searchQuery = searchParams.get('search');
    
    setFilters(newFilters);
  }, [location.search]);

  // Update URL parameters when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.category) params.set('category', filters.category);
    if (filters.sortBy) params.set('sort', filters.sortBy);
    if (filters.order) params.set('order', filters.order);
    if (filters.searchQuery) params.set('search', filters.searchQuery);

    navigate(`?${params.toString()}`, { replace: true });
  }, [filters, navigate]);

  const fetchStores = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      const params = {
        _page: page,
        _limit: 20,
        _sort: filters.sortBy,
        _order: filters.order
      };

      if (filters.category) params.cats = filters.category;
      if (filters.searchQuery) params.name_like = filters.searchQuery;
      if (filters.cashbackEnabled !== null) params.cashback_enabled = filters.cashbackEnabled ? 1 : 0;
      if (filters.isPromoted !== null) params.is_promoted = filters.isPromoted ? 1 : 0;

      const response = await axios.get('http://localhost:3001/stores', { params });
      
      if (response.data.length === 0) {
        setHasMore(false);
      } else {
        setStores(prev => page === 1 ? response.data : [...prev, ...response.data]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stores:', error);
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100 &&
      hasMore && !loading
    ) {
      setPage(prev => prev + 1);
    }
  }, [hasMore, loading]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const toggleFavorite = (store) => {
    const isFavorite = favorites.some(f => f.id === store.id);
    let updatedFavorites;

    if (isFavorite) {
      updatedFavorites = favorites.filter(f => f.id !== store.id);
    } else {
      updatedFavorites = [...favorites, store];
    }

    setFavorites(updatedFavorites);
    localStorage.setItem('favoriteStores', JSON.stringify(updatedFavorites));
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search stores..."
          value={filters.searchQuery}
          onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
          className="border p-2 rounded w-full mr-4"
        />
        <select
          value={filters.sortBy}
          onChange={(e) => setFilters(prev => ({ 
            ...prev, 
            sortBy: e.target.value, 
            order: e.target.value === 'name' ? 'asc' : 'desc' 
          }))}
          className="border p-2 rounded"
        >
          <option value="name">Name</option>
          <option value="featured">Featured</option>
          <option value="clicks">Popularity</option>
          <option value="cashback_amount">Cashback</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {stores.map(store => (
          <StoreCard 
            key={store.id} 
            store={store}
            onFavorite={toggleFavorite}
            isFavorite={favorites.some(f => f.id === store.id)}
          />
        ))}
      </div>
      {loading && <div>Loading more stores...</div>}
      {!hasMore && <div>No more stores to load</div>}
    </div>
  );
};

export default AllStores;
