import { useState, useEffect, useMemo } from 'react';
import { getWaifus } from '../services/api';
import WaifuCard from '../components/WaifuCard';
import SearchBar from '../components/SearchBar';
import KawaiiLoader from '../components/KawaiiLoader';

const HAIR_OPTIONS = [
  { value: 'Tous',   emoji: '✨' },
  { value: 'blue',   emoji: '💙' },
  { value: 'pink',   emoji: '🌸' },
  { value: 'orange', emoji: '🍊' },
  { value: 'black',  emoji: '🖤' },
  { value: 'silver', emoji: '🤍' },
  { value: 'brown',  emoji: '🤎' },
  { value: 'blonde', emoji: '💛' },
  { value: 'red',    emoji: '❤️' },
];

const DECORS = ['🌸', '✨', '💕', '⭐', '🌺', '💫', '🎀', '🌷'];

export default function Home() {
  const [waifus, setWaifus]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [search, setSearch]   = useState('');
  const [hair, setHair]       = useState('Tous');
  const [sort, setSort]       = useState('rating');

  useEffect(() => {
    const minDelay = new Promise((r) => setTimeout(r, 2500));
    Promise.all([getWaifus(), minDelay])
      .then(([d]) => setWaifus(d.data || []))
      .catch(() => setError("Impossible de charger les waifus 😢 L'API est-elle démarrée ?"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return waifus
      .filter((w) => {
        const q = search.toLowerCase();
        const ok = !q || w.name.toLowerCase().includes(q) || w.anime.toLowerCase().includes(q);
        return ok && (hair === 'Tous' || w.hair_color === hair);
      })
      .sort((a, b) =>
        sort === 'rating' ? b.rating - a.rating : a.name.localeCompare(b.name),
      );
  }, [waifus, search, hair, sort]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">

      {/* Hero */}
      <div className="text-center mb-12">
        <div className="flex justify-center gap-3 mb-3 text-2xl">
          {DECORS.map((d, i) => (
            <span key={i} className="animate-sparkle" style={{ animationDelay: `${i * 0.2}s` }}>
              {d}
            </span>
          ))}
        </div>
        <h1 className="text-5xl sm:text-7xl font-black mb-3 tracking-tight">
          <span className="gradient-text">Waifu Library</span>
        </h1>
        <p className="text-kawaii-muted text-lg font-semibold mb-2">
          La bibliothèque ultime des waifus d'anime 🌸
        </p>
        {!loading && (
          <div className="inline-flex items-center gap-2 bg-white/80 border-2 border-pink-100
                          rounded-full px-4 py-1.5 text-sm font-bold text-pink-400 shadow-kawaii">
            <span className="text-base">💖</span>
            {waifus.length} waifus cataloguées
          </div>
        )}
      </div>

      {/* Filters card */}
      <div className="card-kawaii p-5 mb-8 space-y-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="🔍 Rechercher par nom ou anime..."
        />

        {/* Sort */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-black text-pink-300 uppercase tracking-wider">Trier :</span>
          {[['rating', '⭐ Note'], ['name', '🔤 Nom']].map(([s, label]) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`text-xs px-4 py-1.5 rounded-full font-bold border-2 transition-all
                ${sort === s
                  ? 'bg-gradient-to-r from-pink-400 to-fuchsia-400 text-white border-transparent shadow-kawaii'
                  : 'bg-white border-pink-200 text-pink-400 hover:border-pink-400'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Hair filter */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-black text-pink-300 uppercase tracking-wider">Cheveux :</span>
          {HAIR_OPTIONS.map(({ value, emoji }) => (
            <button
              key={value}
              onClick={() => setHair(value)}
              className={`text-xs px-3 py-1.5 rounded-full font-bold border-2 transition-all
                ${hair === value
                  ? 'bg-gradient-to-r from-fuchsia-400 to-violet-400 text-white border-transparent shadow-kawaii'
                  : 'bg-white border-pink-100 text-pink-400 hover:border-pink-300'}`}
            >
              {emoji} {value}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && <KawaiiLoader text="Chargement des waifus..." />}

      {/* Error */}
      {error && (
        <div className="card-kawaii p-8 text-center border-red-100">
          <p className="text-4xl mb-3">😢</p>
          <p className="text-red-400 font-bold">{error}</p>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && (
        <>
          <p className="text-sm font-semibold text-pink-300 mb-5">
            💕 {filtered.length} résultat{filtered.length !== 1 ? 's' : ''} sur {waifus.length}
          </p>
          {filtered.length === 0 ? (
            <div className="card-kawaii p-16 text-center">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-kawaii-muted font-bold text-lg">Aucune waifu trouvée...</p>
              <p className="text-pink-300 text-sm mt-1">Essaie un autre terme de recherche 🌸</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filtered.map((w) => <WaifuCard key={w.id} waifu={w} />)}
            </div>
          )}
        </>
      )}

      {/* Footer */}
      {!loading && !error && (
        <p className="text-center text-pink-200 text-sm font-semibold mt-12">
          Made with 💖 • Waifu Library {new Date().getFullYear()}
        </p>
      )}
    </main>
  );
}
