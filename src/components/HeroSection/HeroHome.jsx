import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom"; // ✅ use react-router-dom
import "./HeroHome.scss";


export default function HeroHome() {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5; 
    }
  }, []);

  return (
    <section className="hero-home">
      {/* Background video */}
      <video
        ref={videoRef}
        className="hero-video"
        autoPlay
        loop
        muted
        playsInline
        preload="none"
        poster="https://cdn.shopify.com/videos/c/o/v/3a9635282e544649b927150a4134fb00-poster.jpg" // optional poster
      >
        <source
          src="https://cdn.shopify.com/videos/c/o/v/3a9635282e544649b927150a4134fb00.mp4"
          type="video/mp4"
        />
        <source
          src="https://cdn.shopify.com/videos/c/o/v/896e9e67b0eb472e8a9c7e7fa38e3900.mov"
          type="video/quicktime"
        />
        Your browser does not support the video tag.
      </video>

      {/* Content */}
      <div className="hero-content">
     <Link to="/products" className="hero-btn">Shop now</Link>
      </div>
    </section>
  );
}
