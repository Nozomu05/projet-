import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b-2 border-pink-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="text-2xl animate-float select-none">🌸</span>
          <div>
            <p className="text-lg font-black gradient-text leading-none tracking-tight">
              Waifu Library
            </p>
            <p className="text-[10px] text-pink-300 font-semibold leading-none tracking-wider uppercase">
              Anime Collection ✨
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <a
            href="/health"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-xs text-pink-400 font-semibold
                       bg-pink-50 hover:bg-pink-100 px-3 py-1.5 rounded-full border border-pink-200
                       transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            API ✓
          </a>
        </div>

      </div>
    </nav>
  );
}
