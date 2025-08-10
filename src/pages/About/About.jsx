import styles from './AboutPage.module.scss';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <div className={styles.aboutPage}>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroImages}>
          <img
            src="/imagetest1.jpg"
            alt="Yafato Visual"
            className={styles.bgImage}
          />
          <div className={styles.sliderWrapper}>
            <div className={styles.slide}>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                Yafato Means You’re Already Enough
              </motion.h1>
              <p>Yafato is a reminder. A reflection. A quiet power.</p>
              <p>Our pieces — whether it’s silver, clothing, or lifestyle — are created for this generation: one that heals, learns, loves, and leads. We express softness. We move with meaning.</p>
            </div>

            <div className={styles.slide}>
              <motion.blockquote
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className={styles.quoteSlide}
              >
                <p>
                  “Yafato started with silver — but it quickly became about people. 
                  The ones breaking through patterns. The ones who show up even when it’s hard.
                  We make pieces that reflect energy, healing, softness, rebellion, and deep self-worth.
                  Luxury, to us, means truth. And love. And choosing your own story.”
                </p>
              </motion.blockquote>
            </div>
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

      {/* Meet the Maker */}
      <motion.section className={styles.makerSection}>
        <div className={styles.split}>
          <div className={styles.imageWrap}>
            <img src="/images/amz-placeholder.jpg" alt="Amz Silver at work" />
          </div>
          <div className={styles.textWrap}>
            <h2>Meet Amz Silver</h2>
            <p>
              The first time I met Amz, I remember thinking — this guy has too much talent to go unseen.
              His hands moved like he’d done this forever, and in a way, he had. He started learning at age five,
              guided by generations before him. What I saw wasn’t just skill — it was legacy, precision, and a kind of quiet genius shaped by his environment.
            </p>
            <p>
              Amz isn’t just a craftsman — he’s an artist born from the roots of The Gambia and Senegal. Every piece he makes is handcrafted with depth and dignity, 
              passed down from a bloodline that’s been creating long before trends. He’s one of the kindest, smartest people I know — and the world deserves to feel what he creates.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Cultural Meaning */}
      <motion.section className={styles.meaningSection}>
        <h2>Yafato Is More Than Products</h2>
        <div className={styles.features}>
          <div className={styles.feature}>
            <h3>You Are Already Enough</h3>
            <p>Our generation isn’t here to follow trends. We’re here to feel, to love, to evolve. Every piece is a reminder of your worth — whether you're healing, leading, or just breathing through it all.</p>
          </div>

          <div className={styles.feature}>
            <h3>Fashion That Reflects Energy</h3>
            <p>We don’t just design. We channel. Our clothes, jewelry, and items speak with intention — each one holding space for your growth, your softness, your fire. This is wearable mindset work.</p>
          </div>

          <div className={styles.feature}>
            <h3>This Is A Movement</h3>
            <p>Yafato is for the ones doing inner work. For the dreamers, the lovers, the ones building new worlds with heart. We create beauty that speaks back — because style should feel like truth.</p>
          </div>
        </div>
      </motion.section>

      {/* Video Section */}
      <motion.section className={styles.videoSection}>
        <h2>Watch the Story</h2>
        <div className={styles.videoWrapper}>
          <video className={styles.videoPlayer} controls playsInline>
            <source src="/Yafatoo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section className={styles.ctaSection}>
        <h2>Find What Speaks To You</h2>
        <Link to="/products" className={styles.shopBtn}>Explore the Collection</Link>
        <p className={styles.instaFollow}>
          Follow our energy on <a href="https://instagram.com/yafato" target="_blank" rel="noreferrer">@yafato</a>
        </p>
      </motion.section>

    </div>
  );
}
