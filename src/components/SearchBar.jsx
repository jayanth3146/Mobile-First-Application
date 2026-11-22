import { Search, X } from 'lucide-react';
import styles from './SearchBar.module.css';

function SearchBar({ value, onChange }) {
  return (
    <div className={styles.wrapper}>
      <Search size={16} className={styles.icon} aria-hidden="true" />
      <input
        type="text"
        className={styles.input}
        placeholder="Search tasks by title…"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Search tasks by title"
      />
      {value && (
        <button type="button" className={styles.clearButton} onClick={() => onChange('')} aria-label="Clear search">
          <X size={16} />
        </button>
      )}
    </div>
  );
}

export default SearchBar;
