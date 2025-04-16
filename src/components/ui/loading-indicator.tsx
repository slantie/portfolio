import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const LoadingIndicator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [location]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-primary"></div>
    </div>
  );
};

export default LoadingIndicator;
