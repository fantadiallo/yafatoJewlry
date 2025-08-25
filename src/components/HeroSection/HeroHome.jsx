import React from 'react';
import './HeroHome.scss';

export default function HeroHome() {
  return (
<section className="hero-home">
  {/* Background video */}
  <video
    className="hero-video"
    src="./IMG_2470.mov"
    autoPlay
    loop
    muted
    playsInline
  />

  {/* Foreground overlay image (jewelry) */}
  <img className="hero-overlay" src="./fato2.jpg" alt="Luxury detail" />

  {/* Content */}
  <div className="hero-content">
    <h1>Welcome to Your Escape</h1>
    <p>Experience timeless luxury, warm sands, and unforgettable moments.</p>
    <button className="hero-btn">Begin Your Journey</button>
  </div>
</section>

  );
}