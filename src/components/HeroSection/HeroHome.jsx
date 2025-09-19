import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./HeroHome.scss";

export default function HeroHome() {
  const videoRef = useRef(null);
  const MOV_URL = "https://cdn.shopify.com/videos/c/o/v/896e9e67b0eb472e8a9c7e7fa38e3900.mov?v=force-mov-1";

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.src = MOV_URL;
    v.muted = true;
    v.defaultMuted = true;
    v.volume = 0;
    v.playbackRate = 0.5;
    v.setAttribute("muted", "");
    v.play?.().catch(() => {});
  }, []);

  return (
    <section className="hero-home">
      <video
        ref={videoRef}
        className="hero-video"
        autoPlay
        loop
        muted
        playsInline
        preload="none"
        poster="https://cdn.shopify.com/videos/c/o/v/3a9635282e544649b927150a4134fb00-poster.jpg"
        onLoadedData={(e) => console.log("Video src:", e.currentTarget.currentSrc)}
        onError={(e) => console.error("Video error", e)}
      />
      <div className="hero-content">
        <Link to="/products" className="hero-btn">Shop now</Link>
      </div>
    </section>
  );
}
