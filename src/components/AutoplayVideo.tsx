import React, { useRef, useEffect, useState } from 'react';
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Reset video state
    video.pause();
    video.currentTime = 0;
    
    // Ensure video is muted before attempting to play
    video.muted = true;
    video.defaultMuted = true;
    
    // Load only metadata initially
    video.preload = 'metadata';

    const handleCanPlay = () => {
      setIsLoading(false);
      playVideo();
    };

    const playVideo = () => {
      if (video.paused) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error("Error attempting to play video:", error);
          });
        }
      }
    };

    // Play video when it becomes visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLoading) {
            playVideo();
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.1 }
    );

    // Add event listeners
    video.addEventListener('canplay', handleCanPlay);
    observer.observe(video);

    // Cleanup
    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      observer.disconnect();
    };
  }, [isLoading]);

  return (
    <div className="w-full h-full bg-gray-100 rounded-xl overflow-hidden">
      {isLoading && (
        <div className="w-full h-full flex items-center justify-center">
          <Image
            src={poster}
            alt="Video Thumbnail"
            width={400}
            height={400}
            className="w-full h-full object-cover"
            priority
          />
        </div>
      )}
      <video
        ref={videoRef}
        className={`w-full h-full object-cover ${isLoading ? 'hidden' : ''}`}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster}
        controls={false}
      >
        <source src={videoSrc.mp4} type="video/mp4" />
        <source src={videoSrc.webm} type="video/webm" />
      </video>
    </div>
  );
} 