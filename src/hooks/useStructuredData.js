import { useEffect } from 'react';

const useStructuredData = (data) => {
  useEffect(() => {
    if (!data) return;

    const script = document.createElement('script');
    script.type = "application/ld+json";
    script.text = JSON.stringify(data);
    
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [data]);
};

export default useStructuredData;