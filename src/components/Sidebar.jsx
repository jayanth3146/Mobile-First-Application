import { LayoutDashboard, CheckSquare, Calendar, BarChart3, Settings, X, Target } from 'lucide-react';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, implemented: true },
  { id: 'tasks', label: 'My Tasks', icon: CheckSquare, implemented: false },
  { id: 'calendar', label: 'Calendar', icon: Calendar, implemented: false },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, implemented: false },
  { id: 'settings', label: 'Settings', icon: Settings, implemented: false },
];

/**
 * Only "Dashboard" is a real, working screen in this assignment's scope.
 * The other items are shown (per the Figma layout) but explicitly marked
 * with a "Soon" badge, aria-disabled and a title tooltip — they intentionally
 * do not pretend to be functional pages.
 */
function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />}
      <nav id="primary-navigation" className={`${styles.sidebar} ${isOpen ? styles.open : ''}`} aria-label="Primary">
        <div className={styles.brand}>
          <span className={styles.brandIcon} aria-hidden="true"><Target size={20} /></span>
          <span className={styles.brandName}>FocusBoard</span>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close navigation menu">
            <X size={20} />
          </button>
        </div>
        <ul className={styles.navList}>
          {NAV_ITEMS.map(({ id, label, icon: Icon, implemented }) => (
            <li key={id}>
              <button
                type="button"
                className={`${styles.navItem} ${id === 'dashboard' ? styles.active : ''}`}
                aria-current={id === 'dashboard' ? 'page' : undefined}
                aria-disabled={!implemented}
                title={implemented ? undefined : `${label} — coming soon`}
              >
                <Icon size={18} aria-hidden="true" />
                <span>{label}</span>
                {!implemented && <span className={styles.soonBadge}>Soon</span>}
              </button>
            </li>
          ))}
        </ul>
        <p className={styles.footerNote}>Single-user demo &middot; v1.0</p>
      </nav>
    </>
  );
}

export default Sidebar;
