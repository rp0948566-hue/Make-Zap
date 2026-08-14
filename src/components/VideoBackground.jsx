import React, { useRef, useEffect, useState } from 'react';

const VIDEO_URL = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260329_050842_be71947f-f16e-4a14-810c-06e83d23ddb5.mp4";

export const VideoBackground = () => {
  const videoRef = useRef(null);
  const fadingOutRef = useRef(false);
  const animFrameRef = useRef(null);
  const currentOpacityRef = useRef(0);
  const [opacity, setOpacity] = useState(0);

  const updateOpacity = (val) => {
    currentOpacityRef.current = val;
    setOpacity(val);
  };

  const fadeTo = (targetOpacity, durationMs, onComplete) => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    const startOpacity = currentOpacityRef.current;
    if (Math.abs(startOpacity - targetOpacity) < 0.001) {
      updateOpacity(targetOpacity);
      if (onComplete) onComplete();
      return;
    }

    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      
      const newOpacity = startOpacity + (targetOpacity - startOpacity) * progress;
      updateOpacity(newOpacity);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        animFrameRef.current = null;
        if (onComplete) onComplete();
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  };

  const handleFadeIn = () => {
    fadingOutRef.current = false;
    fadeTo(1, 250);
  };

  const handleFadeOutAndRestart = () => {
    if (fadingOutRef.current) return;
    fadingOutRef.current = true;

    fadeTo(0, 250, () => {
      setTimeout(() => {
        const video = videoRef.current;
        if (video) {
          video.currentTime = 0;
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.then(() => {
              handleFadeIn();
            }).catch(err => {
              console.log("Video restart error:", err);
              handleFadeIn();
            });
          } else {
            handleFadeIn();
          }
        }
      }, 100);
    });
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration || Number.isNaN(video.duration)) return;

    const remainingTime = video.duration - video.currentTime;
    
    if (remainingTime <= 0.55 && !fadingOutRef.current) {
      handleFadeOutAndRestart();
    }
  };

  const handleEnded = () => {
    if (!fadingOutRef.current) {
      handleFadeOutAndRestart();
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          handleFadeIn();
        }).catch(err => {
          console.log("Autoplay prevented:", err);
          handleFadeIn();
        });
      }
    }

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      zIndex: 0,
      backgroundColor: '#f5f5f5'
    }}>
      <video
        ref={videoRef}
        src={VIDEO_URL}
        muted
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadedData={handleFadeIn}
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '115%',
          height: '115%',
          objectFit: 'cover',
          objectPosition: 'top',
          opacity: opacity,
          transition: 'none',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
};
