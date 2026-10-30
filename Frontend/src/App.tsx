import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import './App.css';

interface Genre {
  id: number;
  name: string;
}

interface Game {
  id: number;
  name: string;
  genre: string;
  price: number;
  releaseDate: string;
}

export default function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [genresList, setGenresList] = useState<Genre[]>([]);
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All games');
  
  const [formData, setFormData] = useState({
    name: '',
    genreId: 0,
    price: 0,
    releaseDate: ''
  });

  const [editingId, setEditingId] = useState<number | null>(null);

  const loadGames = () => {
    fetch('/api/games')
      .then((res) => res.json())
      .then((data) => setGames(data))
      .catch((err) => console.error('Error fetching games:', err));
  };

  const loadGenres = () => {
    fetch('/api/genres')
      .then((res) => res.json())
      .then((data: Genre[]) => {
        setGenresList(data);
        if (data.length > 0 && formData.genreId === 0) {
          setFormData((prev) => ({ ...prev, genreId: data[0].id }));
        }
      })
      .catch((err) => console.error('Error fetching genres:', err));
  };

  useEffect(() => {
    loadGames();
    loadGenres();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'genreId' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (editingId === null) {
      fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
        .then((res) => {
          if (!res.ok) throw new Error('فشلت الإضافة');
          return res.json();
        })
        .then(() => {
          loadGames();
          resetForm();
        })
        .catch((err) => console.error(err));
    } else {
      fetch(`/api/games/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
        .then((res) => {
          if (!res.ok) throw new Error('فشل التعديل');
          loadGames();
          resetForm();
        })
        .catch((err) => console.error(err));
    }
  };

  const handleDelete = (id: number) => {
    if (!window.confirm('هل تريد حذف هذه اللعبة؟')) return;

    fetch(`/api/games/${id}`, { method: 'DELETE' })
      .then((res) => {
        if (res.ok) {
          setGames((prev) => prev.filter((g) => g.id !== id));
        }
      })
      .catch((err) => console.error(err));
  };

  const startEdit = (game: Game) => {
    const matchedGenre = genresList.find((g) => g.name.toLowerCase() === game.genre.toLowerCase());
    setEditingId(game.id);
    setFormData({
      name: game.name,
      genreId: matchedGenre ? matchedGenre.id : (genresList[0]?.id || 1),
      price: game.price,
      releaseDate: game.releaseDate
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      genreId: genresList[0]?.id || 0,
      price: 0,
      releaseDate: ''
    });
  };

  const filterGenres = ['All games', ...genresList.map((g) => g.name)];
  
  const filteredGames = games.filter((game) => {
    const matchesQuery = `${game.name} ${game.genre}`.toLowerCase().includes(query.toLowerCase());
    const matchesGenre = activeFilter === 'All games' || game.genre === activeFilter;
    return matchesQuery && matchesGenre;
  });

  const averagePrice = games.length ? games.reduce((sum, game) => sum + game.price, 0) / games.length : 0;
  const featuredGame = games[0];

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Arcade home">
          <span className="brand-mark">+</span>
          <span>arcade<span className="brand-dot">.</span></span>
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          <a className="active" href="#library">Library</a>
          <a href="#insights">Insights</a>
        </nav>
        <div className="profile">
          <span className="status-dot" /> 
          <span>Admin studio</span>
          <span className="avatar">AS</span>
        </div>
      </header>

      <main id="top" className="content">
        <section className="hero-panel">
          <div className="hero-copy">
            <span className="eyebrow">CURATED GAME LIBRARY</span>
            <h1>Make room for<br /><em>great games.</em></h1>
            <p>Keep your collection sharp, organized, and ready for the next adventure.</p>
            <a className="hero-link" href="#library">Explore library <span>↘</span></a>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="sun" />
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="floating-card card-back" />
            <div className="floating-card card-front">
              <span>PLAY<br />MORE</span>
              <strong>✦</strong>
            </div>
            <div className="art-label">COLLECTION<br /><b>01 / 04</b></div>
          </div>
        </section>

        <section className="stats-row" id="insights">
          <div>
            <span className="stat-label">TOTAL TITLES</span>
            <strong>{games.length.toString().padStart(2, '0')}</strong>
          </div>
          <div>
            <span className="stat-label">AVG. PRICE</span>
            <strong>${averagePrice.toFixed(2)}</strong>
          </div>
          <div>
            <span className="stat-label">LATEST ADDITION</span>
            <strong>{featuredGame ? featuredGame.name : 'Waiting...'}</strong>
          </div>
          <div className="stats-note">
            Your library,<br />
            <b>beautifully in sync.</b>
          </div>
        </section>

        <section className="library-section" id="library">
          <div className="section-heading">
            <div>
              <span className="eyebrow">YOUR COLLECTION</span>
              <h2>All games <span>{games.length}</span></h2>
            </div>
            <button className="primary-button" onClick={resetForm}>+ Add new game</button>
          </div>

          <div className="toolbar">
            <div className="search-box">
              <span>⌕</span>
              <input 
                aria-label="Search games" 
                placeholder="Search your collection..." 
                value={query} 
                onChange={(event) => setQuery(event.target.value)} 
              />
            </div>
            <div className="filter-list" role="group" aria-label="Filter by genre">
              {filterGenres.map((genre) => (
                <button 
                  className={activeFilter === genre ? 'selected' : ''} 
                  key={genre} 
                  onClick={() => setActiveFilter(genre)}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          <div className="game-list">
            {filteredGames.length === 0 ? (
              <div className="empty-state">
                <span>✦</span>
                <h3>Your collection is ready for its first title.</h3>
                <p>Add a game to begin building your library.</p>
              </div>
            ) : (
              filteredGames.map((game, index) => (
                <article className="game-row" key={game.id}>
                  <div className={`game-cover cover-${index % 4}`}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <b>{game.name.slice(0, 1).toUpperCase()}</b>
                  </div>
                  <div className="game-info">
                    <h3>{game.name}</h3>
                    <span>{game.genre} <i>•</i> Added {new Date(game.releaseDate).getFullYear() || 'recently'}</span>
                  </div>
                  <div className="game-price">${game.price.toFixed(2)}</div>
                  <div className="row-actions">
                    <button onClick={() => startEdit(game)} aria-label={`Edit ${game.name}`}>Edit</button>
                    <button className="delete-action" onClick={() => handleDelete(game.id)} aria-label={`Delete ${game.name}`}>Delete</button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <aside className="editor-panel">
          <div>
            <span className="eyebrow">{editingId ? 'EDIT TITLE' : 'QUICK ADD'}</span>
            <h2>{editingId ? 'Tune this release.' : 'Add to the collection.'}</h2>
            <p>{editingId ? 'Update the details and keep your library accurate.' : 'A few details and it is ready for your next session.'}</p>
          </div>

          <form onSubmit={handleSubmit} className="game-form">
            <label>
              Game title
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="e.g. Hades II" 
                required 
              />
            </label>

            <label>
              Genre
              <select 
                name="genreId" 
                value={formData.genreId} 
                onChange={handleChange} 
                required
              >
                <option value={0} disabled>Select a genre</option>
                {genresList.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Price
              <input 
                type="number" 
                step="0.01" 
                name="price" 
                value={formData.price || ''} 
                onChange={handleChange} 
                placeholder="0.00" 
                required 
              />
            </label>

            <label>
              Release date
              <input 
                type="date" 
                name="releaseDate" 
                value={formData.releaseDate} 
                onChange={handleChange} 
                required 
              />
            </label>

            <div className="form-actions">
              <button className="primary-button" type="submit">
                {editingId ? 'Save changes' : 'Add game'} <span>↗</span>
              </button>
              {editingId && (
                <button className="text-button" type="button" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </aside>
      </main>

      <footer>
        <span>arcade<span className="brand-dot">.</span> / 2026</span>
        <span>Made for the games you keep coming back to.</span>
      </footer>
    </div>
  );
}