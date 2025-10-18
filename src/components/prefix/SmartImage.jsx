import { useState } from "react";

export default function SmartImage({ src, alt, w, h, className = "" }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div style={{ aspectRatio: `${w}/${h}` }} className={`img-wrap ${className}`}>
      {!loaded && <div className="ske" />}
      <img
        src={src}
        alt={alt}
        width={w}
        height={h}
        loading="lazy"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
