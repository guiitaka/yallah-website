import React, { useEffect, useRef, useState } from 'react';

interface AutoplayVideoProps {
  videoSrc: {
    mp4: string;
    webm: string;
  };
}

export default function AutoplayVideo({ videoSrc }: AutoplayVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Função para tentar reproduzir o vídeo
    const attemptPlay = async () => {
      try {
        await video.play();
        setIsPlaying(true);
        console.log('Video playing successfully');
      } catch (error) {
        console.log('Autoplay prevented:', error);
        setIsPlaying(false);
      }
    };

    // Eventos para tentar reproduzir o vídeo
    const playEvents = ['touchstart', 'click'];
    const mediaEvents = ['loadeddata', 'loadedmetadata'];

    // Tenta reproduzir quando o vídeo estiver carregado
    mediaEvents.forEach(event => {
      video.addEventListener(event, attemptPlay);
    });

    // Tenta reproduzir em interação do usuário
    playEvents.forEach(event => {
      document.addEventListener(event, attemptPlay, { once: true });
    });

    // Cleanup
    return () => {
      mediaEvents.forEach(event => {
        video.removeEventListener(event, attemptPlay);
      });
      playEvents.forEach(event => {
        document.removeEventListener(event, attemptPlay);
      });
    };
  }, []);

  return (
    <div className="w-full h-full bg-gray-100 rounded-xl overflow-hidden">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        playsInline
        autoPlay
        muted
        loop
        preload="metadata"
        controls={false}
      >
        <source src={videoSrc.mp4} type="video/mp4" />
        <source src={videoSrc.webm} type="video/webm" />
      </video>
    </div>
  );
} 