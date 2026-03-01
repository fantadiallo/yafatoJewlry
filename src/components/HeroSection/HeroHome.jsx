import React from "react";
import { Link } from "react-router-dom";
import styles from "./HeroHome.module.scss";

const heroImage =
 "https://cdn.shopify.com/s/files/1/0952/4261/7177/files/IMG_5379.jpg?v=1771968067"
const heroVideo =
 "https://cdn.shopify.com/videos/c/o/v/fcfb4aff9466426d8dbcd9d47792583c.mov"
export default function HeroHome() {
  return (
    <section className={styles.heroBanner}>
      <div className={styles.split}>
        {/* LEFT — IMAGE */}
        <div className={styles.left}>
          <img
            src={heroImage}
            alt="Yafato sterling silver"
            className={styles.media}
          />

          <div className={styles.leftOverlay} />

          <div className={styles.textBlock}>
            <span className={styles.kicker}>YAFATO</span>
            <h1>Made by hand. Worn as you are.</h1>
            <p>
              Handcrafted sterling silver rooted in African symbolism, shaped by
              Scandinavian calm.
            </p>

            <Link to="/products" className={styles.heroBtn}>
              Shop now
            </Link>
          </div>
        </div>

        {/* RIGHT — VIDEO */}
        <div className={styles.right}>
          <video
            className={styles.media}
            src={heroVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />

          <div className={styles.rightOverlay}>
            <span className={styles.rightTag}>New drop</span>
            <h2 className={styles.rightTitle}>
              Everyday pieces, made to last.
            </h2>
            <p className={styles.rightText}>
              Sterling silver essentials with meaning.
            </p>

            <Link to="/products" className={styles.heroBtnMobile}>
              Shop now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}