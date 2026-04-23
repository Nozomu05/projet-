import { Link } from 'react-router-dom';

const HAIR_BADGE = {
  blue:   { bg: 'bg-sky-100   border-sky-200   text-sky-600',   dot: 'bg-sky-400'   },
  pink:   { bg: 'bg-pink-100  border-pink-200  text-pink-600',  dot: 'bg-pink-400'  },
  orange: { bg: 'bg-orange-100 border-orange-200 text-orange-600', dot: 'bg-orange-400' },
  black:  { bg: 'bg-slate-100 border-slate-200 text-slate-600', dot: 'bg-slate-400' },
  silver: { bg: 'bg-gray-100  border-gray-200  text-gray-500',  dot: 'bg-gray-300'  },
  brown:  { bg: 'bg-amber-100 border-amber-200 text-amber-700', dot: 'bg-amber-400' },
  blonde: { bg: 'bg-yellow-100 border-yellow-200 text-yellow-600', dot: 'bg-yellow-400' },
  red:    { bg: 'bg-red-100   border-red-200   text-red-600',   dot: 'bg-red-400'   },
};

const FALLBACK = (name) =>
  `https://placehold.co/300x450/fff0f8/f472b6?text=${encodeURIComponent(name)}&font=montserrat`;

function Hearts({ rating }) {
  const filled = Math.round(rating / 2);
  return (
    <div className="flex gap-0.5">
      {Array(5).fill(0).map((_, i) => (
        <span key={i} className={`text-sm ${i < filled ? 'text-pink-400' : 'text-pink-100'}`}>
          ♥
        </span>
      ))}
    </div>
  );
}

export default function WaifuCard({ waifu }) {
  const hair      = HAIR_BADGE[waifu.hair_color];
  const firstTrait = waifu.personality?.split(',')[0]?.trim();

  return (
    <Link to={`/waifu/${waifu.id}`} className="group block">
      <div className="card-kawaii overflow-hidden hover:shadow-kawaii-lg hover:-translate-y-2 hover:border-pink-300">

        {/* Image */}
        <div className="relative aspect-[2/3] overflow-hidden bg-pink-50">
          <img
            src={waifu.image_url}
            alt={waifu.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.target.src = FALLBACK(waifu.name); }}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent" />

          {/* Rating bubble */}
          <div className="absolute top-2.5 right-2.5 bg-white/80 backdrop-blur-sm
                          rounded-full px-2.5 py-1 flex items-center gap-1
                          border border-pink-200 shadow-sm">
            <span className="text-pink-400 text-xs">★</span>
            <span className="text-pink-600 text-xs font-black">{waifu.rating}</span>
          </div>
        </div>

        {/* Info */}
        <div className="p-3.5">
          <h3 className="font-black text-sm gradient-text truncate mb-0.5 group-hover:opacity-80 transition-opacity">
            {waifu.name}
          </h3>
          <p className="text-xs text-kawaii-muted font-semibold truncate mb-2">{waifu.anime}</p>

          <Hearts rating={parseFloat(waifu.rating)} />

          <div className="flex flex-wrap gap-1 mt-2">
            {hair && (
              <span className={`badge-kawaii ${hair.bg} flex items-center gap-1`}>
                <span className={`w-1.5 h-1.5 rounded-full ${hair.dot}`} />
                {waifu.hair_color}
              </span>
            )}
            {firstTrait && (
              <span className="badge-kawaii bg-fuchsia-50 border-fuchsia-200 text-fuchsia-600">
                {firstTrait}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
