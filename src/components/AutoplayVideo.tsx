import React from 'react';

interface AutoplayVideoProps {
  videoSrc: {
    mp4: string;
    webm: string;
  };
  poster: string;
}

export default function AutoplayVideo({ videoSrc, poster }: AutoplayVideoProps) {
  return (
    <div className="w-full h-full bg-gray-100 rounded-xl overflow-hidden">
      <video
        className="w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster={poster}
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