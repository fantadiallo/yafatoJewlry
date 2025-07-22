import styles from './AboutPage.module.scss';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <div className={styles.aboutPage}>

      {/* Hero Slideshow with Overlay */}
  <section className={styles.heroSection}>
  <div className={styles.heroImages}>
    <img
      src="/images/africa-light.jpg"
      alt="West African Craft"
      className={styles.bgImage}
    />
    <img
      src="/images/norway-light.jpg"
      alt="Norwegian Identity"
      className={styles.bgImageOverlay}
    />

    <div className={styles.overlayText}>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        A Light That Never Leaves
      </motion.h1>
      <p>Jewelry born from legacy and identity</p>
    </div>
  </div>
</section>


      {/* Quote */}
      <motion.section className={styles.quoteSection}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}>
        <blockquote>“Don’t leave the house without it.”</blockquote>
        <p>– My mother</p>
      </motion.section>

      {/* Meet the Maker (Image left, text right) */}
      <motion.section className={styles.makerSection}>
        <div className={styles.split}>
          <div className={styles.imageWrap}>
            <img src="/images/amz-placeholder.jpg" alt="Amz Silver at work" />
          </div>
          <div className={styles.textWrap}>
            <h2>Meet Amz Silver</h2>
            <p>
              A generational craftsman rooted in West African kingdoms. Amz continues
              his family’s ancestral tradition in The Gambia and Senegal — each piece is
              handmade with heritage.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Cultural Significance (3 columns) */}
      <motion.section className={styles.meaningSection}>
        <h2>What Silver Means</h2>
        <div className={styles.features}>
          <div className={styles.feature}>
            <h3>Protection</h3>
            <p>Silver shields the body and spirit from unseen forces — a tradition passed down generations.</p>
          </div>
          <div className={styles.feature}>
            <h3>Identity</h3>
            <p>Styled to express individuality, silver is a symbol of cultural pride and personal essence.</p>
          </div>
          <div className={styles.feature}>
            <h3>Energy</h3>
            <p>In our culture, silver reflects energy — even reacting to the changes in your health or aura.</p>
          </div>
        </div>
      </motion.section>

      {/* Video (separated) */}
      <motion.section className={styles.videoSection}>
    <h2>Watch the Story</h2>
<div className={styles.videoWrapper}>
  <video className={styles.videoPlayer} controls playsInline>
    <source src="/Yafatoo.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
</div>
      </motion.section>

      {/* Gallery Grid */}
      <motion.section className={styles.gallerySection}>
        <h2>Silver In Action</h2>
        <div className={styles.galleryGrid}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={styles.galleryItem}>
              <img src={`/images/gallery-placeholder${i}.jpg`} alt={`Gallery ${i}`} />
            </div>
          ))}
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section className={styles.ctaSection}>
        <h2>Find Your Piece</h2>
        <Link to="/jewelry" className={styles.shopBtn}>Shop the Collection</Link>
        <p className={styles.instaFollow}>
          Follow us on <a href="https://instagram.com/yafato" target="_blank" rel="noreferrer">@yafato</a>
        </p>
      </motion.section>

    </div>
  );
}
