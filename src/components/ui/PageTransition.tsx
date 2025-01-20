'use client';

import { useEffect, useState } from 'react';

export default function PageTransition() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleNavigationStart = () => {
      setIsVisible(true);
    };

    window.addEventListener('beforeunload', handleNavigationStart);
    return () => {
      window.removeEventListener('beforeunload', handleNavigationStart);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 bg-white z-[9999] animate-fadeIn"
      style={{
        animation: 'fadeIn 0.3s ease-in-out forwards'
      }}
    >
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
} 