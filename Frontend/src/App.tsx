import { useEffect, useState } from 'react';

// Genre interface matching your backend model
interface Genre {
  id: number;
  name: string;
}

export default function App() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Calls the Vite proxy configured in vite.config.ts
    fetch('/api/genres')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data: Genre[]) => {
        setGenres(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Game Store</h1>
      <h2>Available Genres</h2>

      {loading ? (
        <p>Loading genres...</p>
      ) : (
        <ul>
          {genres.map((genre) => (
            <li key={genre.id}>
              <strong>{genre.name}</strong> (ID: {genre.id})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}