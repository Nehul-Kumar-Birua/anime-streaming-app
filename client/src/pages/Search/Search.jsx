import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchAnime } from '../../services/animeService';
import AnimeCard from '../../components/AnimeCard/AnimeCard';
import './Search.css';

function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query]);

  const performSearch = async () => {
    try {
      setLoading(true);
      const response = await searchAnime(query);
      console.log('Search response:', response);
      
      // Handle nested response: response.data.data.animes
      if (response.data?.data?.animes) {
        setResults(response.data.data.animes);
      } else if (response.data?.animes) {
        setResults(response.data.animes);
      } else {
        setResults([]);
      }
      setError(null);
    } catch (err) {
      setError('Failed to search anime. Please try again.');
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-page container">
      <h1 className="search-title">
        {query ? `Search Results for "${query}"` : 'Browse Anime'}
      </h1>

      {loading && (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Searching...</p>
        </div>
      )}
      
      {error && <div className="error">{error}</div>}

      {!loading && !error && results.length === 0 && query && (
        <div className="no-results">
          <h2>😕 No Results Found</h2>
          <p>No anime found for "{query}"</p>
          <p>Try searching with different keywords</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="search-results">
          {results.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Search;
