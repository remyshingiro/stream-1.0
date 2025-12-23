import { useState, useMemo } from 'react';
import { saveOrUpdateContent, deleteContent } from '../services/githubService';

// --- CONFIGURATION ---
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET;

const AdminPanel = ({ movies }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // New state for image upload
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);

  const initialForm = {
    title: '', description: '', poster_url: '', 
    video_url: '', download_url: '', category: 'Action', type: 'movie',
    is_popular: false, interpreter_name: '' // Added interpreter default
  };
  const [formData, setFormData] = useState(initialForm);

  // --- FILTERING LOGIC ---
  const filteredContent = useMemo(() => {
    return movies.filter(item => {
      const matchesTab = activeTab === 'all' ? true : item.type === activeTab;
      // Safety check: ensure title exists before lowercasing
      const title = item.title || ""; 
      const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [movies, activeTab, searchTerm]);

  // --- CLOUDINARY UPLOAD LOGIC ---
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", CLOUDINARY_PRESET);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: data,
      });
      const fileData = await res.json();
      
      if (fileData.secure_url) {
        // Automatically set the poster URL
        setFormData(prev => ({ ...prev, poster_url: fileData.secure_url }));
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  // --- FORM HANDLERS ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) return alert("Title required");

    setIsSaving(true);
    const itemToSave = {
      ...formData,
      id: editingId || Date.now().toString(),
    };

    const success = await saveOrUpdateContent(itemToSave, !!editingId);
    
    if (success) {
      alert(editingId ? "✅ Updated Successfully!" : "✅ Added Successfully!");
      if (!editingId) setFormData(initialForm); // Only clear if adding new
      setEditingId(null);
      window.location.reload(); 
    } else {
      alert("❌ Failed. Check console.");
    }
    setIsSaving(false);
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (item) => {
    if(!window.confirm(`Are you sure you want to delete "${item.title}"?`)) return;
    
    setIsSaving(true);
    const success = await deleteContent(item);
    if (success) {
      alert("🗑️ Deleted Successfully");
      window.location.reload();
    }
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-6 pb-20">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-gray-800 pb-6 gap-4">
          <h1 className="text-3xl font-bold text-red-600">Admin Dashboard</h1>
          <div className="flex gap-4">
            <button onClick={() => window.open('/', '_blank')} className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700">View Site</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- LEFT: EDITOR FORM (Scroll Fixed) --- */}
          <div className="lg:col-span-4">
            {/* ADDED: max-h-[85vh] and overflow-y-auto for scrolling */}
            <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800 sticky top-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
              <h2 className="text-xl font-bold mb-4 text-white flex justify-between items-center">
                {editingId ? 'Edit Content' : 'Add New Content'}
                {editingId && <button onClick={() => {setEditingId(null); setFormData(initialForm)}} className="text-xs text-red-400 underline">Cancel Edit</button>}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Type Toggle */}
                <div className="flex bg-black p-1 rounded-lg border border-gray-700">
                  {['movie', 'series'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({...formData, type})}
                      className={`flex-1 py-2 text-sm font-bold rounded-md capitalize transition-all ${formData.type === type ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Movie Title" className="w-full bg-black border border-gray-700 rounded p-3 text-sm focus:border-red-600 outline-none transition-colors" />
                
                {/* --- NEW: IMAGE UPLOADER --- */}
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 uppercase font-bold">Poster Image</label>
                  
                  {/* File Input */}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-white hover:file:bg-gray-700 cursor-pointer"
                  />

                  {/* Manual URL Input (Hidden if uploading, or kept as fallback) */}
                  <input 
                    value={formData.poster_url} 
                    onChange={e => setFormData({...formData, poster_url: e.target.value})} 
                    placeholder="...or paste Image URL" 
                    className="w-full bg-black border border-gray-700 rounded p-3 text-sm focus:border-red-600 outline-none" 
                    readOnly={isUploading}
                  />
                  
                  {/* Loading / Preview */}
                  {isUploading && <p className="text-yellow-500 text-xs animate-pulse">Uploading to Cloud...</p>}
                  
                  {formData.poster_url && !isUploading && (
                    <div className="w-full h-40 bg-black rounded border border-gray-700 overflow-hidden flex justify-center items-center mt-2 relative group">
                      <img src={formData.poster_url} alt="Preview" className="h-full object-contain" />
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, poster_url: ''})}
                        className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
                {/* --------------------------- */}

                <input value={formData.interpreter_name || ''} onChange={e => setFormData({...formData, interpreter_name: e.target.value})} placeholder="Interpreter (e.g. Rocky)" className="w-full bg-black border border-gray-700 rounded p-3 text-sm focus:border-red-600 outline-none" />

                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="3" placeholder="Description..." className="w-full bg-black border border-gray-700 rounded p-3 text-sm focus:border-red-600 outline-none"></textarea>

                <input value={formData.video_url} onChange={e => setFormData({...formData, video_url: e.target.value})} placeholder="Streaming Link (hglink/m3u8)" className="w-full bg-black border border-gray-700 rounded p-3 text-sm focus:border-red-600 outline-none" />
                
                <input value={formData.download_url} onChange={e => setFormData({...formData, download_url: e.target.value})} placeholder="Download Link (Mediafire)" className="w-full bg-black border border-gray-700 rounded p-3 text-sm focus:border-red-600 outline-none" />

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.is_popular} onChange={e => setFormData({...formData, is_popular: e.target.checked})} />
                  <span className="text-sm text-gray-300">Mark as Popular/Trending</span>
                </label>

                <button type="submit" disabled={isSaving || isUploading} className={`w-full py-3 rounded font-bold transition-all ${isSaving || isUploading ? 'bg-gray-600 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/20'}`}>
                  {isSaving ? "Saving..." : (editingId ? "Update Content" : "Publish Content")}
                </button>
              </form>
            </div>
          </div>

          {/* --- RIGHT: CONTENT LIST --- */}
          <div className="lg:col-span-8">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 bg-[#1a1a1a] p-4 rounded-xl border border-gray-800">
              <div className="flex gap-2">
                {['all', 'movie', 'series'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-full text-xs font-bold capitalize ${activeTab === tab ? 'bg-white text-black' : 'bg-black text-gray-400 hover:bg-gray-800'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <input 
                type="text" 
                placeholder="Search database..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-black border border-gray-700 rounded-full px-4 py-2 text-sm w-full sm:w-64 focus:border-red-600 outline-none"
              />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredContent.map((item) => (
                <div key={item.id} className="group flex gap-4 bg-[#1a1a1a] p-3 rounded-lg border border-gray-800 hover:border-gray-600 transition-all">
                  <img src={item.poster_url || '/placeholder.jpg'} className="w-16 h-24 object-cover rounded bg-gray-900" alt="" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-white truncate pr-2">{item.title}</h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded ${item.type === 'series' ? 'bg-purple-900 text-purple-200' : 'bg-blue-900 text-blue-200'}`}>
                        {item.type}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{item.interpreter_name || 'No Interpreter'}</p>
                    <p className="text-xs text-gray-600 truncate mt-1">{item.id}</p>
                    
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => handleEdit(item)} className="px-3 py-1 bg-gray-800 text-xs rounded hover:bg-white hover:text-black transition-colors">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(item)} className="px-3 py-1 bg-red-900/30 text-red-500 text-xs rounded hover:bg-red-600 hover:text-white transition-colors">
                        Delete
                      </button>
                    </div>
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