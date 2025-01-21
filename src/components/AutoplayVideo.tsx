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

    // Ensure video is muted before attempting to play
    // According to Apple's docs: "A <video> element can use the play() method to automatically 
    // play without user gestures only when it contains no audio tracks or has its muted property set to true"
    video.muted = true;

    // Load only metadata initially to improve performance
    video.preload = 'metadata';

    // According to Apple's docs, playback will pause if:
    // 1. The video element gains an audio track
    // 2. Becomes unmuted without user interaction
    // 3. Video is no longer onscreen
    const playVideo = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Error attempting to play video:", error);
        });
      }
    };

    // Play video when it becomes visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            playVideo();
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.1 } // Start playing when at least 10% of the video is visible
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="w-full h-full">
      <video
        ref={videoRef}
        className="w-full h-full object-cover rounded-xl"
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