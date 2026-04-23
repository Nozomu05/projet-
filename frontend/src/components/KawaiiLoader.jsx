export default function KawaiiLoader({ text = 'Chargement...' }) {
  return (
    <>
      <style>{`
        .loader-dot-1 { animation: sparkle-dot 1.2s ease-in-out infinite 0s; }
        .loader-dot-2 { animation: sparkle-dot 1.2s ease-in-out infinite 0.4s; }
        .loader-dot-3 { animation: sparkle-dot 1.2s ease-in-out infinite 0.8s; }
        @keyframes sparkle-dot {
          0%, 100% { opacity: 0.2; transform: scale(0.7); }
          50%       { opacity: 1;   transform: scale(1.3); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .loader-overlay { animation: fade-in 0.3s ease-out; }
      `}</style>

      <div className="loader-overlay fixed inset-0 z-50 flex flex-col items-center justify-center select-none"
           style={{ background: 'linear-gradient(135deg, #fff0f8 0%, #f5eeff 50%, #f0f8ff 100%)' }}>

        {/* GIF plein écran */}
        <img
          src="https://media1.tenor.com/m/E2paxgNjrvYAAAAC/transparent-hunni-hime.gif"
          alt="Loading"
          className="w-full h-full object-contain absolute inset-0"
        />

        {/* Texte par-dessus */}
        <div className="relative z-10 text-center space-y-3 mt-auto mb-12">
          <p className="gradient-text font-black text-3xl tracking-wide drop-shadow-lg">{text}</p>
          <div className="flex items-center justify-center gap-2">
            <span className="loader-dot-1 text-pink-400 text-2xl drop-shadow">♥</span>
            <span className="loader-dot-2 text-fuchsia-400 text-2xl drop-shadow">♥</span>
            <span className="loader-dot-3 text-pink-400 text-2xl drop-shadow">♥</span>
          </div>
        </div>

      </div>
    </>
  );
}
