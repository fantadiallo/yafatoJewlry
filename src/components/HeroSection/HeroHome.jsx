import React, { useEffect, useRef } from 'react';
import './HeroHome.scss';

export default function HeroHome() {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5; // 👈 play at half speed
    }
  }, []);

  return (
    <section className="hero-home">
      {/* Background video */}
      <video
        ref={videoRef}
        className="hero-video"
        src="./IMG_2470.mov"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Content */}
      <div className="hero-content">
        <button className="hero-btn">Shop now</button>
      </div>
    </section>
  );
}
