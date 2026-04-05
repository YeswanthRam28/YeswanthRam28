import React, { useEffect, useRef } from 'react';

export default function BackgroundVideo() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Load video metadata to get duration
    video.load();

    let animationFrameId;

    const handleScroll = () => {
      if (isNaN(video.duration) || video.duration === 0) return;
      
      const scrollY = window.scrollY;
      const maxScroll = window.innerHeight;
      
      let scrollFraction = scrollY / maxScroll;
      scrollFraction = Math.max(0, Math.min(1, scrollFraction));

      const videoTime = video.duration * scrollFraction;
      
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        video.currentTime = videoTime;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Attempt to handle when duration changes (e.g. metadata loaded)
    video.addEventListener('loadedmetadata', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      video.removeEventListener('loadedmetadata', handleScroll);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src="/King.mp4"
      muted
      playsInline
      preload="auto"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        objectFit: 'cover',
        zIndex: -1,
        pointerEvents: 'none'
      }}
    ></video>
  );
}
