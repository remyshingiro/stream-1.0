import { useEffect } from 'react';

const SEO = ({ title }) => {
  useEffect(() => {
    // 1. Capture the current title (e.g., "StreamIt")
    const originalTitle = document.title;

    // 2. Set the NEW title immediately
    if (title) {
      document.title = `${title} | StreamIt`;
    }

    // 3. Cleanup: When this component is removed (modal closes),
    // revert back to the original title.
    return () => {
      document.title = originalTitle;
    };
  }, [title]); // Re-run if the movie title changes

  return null; // This component doesn't render any HTML
};

export default SEO;