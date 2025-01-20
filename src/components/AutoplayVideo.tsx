import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';

interface AutoplayVideoProps {
  videoSrc: {
    mp4: string;
    webm: string;
  };
  poster: string;
}

const isSafari = () => {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent.toLowerCase();
  return ua.indexOf("safari") > -1 && ua.indexOf("chrome") < 0;
};

export default function AutoplayVideo({ videoSrc, poster }: AutoplayVideoProps) {
  const videoParentRef = useRef<HTMLDivElement>(null);
  const [shouldUseImage, setShouldUseImage] = useState(false);

  useEffect(() => {
    if (isSafari() && videoParentRef.current) {
      const player = videoParentRef.current.children[0] as HTMLVideoElement;

      if (player) {
        player.controls = false;
        player.playsInline = true;
        player.muted = true;
        player.setAttribute("muted", "");
        player.autoplay = true;

        setTimeout(() => {
          const promise = player.play();
          if (promise && promise.then) {
            promise
              .then(() => {
                // Video started playing successfully
              })
              .catch(() => {
                // Fallback to image if video fails to play
                if (videoParentRef.current) {
                  videoParentRef.current.style.display = "none";
                }
                setShouldUseImage(true);
              });
          }
        }, 0);
      }
    }
  }, []);

  if (shouldUseImage) {
    return (
      <Image
        src={poster}
        alt="Video Thumbnail"
        width={400}
        height={400}
        className="w-full h-full object-cover rounded-xl"
      />
    );
  }

  return (
    <div
      ref={videoParentRef}
      className="w-full h-full"
      dangerouslySetInnerHTML={{
        __html: `
          <video
            loop
            muted
            autoplay
            playsinline
            preload="metadata"
            poster="${poster}"
            class="w-full h-full object-cover rounded-xl"
          >
            <source src="${videoSrc.mp4}" type="video/mp4" />
            <source src="${videoSrc.webm}" type="video/webm" />
          </video>
        `
      }}
    />
  );
} 