import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiX } from 'react-icons/fi';
import styles from './Header.module.scss';
import SideCart from '../SideCart/SideCart';
import FavoritesCart from '../FavoritsCart/FavoritsCart';
import { ShopifyCartContext } from '../../context/ShopifyCartContext';

export default function Header() {
  const { cartItems, favorites, addToCart, addToFavorites, removeFromFavorites } = useContext(ShopifyCartContext);

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => {
    setMenuOpen(false);
    setMobileDropdownOpen(false);
  };
  const toggleDropdown = () => setDropdownOpen(prev => !prev);
  const closeDropdown = () => setDropdownOpen(false);
  const toggleMobileDropdown = () => setMobileDropdownOpen(prev => !prev);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setHideHeader(currentScrollY > lastScrollY && currentScrollY > 100);
      setLastScrollY(currentScrollY);
      if (dropdownOpen) closeDropdown();
      if (menuOpen) setMenuOpen(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, dropdownOpen, menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [menuOpen]);

  return (
    <header className={`${styles.header} ${hideHeader ? styles.hideOnScroll : ''}`}>
      <div className={styles.topBar}>
        <p>🌍 Free Shipping Worldwide over 50 £ &nbsp; | &nbsp; Subscribe to our newsletter</p>
      </div>

      <nav className={`${styles.navContainer} container`}>
        <Link to="/" className={styles.logo}>Yafato</Link>

        <ul className={styles.navLinks}>
          <li><Link to="/">Home</Link></li>
          <li className={styles.dropdown}>
            <button
              className={styles.dropdownToggle}
              onClick={toggleDropdown}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              Our Products ▾
            </button>
            {dropdownOpen && (
              <div className={styles.megaMenu}>
                <div className={styles.megaColumn}>
                  <p>Jewelry</p>
                  <Link to="/products" onClick={closeDropdown}>All Jewelry</Link>
                  <Link to="/custom" onClick={closeDropdown}>Custom Jewelry</Link>
                </div>
                <div className={styles.megaColumn}>
                  <p>Clothing</p>
                  <Link to="/products/clothing/two-piece" onClick={closeDropdown}>Two-piece Sets</Link>
                </div>
                <div className={styles.megaColumn}>
                  <p>Lifestyle</p>
                  <Link to="/products/lifestyle/cups" onClick={closeDropdown}>Cups</Link>
                </div>
              </div>
            )}
          </li>
          <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        </ul>

        <div className={styles.iconBar}>
<div className={styles.iconWrapper}>
  <button className={styles.iconBtn} onClick={() => setFavoritesOpen(true)}>
    <FiHeart
      size={20}
      style={{ color: favorites.length > 0 ? 'red' : 'inherit' }}
    />
    {favorites.length > 0 && (
      <span className={styles.badge}>{favorites.length}</span>
    )}
  </button>
</div>
          <button className={styles.iconBtn} onClick={() => setCartOpen(true)}>
            <FiShoppingBag size={20} />
            <span className={styles.badge}>{cartItems.length}</span>
          </button>
          <button
            className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
            onClick={toggleMenu}
          >
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
          </button>
        </div>
      </nav>

      <div className={styles.desktopTagline}>
        <p>No proving. No pretending. Just enough — YAFATO.</p>
        <h2>YAFATO</h2>
      </div>
      <SideCart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
      />

      <FavoritesCart
        isOpen={favoritesOpen}
        onClose={() => setFavoritesOpen(false)}
        favorites={favorites}
        onAddToCart={addToCart}
        onRemoveFavorite={removeFromFavorites}
      />

      {menuOpen && (
        <div className={styles.sideMenu}>
          <button className={styles.closeBtn} onClick={closeMenu}>
            <FiX />
          </button>

          <Link to="/" className={styles.mobileLogo} onClick={closeMenu}>
            Yafato
          </Link>

          <div className={styles.menuIntro}>
            <p>Silver that reminds you of who you're becoming.</p>
          </div>

          <div className={styles.mobileLinks}>
            <Link to="/" onClick={closeMenu}>Home</Link>

            <button
              className={styles.mobileSubToggle}
              onClick={toggleMobileDropdown}
              aria-expanded={mobileDropdownOpen}
            >
              Our Products ▾
            </button>

            {mobileDropdownOpen && (
              <div className={styles.mobileDropdown}>
                <p>Jewelry</p>
                <Link to="/products" onClick={closeMenu}>All Jewelry</Link>
                <Link to="/custom" onClick={closeMenu}>Custom Jewelry</Link>

                <p>Clothing</p>
                <Link to="/products/clothing/two-piece" onClick={closeMenu}>Two-piece Sets</Link>

                <p>Lifestyle</p>
                <Link to="/products/lifestyle/cups" onClick={closeMenu}>YCups</Link>
              </div>
            )}

            <hr />

            <Link to="/about" onClick={closeMenu}>About</Link>
        <Link to="/contact" onClick={closeMenu}>Contact</Link>
          </div>
        </div>
      )}
    </header>
  );
}
