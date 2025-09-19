import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiHeart, FiShoppingBag, FiMenu, FiX, FiUser } from "react-icons/fi";
import { FaGlobe, FaEnvelopeOpenText } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import SideCart from "../SideCart/SideCart";
import { useShopifyCart } from "../../context/ShopifyCartContext";
import SearchBar from "../SearchBar/SearchBar";
import AuthModal from "../AuthModal/AuthModal";
import { customerMe, customerLogout } from "../../api/shopify";
import FavoritesCart from "../FavoritsCart/FavoritsCart";
import styles from "./Header.module.scss";

const TOKEN_KEY = "customerToken";
const EXP_KEY = "customerTokenExpires";

export default function Header() {
  // ✅ Use native Shopify cart + keep your favorites as-is (with a safe default)
const { cart, favorites } = useShopifyCart();
const cartCount = cart?.totalQuantity ?? 0;

  const navigate = useNavigate();

  const [cartOpen, setCartOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTopBar, setShowTopBar] = useState(true);
  const [jewelryOpen, setJewelryOpen] = useState(false);
  const dropdownRef = useRef(null);

  // auth state
  const [authOpen, setAuthOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [token, setToken] = useState(null);

  // top bar hide on scroll
  useEffect(() => {
    const onScroll = () => setShowTopBar(window.scrollY <= 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // bootstrap token from localStorage
  useEffect(() => {
    const t = localStorage.getItem(TOKEN_KEY);
    const expires = localStorage.getItem(EXP_KEY);
    if (!t) return;

    if (expires && Date.parse(expires) < Date.now()) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(EXP_KEY);
      return;
    }

    setToken(t);
    customerMe(t)
      .then((c) => {
        if (c) setCustomer(c);
        else {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(EXP_KEY);
          setToken(null);
          setCustomer(null);
        }
      })
      .catch(() => {
        setToken(null);
        setCustomer(null);
      });
  }, []);

  // close dropdown on outside click / Esc
  useEffect(() => {
    if (!jewelryOpen) return;
    function onDocClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setJewelryOpen(false);
      }
    }
    function onKey(e) {
      if (e.key === "Escape") setJewelryOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [jewelryOpen]);

  // handle successful auth from modal
  async function handleAuthSuccess(access) {
    const { accessToken, expiresAt } = access || {};
    if (!accessToken) return;

    localStorage.setItem(TOKEN_KEY, accessToken);
    if (expiresAt) localStorage.setItem(EXP_KEY, expiresAt);

    setToken(accessToken);
    const c = await customerMe(accessToken).catch(() => null);
    setCustomer(c);
  }

  async function handleLogout() {
    try {
      if (token) await customerLogout(token);
    } catch (_) {
      // ignore network/API errors on logout
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(EXP_KEY);
      setToken(null);
      setCustomer(null);
      setAccountOpen(false);
    }
  }

  return (
    <header className={styles.header}>
      {showTopBar && (
        <div className={styles.topBar}>
          <div className={styles.topContent}>
            <span className={styles.marquee} aria-live="polite">
              <FaGlobe /> Free Shipping Worldwide over £100 &nbsp;&nbsp;&nbsp;
              <FaEnvelopeOpenText /> Subscribe to our Newsletter
            </span>
          </div>
          <button className={styles.closeBtn} onClick={() => setShowTopBar(false)} aria-label="Close top bar">
            <FiX />
          </button>
        </div>
      )}

      <div className={styles.inner}>
        <nav className={styles.navLinks}>
          <Link to="/">Home</Link>

          {/* Jewelry dropdown */}
          <div
            className={styles.dropdown}
            ref={dropdownRef}
            onMouseEnter={() => setJewelryOpen(true)}
          >
            <button
              className={styles.dropdownBtn}
              aria-haspopup="true"
              aria-expanded={jewelryOpen}
              onClick={() => setJewelryOpen((v) => !v)}
              type="button"
            >
              Jewelry
            </button>

            {jewelryOpen && (
              <div className={styles.dropdownMenu} role="menu">
                <Link to="/products" onClick={() => setJewelryOpen(false)}>All</Link>
               <Link to="/products?type=rings" onClick={() => setJewelryOpen(false)}>Rings</Link>
                <Link to="/products?type=bracelets" onClick={() => setJewelryOpen(false)}>Bracelets</Link>

                {/* Coming soon */}
                <Link
                  to="/products"
                  className={styles.inactive}
                  aria-disabled="true"
                  title="Coming soon"
                  onClick={() => setJewelryOpen(false)}
                >
                  <span>Necklaces</span>
                  <span className={styles.status}>Coming soon</span>
                </Link>
                <Link
                  to="/products"
                  className={styles.inactive}
                  aria-disabled="true"
                  title="Coming soon"
                  onClick={() => setJewelryOpen(false)}
                >
                  <span>Custom</span>
                  <span className={styles.status}>Coming soon</span>
                </Link>
              </div>
            )}
          </div>

          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        <Link to="/" className={styles.logo} aria-label="YAFATO Home">
          <h1>YAFATO</h1>
        </Link>

        <div className={styles.rightBar}>
          <div className={styles.searchWrapper}>
            <SearchBar />
          </div>

          {/* Account */}
          <div className={styles.accountWrapper}>
            {!customer ? (
              <button
                className={styles.iconBtn}
                onClick={() => setAuthOpen(true)}
                aria-label="Sign in"
                title="Sign in"
              >
                <FiUser size={22} />
              </button>
            ) : (
              <div className={styles.accountAnchor}>
                <button
                  className={styles.iconBtn}
                  onClick={() => setAccountOpen((v) => !v)}
                  aria-haspopup="true"
                  aria-expanded={accountOpen}
                  aria-label="Account"
                  title="Account"
                >
                  <FiUser size={22} />
                </button>

                <AnimatePresence>
                  {accountOpen && (
                    <motion.div
                      className={styles.accountMenu}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                    >
                      <div className={styles.accountHeader}>
                        <strong>{customer.firstName || customer.email}</strong>
                        {customer.firstName && <span>{customer.email}</span>}
                      </div>
                      <Link to="/account" onClick={() => setAccountOpen(false)}>My Account</Link>
                      <Link to="/orders" onClick={() => setAccountOpen(false)}>Orders</Link>
                      <button onClick={handleLogout} className={styles.logoutBtn}>Sign out</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Favorites */}
      {/* Favorites */}
<button onClick={() => setFavoritesOpen(true)} className={styles.iconBtn} aria-label="Open favorites">
  <FiHeart size={22} />
  {!!(favorites?.length ?? 0) && <span className={styles.badge}>{favorites.length}</span>}
</button>

{/* Cart */}
<button onClick={() => setCartOpen(true)} className={styles.iconBtn} aria-label="Open cart">
  <FiShoppingBag size={22} />
  {!!cartCount && <span className={styles.badge}>{cartCount}</span>}
</button>


          {/* Mobile */}
          <button
            className={`${styles.iconBtn} ${styles.mobileMenuBtn}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
          </button>
        </div>
      </div>

      {/* Panels */}
      <SideCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <FavoritesCart isOpen={favoritesOpen} onClose={() => setFavoritesOpen(false)} />

      {/* Auth modal */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className={styles.menuOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.nav
              className={styles.mobileMenu}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className={styles.menuHeader}>
                <img src="/yafato.png" alt="Yafato Logo" />
                <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
                  <FiX />
                </button>
              </div>

              <Link to="/products" onClick={() => setMenuOpen(false)}>All</Link>
<Link to="/products?type=rings" onClick={() => setJewelryOpen(false)}>Rings</Link>
<Link to="/products?type=bracelets" onClick={() => setJewelryOpen(false)}>Bracelets</Link>
 <Link to="/products" className={styles.inactive} onClick={() => setMenuOpen(false)}>
                Necklaces <span className={styles.status}>Coming soon</span>
              </Link>
              <Link to="/products" className={styles.inactive} onClick={() => setMenuOpen(false)}>
                Custom <span className={styles.status}>Coming soon</span>
              </Link>
              <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
              <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
