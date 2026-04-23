import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getWaifu } from '../services/api';
import ImageUploader from '../components/ImageUploader';
import KawaiiLoader from '../components/KawaiiLoader';

const FALLBACK = (name) =>
  `https://placehold.co/400x600/fff0f8/f472b6?text=${encodeURIComponent(name)}&font=montserrat`;

function HeartRating({ rating }) {
  const filled = Math.round(parseFloat(rating) / 2);
  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-1">
        {Array(5).fill(0).map((_, i) => (
          <span key={i} className={`text-2xl ${i < filled ? 'text-pink-400' : 'text-pink-100'}`}>
            ♥
          </span>
        ))}
      </div>
      <span className="ml-2 font-black text-2xl gradient-text">{rating}</span>
      <span className="text-pink-300 font-semibold">/10</span>
    </div>
  );
}

function InfoCard({ label, value, emoji }) {
  return (
    <div className="card-kawaii p-4 text-center">
      <p className="text-2xl mb-1">{emoji}</p>
      <p className="text-xs text-pink-300 uppercase tracking-wider font-black mb-1">{label}</p>
      <p className="text-kawaii-text font-bold capitalize text-sm">{value}</p>
    </div>
  );
}

export default function WaifuDetail() {
  const { id }                      = useParams();
  const [waifu, setWaifu]           = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [showUploader, setShowUploader] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    const minDelay = new Promise((r) => setTimeout(r, 2500));
    Promise.all([getWaifu(id), minDelay])
      .then(([data]) => setWaifu(data))
      .catch(() => setError('Waifu introuvable 😢'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const handleImageSuccess = () => {
    setShowUploader(false);
    load();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <KawaiiLoader text="Chargement..." />
      </div>
    );
  }

  if (error || !waifu) {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-4">😢</p>
        <p className="text-red-400 font-bold text-lg mb-4">{error}</p>
        <Link to="/" className="btn-kawaii">← Retour à la bibliothèque</Link>
      </div>
    );
  }

  const traits = waifu.personality?.split(',').map((t) => t.trim()) ?? [];

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">

      {/* Back */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-pink-400 hover:text-pink-600 font-bold
                   transition-colors mb-8 text-sm bg-white/60 hover:bg-white px-4 py-2 rounded-full
                   border border-pink-200 shadow-sm"
      >
        🌸 Retour à la bibliothèque
      </Link>

      <div className="grid md:grid-cols-[280px_1fr] gap-8 items-start">

        {/* Left — Image + uploader */}
        <div className="space-y-4">
          <div className="card-kawaii overflow-hidden aspect-[2/3] bg-pink-50 shadow-kawaii-lg">
            <img
              src={waifu.image_url}
              alt={waifu.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = FALLBACK(waifu.name); }}
            />
          </div>

          <button
            onClick={() => setShowUploader((v) => !v)}
            className="btn-kawaii-outline w-full text-center"
          >
            {showUploader ? '✕ Fermer' : '📸 Changer l\'image'}
          </button>

          {showUploader && (
            <ImageUploader waifuId={waifu.id} onSuccess={handleImageSuccess} />
          )}
        </div>

        {/* Right — Info */}
        <div className="space-y-6">

          {/* Name & anime */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-4xl font-black gradient-text tracking-tight">{waifu.name}</h1>
              <span className="text-2xl animate-float">✨</span>
            </div>
            <p className="text-fuchsia-400 font-bold text-lg">{waifu.anime}</p>
          </div>

          {/* Rating */}
          <div className="card-kawaii p-4">
            <p className="text-xs text-pink-300 uppercase tracking-wider font-black mb-2">Note</p>
            <HeartRating rating={waifu.rating} />
          </div>

          {/* Description */}
          {waifu.description && (
            <div className="card-kawaii p-4">
              <p className="text-xs text-pink-300 uppercase tracking-wider font-black mb-2">
                💬 Description
              </p>
              <p className="text-kawaii-text leading-relaxed text-sm font-medium">
                {waifu.description}
              </p>
            </div>
          )}

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            {waifu.hair_color && (
              <InfoCard label="Cheveux" value={waifu.hair_color} emoji="💇" />
            )}
            <InfoCard label="Note" value={`${waifu.rating} / 10`} emoji="⭐" />
          </div>

          {/* Personality traits */}
          {traits.length > 0 && (
            <div className="card-kawaii p-4">
              <p className="text-xs text-pink-300 uppercase tracking-wider font-black mb-3">
                💖 Personnalité
              </p>
              <div className="flex flex-wrap gap-2">
                {traits.map((t) => (
                  <span
                    key={t}
                    className="badge-kawaii bg-gradient-to-r from-pink-50 to-fuchsia-50
                               border-pink-200 text-pink-600 font-bold"
                  >
                    🌸 {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
