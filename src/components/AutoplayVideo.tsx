import React, { useEffect, useRef } from 'react';

interface AutoplayVideoProps {
  videoSrc: {
    mp4: string;
    webm: string;
  };
}

export default function AutoplayVideo({ videoSrc }: AutoplayVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = () => {
      video.play().catch((error) => {
        console.log('Autoplay prevented:', error);
      });
    };

    video.addEventListener('loadeddata', playVideo);
    
    return () => {
      video.removeEventListener('loadeddata', playVideo);
    };
  }, []);

  return (
    <div className="w-full h-full bg-gray-100 rounded-xl overflow-hidden">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay={true}
        playsInline
        muted
        loop
      >
        <source src={videoSrc.mp4} type="video/mp4" />
        <source src={videoSrc.webm} type="video/webm" />
      </video>
    </div>
  );
} 