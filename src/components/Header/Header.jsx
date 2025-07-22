import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiMenu, FiX } from 'react-icons/fi';
import styles from './Header.module.scss';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (window.innerWidth <= 768) {
        if (currentScrollY > lastScrollY && currentScrollY > 50) {
          setHideHeader(true);
        } else {
          setHideHeader(false);
        }
        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header className={`${styles.header} ${hideHeader ? styles.hideOnScroll : ''}`}>
      <nav className={`${styles.navContainer} container`}>
        <Link to="/" className={styles.logo}>Yafato</Link>

        <ul className={styles.navLinks}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/products">Jewelry</Link></li>
          <li><Link to="/about">About us</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/custom">create it </Link></li>
        </ul>

        <div className={styles.iconBar}>
          <Link to="/favorites" className={styles.iconBtn} aria-label="Favorites">
            <FiHeart size={22} />
          </Link>
          <Link to="/cart" className={styles.iconBtn} aria-label="Cart">
            <FiShoppingBag size={22} />
            <span className={styles.badge}>0</span>
          </Link>
          <button className={styles.menuToggle} onClick={toggleMenu}>
            <FiMenu size={22} />
          </button>
        </div>
      </nav>

      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuActive : ''}`}>
        <button className={styles.closeBtn} onClick={closeMenu}>
          <FiX />
        </button>

        <div className={styles.menuIntro}>
          <h2>YAFATO</h2>
          <p>A light that never leaves</p>
        </div>

        <Link to="/" onClick={closeMenu}>Home</Link>
        <Link to="/products" onClick={closeMenu}>Jewelry</Link>
        <Link to="/about" onClick={closeMenu}>About us</Link>
        <Link to="/contact" onClick={closeMenu}>Contact</Link>
        <Link to="/favorites" onClick={closeMenu}>Favorites</Link>
        <Link to="/cart" onClick={closeMenu}>Cart</Link>
      </div>
    </header>
  );
}
