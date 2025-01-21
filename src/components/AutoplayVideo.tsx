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

    // Tenta reproduzir o vídeo quando estiver carregado
    video.addEventListener('loadeddata', playVideo);
    
    // Tenta reproduzir novamente em interação do usuário
    document.addEventListener('touchstart', playVideo, { once: true });

    return () => {
      video.removeEventListener('loadeddata', playVideo);
      document.removeEventListener('touchstart', playVideo);
    };
  }, []);

  return (
    <div className="w-full h-full bg-gray-100 rounded-xl overflow-hidden">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        controls={false}
        data-playsinline="true"
        data-webkit-playsinline="true"
        data-x5-playsinline="true"
      >
        <source src={videoSrc.mp4} type="video/mp4" />
        <source src={videoSrc.webm} type="video/webm" />
      </video>
    </div>
  );
} 