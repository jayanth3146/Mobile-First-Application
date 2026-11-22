import styles from './FilterTabs.module.css';

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'todo', label: 'To do' },
  { id: 'in-progress', label: 'In progress' },
  { id: 'completed', label: 'Completed' },
];

function FilterTabs({ value, onChange }) {
  return (
    <div className={styles.group} role="group" aria-label="Filter tasks by status">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`${styles.tab} ${value === tab.id ? styles.active : ''}`}
          aria-pressed={value === tab.id}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default FilterTabs;
