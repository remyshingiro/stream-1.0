import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import WatchModal from '../components/WatchModal'; // <--- Import your existing modal

const WatchPage = ({ allMovies }) => {
  const { id } = useParams(); // 1. Get ID from URL (e.g., "123")
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    // 2. Find the movie that matches the ID
    // (If you fetch from API, you would do that here instead)
    if (allMovies && allMovies.length > 0) {
      const found = allMovies.find(m => m.id.toString() === id);
      setMovie(found);
    }
  }, [id, allMovies]);

  // 3. Handle closing (Go back to Home)
  const handleClose = () => {
    navigate('/');
  };

  if (!movie) return <div className="text-white p-10">Loading movie...</div>;

  // 4. Render your EXISTING Modal, but forced "open"
  return (
    <WatchModal 
      content={movie} 
      allContent={allMovies} 
      onClose={handleClose} 
      onContentChange={(newMovie) => navigate(`/watch/${newMovie.id}`)}
    />
  );
};

export default WatchPage;