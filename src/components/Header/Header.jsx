import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiShoppingBag, FiMenu, FiUser, FiSearch } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import SideCart from "../SideCart/SideCart";
import FavoritesCart from "../FavoritsCart/FavoritsCart";
import AuthModal from "../AuthModal/AuthModal";
import { useShopifyCart } from "../../context/ShopifyCartContext";
import { customerMe, customerLogout } from "../../api/shopify";
import HeaderTopBar from "./HeaderTopBar";
import SearchPanel from "./SearchPanel";
import MobileMenu from "./MobileMenu";
import Logo from "./Logo";
import styles from "./Header.module.scss";

const TOKEN_KEY = "customerToken";
const EXP_KEY = "customerTokenExpires";

export default function Header() {
  const { cart, favorites } = useShopifyCart();
  const cartCount = cart?.totalQuantity ?? 0;

  const [cartOpen, setCartOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const [shopOpen, setShopOpen] = useState(false);
  const shopRef = useRef(null);

  const [authOpen, setAuthOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [token, setToken] = useState(null);

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

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
        setAccountOpen(false);
        setShopOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    function onDocClick(e) {
      if (shopRef.current && !shopRef.current.contains(e.target)) {
        setShopOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    if (!searchOpen && !menuOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [searchOpen, menuOpen]);

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
      <HeaderTopBar />

      <div className={styles.inner}>
        <div className={styles.leftSlot}>
          <Logo />
        </div>

        <nav className={styles.navLinks} aria-label="Main navigation">
          <div
            className={styles.shopWrap}
            ref={shopRef}
            onMouseEnter={() => setShopOpen(true)}
            onMouseLeave={() => setShopOpen(false)}
          >
            <Link
              to="/products"
              className={styles.shopLink}
              aria-haspopup="true"
              aria-expanded={shopOpen}
              onFocus={() => setShopOpen(true)}
            >
              Shop
            </Link>

            <AnimatePresence>
              {shopOpen && (
                <motion.div
                  className={styles.shopMenu}
                  role="menu"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.18 }}
                >
                  <div className={styles.shopGrid}>
                    <div className={styles.shopCol}>
                      <span className={styles.shopTitle}>Shop</span>
                      <Link to="/products?sort=new" onClick={() => setShopOpen(false)}>
                        New in
                      </Link>
                      <Link to="/products?type=rings" onClick={() => setShopOpen(false)}>
                        Rings
                      </Link>
                      <Link to="/products?type=necklaces" onClick={() => setShopOpen(false)}>
                        Necklaces
                      </Link>
                      <Link to="/products?type=bracelets" onClick={() => setShopOpen(false)}>
                        Bracelets
                      </Link>
                    </div>

                    <div className={styles.shopCol}>
                      <span className={styles.shopTitle}>For him</span>
                      <Link to="/products?tag=for-him" onClick={() => setShopOpen(false)}>
                        Shop men’s
                      </Link>
                    </div>

                    <div className={styles.shopCol}>
                      <span className={styles.shopTitle}>Gold</span>
                      <Link to="/products?material=gold" onClick={() => setShopOpen(false)}>
                        All gold
                      </Link>
                    </div>

                    <div className={styles.shopCol}>
                      <span className={styles.shopTitle}>Silver</span>
                      <Link to="/products?material=silver" onClick={() => setShopOpen(false)}>
                        All silver
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        <div className={styles.rightSlot}>
          <div className={styles.rightBar}>
            <button
              className={styles.iconBtn}
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
              type="button"
            >
              <FiSearch size={22} />
            </button>

            {!customer ? (
              <button
                className={styles.iconBtn}
                onClick={() => setAuthOpen(true)}
                aria-label="Sign in"
                type="button"
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
                  type="button"
                >
                  <FiUser size={22} />
                </button>

                <AnimatePresence>
                  {accountOpen && (
                    <motion.div
                      className={styles.accountMenu}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                    >
                      <div className={styles.accountHeader}>
                        <strong>{customer.firstName || customer.email}</strong>
                        {customer.firstName && <span>{customer.email}</span>}
                      </div>

                      <Link to="/account" onClick={() => setAccountOpen(false)}>
                        My Account
                      </Link>
                      <Link to="/orders" onClick={() => setAccountOpen(false)}>
                        Orders
                      </Link>

                      <button onClick={handleLogout} className={styles.logoutBtn} type="button">
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <button
              onClick={() => setFavoritesOpen(true)}
              className={styles.iconBtn}
              aria-label="Open favorites"
              type="button"
            >
              <FiHeart size={22} />
              {!!(favorites?.length ?? 0) && <span className={styles.badge}>{favorites.length}</span>}
            </button>

            <button
              onClick={() => setCartOpen(true)}
              className={styles.iconBtn}
              aria-label="Open cart"
              type="button"
            >
              <FiShoppingBag size={22} />
              {!!cartCount && <span className={styles.badge}>{cartCount}</span>}
            </button>

            <button
              className={`${styles.iconBtn} ${styles.mobileMenuBtn}`}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              type="button"
            >
              {menuOpen ? <FiMenu size={26} /> : <FiMenu size={26} />}
            </button>
          </div>
        </div>
      </div>

      <SideCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <FavoritesCart isOpen={favoritesOpen} onClose={() => setFavoritesOpen(false)} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} onSuccess={handleAuthSuccess} />

      <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
