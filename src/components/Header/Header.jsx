import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // ✅ useNavigate for redirect
import { FiHeart, FiShoppingBag, FiSearch, FiMenu, FiX } from "react-icons/fi";
import { FaGlobe, FaEnvelopeOpenText } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { ShopifyCartContext } from "../../context/ShopifyCartContext";
import SideCart from "../SideCart/SideCart";
import FavoritesCart from "../FavoritsCart/FavoritsCart";
import styles from "./Header.module.scss";
import { fetchShopifyProducts } from "../../api/shopify";

export default function Header() {
  const { cartItems, favorites, addToCart, removeFromFavorites } = useContext(ShopifyCartContext);
  const navigate = useNavigate();

  const [cartOpen, setCartOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [jewelryOpen, setJewelryOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTopBar, setShowTopBar] = useState(true);

  // ✅ Search products by first letter
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      const products = await fetchShopifyProducts();
      // ✅ Filter by first letter (case-insensitive)
      const results = products.filter((p) =>
        p.title.toLowerCase().startsWith(searchTerm.toLowerCase()[0])
      );

      if (results.length > 0) {
        // Navigate to a search results page (optional)
        navigate("/products", { state: { searchResults: results } });
      } else {
        alert("No products found.");
      }
    } catch (err) {
      console.error("Search error:", err);
    }

    setSearchOpen(false);
    setSearchTerm("");
  };

  // Hide top bar on scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowTopBar(window.scrollY <= 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={styles.header}>
      {/* Top Info Bar */}
      {showTopBar && (
        <div className={styles.topBar}>
          <div className={styles.topContent}>
            <span className={styles.marquee}>
              <FaGlobe /> Free Shipping Worldwide over £100 &nbsp;&nbsp;&nbsp;
              <FaEnvelopeOpenText /> Subscribe to our Newsletter
            </span>
          </div>
          <button className={styles.closeBtn} onClick={() => setShowTopBar(false)}>
            <FiX />
          </button>
        </div>
      )}

      {/* Main Sticky Header */}
      <div className={styles.inner}>
        {/* Left Navigation (Desktop) */}
        <nav className={styles.navLinks}>
          <Link to="/">Home</Link>
          <div
            className={styles.dropdown}
            onMouseEnter={() => setJewelryOpen(true)}
            onMouseLeave={() => setJewelryOpen(false)}
          >
            <button className={styles.dropdownBtn}>Jewelry</button>
            {jewelryOpen && (
              <div className={styles.dropdownMenu}>
                <Link to="/products">All</Link>
                <Link to="/products/rings">Rings</Link>
                <Link to="/products/necklaces">Necklaces</Link>
                <Link to="/custom">Custom</Link>
                <Link to="/products/bracelets">Bracelets</Link>
              </div>
            )}
          </div>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        {/* Center Logo */}
        <Link to="/" className={styles.logo}>
          <h1>YAFATO</h1>
        </Link>

        {/* Right Icons */}
        <div className={styles.rightBar}>
          {/* Search */}
          <div className={styles.searchWrapper}>
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
                <input
                  type="text"
                  placeholder="Search by first letter..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
              </form>
            ) : (
              <button onClick={() => setSearchOpen(true)} className={styles.iconBtn}>
                <FiSearch size={22} />
              </button>
            )}
          </div>

          {/* Favorites */}
          <button onClick={() => setFavoritesOpen(true)} className={styles.iconBtn}>
            <FiHeart size={22} />
            {favorites.length > 0 && (
              <span className={styles.badge}>{favorites.length}</span>
            )}
          </button>

          {/* Cart */}
          <button onClick={() => setCartOpen(true)} className={styles.iconBtn}>
            <FiShoppingBag size={22} />
            {cartItems.length > 0 && (
              <span className={styles.badge}>{cartItems.length}</span>
            )}
          </button>

          {/* Mobile Hamburger */}
          <button
            className={styles.iconBtn + " " + styles.mobileMenuBtn}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
          </button>
        </div>
      </div>

      {/* Side Overlays */}
      <SideCart isOpen={cartOpen} onClose={() => setCartOpen(false)} cartItems={cartItems} />
      <FavoritesCart
        isOpen={favoritesOpen}
        onClose={() => setFavoritesOpen(false)}
        favorites={favorites}
        onAddToCart={addToCart}
        onRemoveFavorite={removeFromFavorites}
      />

      {/* Mobile Side Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Dimmed overlay */}
            <motion.div
              className={styles.menuOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />

            {/* Slide-in mobile menu */}
            <motion.nav
              className={styles.mobileMenu}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className={styles.menuHeader}>
                <img src="/yafato.png" alt="Yafato Logo" />
                <button onClick={() => setMenuOpen(false)}>
                  <FiX />
                </button>
              </div>

              <Link to="/" onClick={() => setMenuOpen(false)}>ALL</Link>
              <Link to="/products/rings" onClick={() => setMenuOpen(false)}>Rings</Link>
              <Link to="/products/necklaces" onClick={() => setMenuOpen(false)}>Necklaces</Link>
              <Link to="/custom" onClick={() => setMenuOpen(false)}>Custom</Link>
              <Link to="/products/bracelets" onClick={() => setMenuOpen(false)}>Bracelets</Link>
              <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
              <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
