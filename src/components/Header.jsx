import { Menu, Plus } from 'lucide-react';
import styles from './Header.module.css';

function Header({ onAddTask, onOpenSidebar }) {
  return (
    <header className={styles.header}>
      <button
        type="button"
        className={styles.menuButton}
        onClick={onOpenSidebar}
        aria-label="Open navigation menu"
        aria-controls="primary-navigation"
      >
        <Menu size={22} />
      </button>
      <div className={styles.titleBlock}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Here&rsquo;s what&rsquo;s on your plate today.</p>
      </div>
      <button type="button" className={styles.addButton} onClick={onAddTask}>
        <Plus size={18} aria-hidden="true" />
        <span>Add Task</span>
      </button>
    </header>
  );
}

export default Header;
