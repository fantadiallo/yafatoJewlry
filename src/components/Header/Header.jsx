import { Link } from 'react-router-dom';
import { FiHeart, FiSearch, FiUser, FiShoppingBag } from 'react-icons/fi';
import styles from './Header.module.scss';

export default function Header() {
  return (
    <header className={styles.header}>
      <nav className="container d-flex justify-content-between align-items-center py-3">
        <Link to="/" className={styles.logo}>Yafato</Link>

        <div className={`d-flex align-items-center gap-4 ${styles.iconBar}`}>
          <button className={styles.iconBtn} aria-label="Favorites">
            <FiHeart size={24} />
          </button>
          <button className={styles.iconBtn} aria-label="Search">
            <FiSearch size={24} />
          </button>
          <button className={styles.iconBtn} aria-label="User">
            <FiUser size={24} />
          </button>
          <button className={styles.iconBtn} aria-label="Cart" style={{ position: 'relative' }}>
            <FiShoppingBag size={24} />
            <span className={styles.badge}>0</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
