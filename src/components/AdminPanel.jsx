import { useState } from 'react';
import { saveContent } from '../services/githubService';

const AdminPanel = ({ movies }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    poster_url: '',
    video_url: '', 
    download_url: '',
    category: 'Action',
    type: 'movie', // Default
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.poster_url) return alert("Title and Poster are required");

    setIsSaving(true);

    const newItem = {
      id: Date.now(), // Unique ID
      ...formData,
    };

    const success = await saveContent(newItem);

    if (success) {
      alert("✅ Content Saved Successfully! It will appear on the site in ~1 minute.");
      setFormData({ 
        title: '', description: '', poster_url: '', video_url: '', download_url: '', category: 'Action', type: 'movie' 
      });
    } else {
      alert("❌ Failed to save. Check console for errors.");
    }
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
          <h1 className="text-3xl font-bold text-brand-gold">Agasobanuye Admin</h1>
          <a href="/" className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700">Back to Home</a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: FORM */}
          <div className="lg:col-span-1 bg-[#1a1a1a] p-6 rounded-xl border border-gray-800 h-fit sticky top-6">
            <h2 className="text-xl font-bold mb-4">Add New Content</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Type Selector (Movie vs Series) */}
              <div className="bg-black p-2 rounded border border-gray-700 flex gap-2">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, type: 'movie'})}
                  className={`flex-1 py-2 rounded text-sm font-bold ${formData.type === 'movie' ? 'bg-brand-gold text-black' : 'text-gray-400'}`}
                >
                  Movie
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, type: 'series'})}
                  className={`flex-1 py-2 rounded text-sm font-bold ${formData.type === 'series' ? 'bg-brand-gold text-black' : 'text-gray-400'}`}
                >
                  Series
                </button>
              </div>

              <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="w-full bg-black border border-gray-700 rounded p-3 text-sm focus:border-brand-gold outline-none" />
              
              <div className="grid grid-cols-2 gap-2">
                <select name="category" value={formData.category} onChange={handleChange} className="bg-black border border-gray-700 rounded p-3 text-sm outline-none">
                  <option>Action</option>
                  <option>Romantic</option>
                  <option>Cartoon</option>
                  <option>Drama</option>
                  <option>Sci-Fi</option>
                </select>
                <input type="text" name="download_url" value={formData.download_url} onChange={handleChange} placeholder="Download Link" className="bg-black border border-gray-700 rounded p-3 text-sm focus:border-brand-gold outline-none" />
              </div>

              <input type="text" name="poster_url" value={formData.poster_url} onChange={handleChange} placeholder="Poster Image URL" className="w-full bg-black border border-gray-700 rounded p-3 text-sm focus:border-brand-gold outline-none" />
              
              <input type="text" name="video_url" value={formData.video_url} onChange={handleChange} placeholder="Video URL (Embed/Stream)" className="w-full bg-black border border-gray-700 rounded p-3 text-sm focus:border-brand-gold outline-none" />

              <textarea name="description" value={formData.description} onChange={handleChange} rows="3" placeholder="Description..." className="w-full bg-black border border-gray-700 rounded p-3 text-sm focus:border-brand-gold outline-none"></textarea>

              <button type="submit" disabled={isSaving} className={`w-full py-3 rounded font-bold transition-all ${isSaving ? 'bg-gray-600 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white'}`}>
                {isSaving ? "Saving to GitHub..." : "Add Content"}
              </button>
            </form>
          </div>

          {/* RIGHT: PREVIEW LIST */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-4">Current Library ({movies.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {movies.map((m) => (
                <div key={m.id} className="flex gap-3 bg-[#1a1a1a] p-3 rounded border border-gray-800">
                  <img src={m.poster_url || m.image} className="w-12 h-16 object-cover rounded bg-gray-800" alt="" />
                  <div className="overflow-hidden">
                    <h4 className="font-bold text-sm truncate">{m.title}</h4>
                    <span className="text-xs text-brand-gold uppercase">{m.type} • {m.category}</span>
                    <p className="text-xs text-gray-500 truncate">{m.download_url ? 'Has Download' : 'No Download'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminPanel;