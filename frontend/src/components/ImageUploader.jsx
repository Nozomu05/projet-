import { useState, useRef } from 'react';
import { uploadWaifuImage, updateWaifuImageUrl } from '../services/api';

export default function ImageUploader({ waifuId, onSuccess }) {
  const [tab, setTab]         = useState('url');   // 'url' | 'file'
  const [url, setUrl]         = useState('');
  const [file, setFile]       = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);
  const inputRef              = useRef();

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (!f || !f.type.startsWith('image/')) {
      setError('Fichier invalide. Images uniquement 🌸');
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError(null);
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      if (tab === 'url') {
        if (!url.trim()) throw new Error('Entre une URL valide');
        await updateWaifuImageUrl(waifuId, url.trim());
      } else {
        if (!file) throw new Error('Sélectionne une image');
        await uploadWaifuImage(waifuId, file);
      }
      setSuccess(true);
      setTimeout(() => { onSuccess?.(); setSuccess(false); }, 1200);
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-kawaii p-5 space-y-4">
      <h3 className="font-black text-base gradient-text">📸 Changer l'image</h3>

      {/* Tabs */}
      <div className="flex bg-pink-50 rounded-2xl p-1 gap-1">
        {[['url', '🔗 URL'], ['file', '📁 Fichier']].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all
              ${tab === key
                ? 'bg-white text-pink-500 shadow-kawaii'
                : 'text-pink-300 hover:text-pink-400'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* URL tab */}
      {tab === 'url' && (
        <div className="space-y-3">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://image-du-personnage.jpg"
            className="input-kawaii text-sm"
          />
          {url && (
            <div className="rounded-2xl overflow-hidden aspect-video bg-pink-50">
              <img
                src={url}
                alt="preview"
                className="w-full h-full object-contain"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          )}
        </div>
      )}

      {/* File tab */}
      {tab === 'file' && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-pink-200 rounded-2xl p-6 text-center
                     hover:border-pink-400 hover:bg-pink-50 transition-all cursor-pointer"
        >
          {preview ? (
            <img src={preview} alt="preview" className="max-h-40 mx-auto rounded-xl object-contain" />
          ) : (
            <div className="space-y-2">
              <p className="text-3xl">🌸</p>
              <p className="text-sm font-bold text-pink-400">Glisser-déposer une image</p>
              <p className="text-xs text-pink-300">ou cliquer pour parcourir</p>
              <p className="text-xs text-pink-200">PNG, JPG, WEBP — max 5 Mo</p>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}

      {error && (
        <p className="text-xs text-red-400 font-semibold bg-red-50 rounded-xl px-3 py-2">
          ⚠️ {error}
        </p>
      )}

      {success && (
        <p className="text-xs text-green-600 font-semibold bg-green-50 rounded-xl px-3 py-2">
          ✨ Image mise à jour avec succès !
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="btn-kawaii w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? '✨ Chargement...' : '💖 Mettre à jour l\'image'}
      </button>
    </div>
  );
}
