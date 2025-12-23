import { useState, useMemo } from 'react';
import { saveOrUpdateContent, deleteContent } from '../services/githubService';
import toast from 'react-hot-toast';

// --- CONFIGURATION (From .env) ---
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET;

const AdminPanel = ({ movies }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);

  const initialForm = {
    title: '', description: '', poster_url: '', 
    video_url: '', download_url: '', category: 'Action', type: 'movie',
    is_popular: false, interpreter_name: '' 
  };
  const [formData, setFormData] = useState(initialForm);

  // --- FILTERING LOGIC ---
  const filteredContent = useMemo(() => {
    return movies.filter(item => {
      const matchesTab = activeTab === 'all' ? true : item.type === activeTab;
      const title = item.title || ""; 
      const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [movies, activeTab, searchTerm]);

  // --- CLOUDINARY UPLOAD LOGIC ---
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_PRESET) {
      toast.error("Cloudinary keys missing in .env!");
      return;
    }

    setIsUploading(true);
    const uploadToast = toast.loading("Uploading image...");
    
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
        setFormData(prev => ({ ...prev, poster_url: fileData.secure_url }));
        toast.success("Image uploaded!");
      } else {
        throw new Error(fileData.error?.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      toast.dismiss(uploadToast);
      setIsUploading(false);
    }
  };

  // --- FORM HANDLERS ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) return toast.error("Title is required!");

    setIsSaving(true);
    const loadingToast = toast.loading("Saving changes to GitHub...");

    const itemToSave = {
      ...formData,
      id: editingId || Date.now().toString(),
    };

    const success = await saveOrUpdateContent(itemToSave, !!editingId);
    
    toast.dismiss(loadingToast);

    if (success) {
      toast.success(editingId ? "Updated Successfully!" : "Added Successfully!");
      if (!editingId) setFormData(initialForm);
      setEditingId(null);
      // Give GitHub a second to process before reload
      setTimeout(() => window.location.reload(), 1500); 
    } else {
      toast.error("Save failed. Check console.");
    }
    setIsSaving(false);
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast("Editing mode enabled", { icon: '✏️' });
  };

  const handleDelete = async (item) => {
    if(!window.confirm(`Are you sure you want to delete "${item.title}"?`)) return;
    
    setIsSaving(true);
    const loadingToast = toast.loading("Deleting content...");
    
    const success = await deleteContent(item);
    
    toast.dismiss(loadingToast);

    if (success) {
      toast.success("Deleted Successfully");
      setTimeout(() => window.location.reload(), 1500);
    } else {
      toast.error("Delete failed.");
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
            <button onClick={() => window.open('/', '_blank')} className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 transition-colors">View Site</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- LEFT: EDITOR FORM (Scroll Fixed) --- */}
          <div className="lg:col-span-4">
            <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800 sticky top-6 max-h-[85vh] overflow-y-auto custom-scrollbar shadow-2xl">
              <h2 className="text-xl font-bold mb-4 text-white flex justify-between items-center sticky top-0 bg-[#1a1a1a] pb-2 z-10">
                {editingId ? 'Edit Content' : 'Add New Content'}
                {editingId && <button onClick={() => {setEditingId(null); setFormData(initialForm)}} className="text-xs text-red-400 underline hover:text-red-300">Cancel</button>}
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

                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Title (e.g. Iron Man)" className="w-full bg-black border border-gray-700 rounded p-3 text-sm focus:border-red-600 outline-none transition-colors" />
                
                {/* --- IMAGE UPLOADER --- */}
                <div className="space-y-2 border border-gray-800 p-3 rounded-lg bg-black/30">
                  <label className="text-xs text-gray-400 uppercase font-bold flex justify-between">
                    Poster Image
                    {isUploading && <span className="text-yellow-500 animate-pulse">Uploading...</span>}
                  </label>
                  
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="w-full text-xs text-gray-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-gray-800 file:text-white hover:file:bg-gray-700 cursor-pointer"
                  />

                  <input 
                    value={formData.poster_url} 
                    onChange={e => setFormData({...formData, poster_url: e.target.value})} 
                    placeholder="or paste image URL..." 
                    className="w-full bg-black border border-gray-700 rounded p-2 text-xs focus:border-red-600 outline-none text-gray-300" 
                    readOnly={isUploading}
                  />
                  
                  {formData.poster_url && !isUploading && (
                    <div className="w-full h-48 bg-black rounded border border-gray-700 overflow-hidden flex justify-center items-center mt-2 relative group">
                      <img src={formData.poster_url} alt="Preview" className="h-full object-contain" />
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, poster_url: ''})}
                        className="absolute top-2 right-2 bg-red-600/90 hover:bg-red-600 text-white text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <input value={formData.interpreter_name || ''} onChange={e => setFormData({...formData, interpreter_name: e.target.value})} placeholder="Interpreter (e.g. Rocky)" className="w-full bg-black border border-gray-700 rounded p-3 text-sm focus:border-red-600 outline-none" />

                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="3" placeholder="Plot description..." className="w-full bg-black border border-gray-700 rounded p-3 text-sm focus:border-red-600 outline-none"></textarea>

                <input value={formData.video_url} onChange={e => setFormData({...formData, video_url: e.target.value})} placeholder="Streaming URL (hglink/m3u8)" className="w-full bg-black border border-gray-700 rounded p-3 text-sm focus:border-red-600 outline-none" />
                
                <input value={formData.download_url} onChange={e => setFormData({...formData, download_url: e.target.value})} placeholder="Download URL (Mediafire)" className="w-full bg-black border border-gray-700 rounded p-3 text-sm focus:border-red-600 outline-none" />

                <label className="flex items-center gap-3 cursor-pointer bg-black p-3 rounded border border-gray-700 hover:border-gray-500 transition-colors">
                  <input type="checkbox" checked={formData.is_popular} onChange={e => setFormData({...formData, is_popular: e.target.checked})} className="accent-red-600 w-4 h-4" />
                  <span className="text-sm text-gray-300 select-none">Mark as Trending / Popular</span>
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
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 bg-[#1a1a1a] p-4 rounded-xl border border-gray-800 shadow-lg">
              <div className="flex gap-2">
                {['all', 'movie', 'series'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition-all ${activeTab === tab ? 'bg-white text-black shadow-md' : 'bg-black text-gray-400 hover:bg-gray-800'}`}
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
                className="bg-black border border-gray-700 rounded-full px-4 py-2 text-sm w-full sm:w-64 focus:border-red-600 outline-none transition-all placeholder-gray-600"
              />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredContent.map((item) => (
                <div key={item.id} className="group flex gap-4 bg-[#1a1a1a] p-3 rounded-lg border border-gray-800 hover:border-gray-500 hover:bg-[#222] transition-all cursor-default">
                  <img src={item.poster_url || '/placeholder.jpg'} className="w-16 h-24 object-cover rounded bg-gray-900 shadow-md" alt="" />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-white truncate pr-2 text-sm" title={item.title}>{item.title}</h4>
                        <span className={`text-[9px] px-2 py-0.5 rounded uppercase font-bold tracking-wider ${item.type === 'series' ? 'bg-purple-900/50 text-purple-200 border border-purple-800' : 'bg-blue-900/50 text-blue-200 border border-blue-800'}`}>
                          {item.type}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate">{item.interpreter_name || 'No Interpreter'}</p>
                    </div>
                    
                    <div className="flex gap-2 mt-2 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(item)} className="px-3 py-1.5 bg-gray-800 text-[10px] uppercase font-bold tracking-wide rounded hover:bg-white hover:text-black transition-colors">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(item)} className="px-3 py-1.5 bg-red-900/20 text-red-500 text-[10px] uppercase font-bold tracking-wide rounded hover:bg-red-600 hover:text-white transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredContent.length === 0 && (
              <div className="text-center py-20 text-gray-600 bg-[#1a1a1a] rounded-xl border border-gray-800 mt-4">
                <p>No content found matching your search.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminPanel;