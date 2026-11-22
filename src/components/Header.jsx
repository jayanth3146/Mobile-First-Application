import { Menu, Plus } from 'lucide-react';
import styles from './Header.module.css';

function Header({ onAddTask, onOpenSidebar, theme, onThemeChange }) {
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
      <div className={styles.themeToggle} role="group" aria-label="Theme">
        <button
          type="button"
          aria-pressed={theme === 'dark'}
          onClick={() => onThemeChange('dark')}
        >
          Dark
        </button>
        <button
          type="button"
          aria-pressed={theme === 'light'}
          onClick={() => onThemeChange('light')}
        >
          Light
        </button>
      </div>
      <button type="button" className={styles.addButton} onClick={onAddTask}>
        <Plus size={18} aria-hidden="true" />
        <span>Add Task</span>
      </button>
    </header>
  );
}

export default Header;
