import { useState } from 'react';
import { staticMovies } from './data/staticMovies'; 
import { staticSeries } from './data/staticSeries';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import WatchModal from './components/WatchModal';

function App() {
  // 1. Merge Data
  const allContent = [...staticMovies, ...staticSeries];

  // 2. State Management
  const [selectedContent, setSelectedContent] = useState(null); // Controls the Modal
  const [searchTerm, setSearchTerm] = useState(""); // Controls Search

  return (
    <div className="min-h-screen bg-brand-dark font-sans relative">
      <Navbar onSearch={setSearchTerm} />

      {/* --- PAGE CONTENT --- */}
      {/* We hide the homepage when the modal is open to prevent scrolling issues, 
          or you can leave it visible behind the modal. */}
      <div className={selectedContent ? "hidden" : "block"}>
        <Home 
          contentData={allContent} 
          searchTerm={searchTerm} 
          onMovieClick={(item) => setSelectedContent(item)} 
        />
      </div>

      {/* --- THE LOGIC: WATCH MODAL --- */}
      {/* If selectedContent exists, render the Modal */}
      {selectedContent && (
        <WatchModal 
          content={selectedContent}
          allContent={allContent} // Passed for recommendations
          onClose={() => setSelectedContent(null)}
        />
      )}

      <Footer />
    </div>
  );
}

export default App;