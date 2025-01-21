import React, { useRef, useEffect } from 'react';
import Image from 'next/image';

interface AutoplayVideoProps {
  videoSrc: {
    mp4: string;
    webm: string;
  };
  poster: string;
}

export default function AutoplayVideo({ videoSrc, poster }: AutoplayVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');

    video.play().catch((error) => {
      console.error("Error playing video:", error);
    });
  }, []);

  return (
    <div className="w-full h-full">
      <video
        ref={videoRef}
        className="w-full h-full object-cover rounded-xl"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster={poster}
      >
        <source src={videoSrc.mp4} type="video/mp4" />
        <source src={videoSrc.webm} type="video/webm" />
        <Image
          src={poster}
          alt="Video Thumbnail"
          width={400}
          height={400}
          className="w-full h-full object-cover rounded-xl"
        />
      </video>
    </div>
  );
} 