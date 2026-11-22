import { RotateCcw } from 'lucide-react';
import SearchBar from './SearchBar';
import FilterTabs from './FilterTabs';
import PriorityFilter from './PriorityFilter';
import styles from './Toolbar.module.css';

function Toolbar({
  searchTerm, onSearchChange,
  statusFilter, onStatusFilterChange,
  priorityFilter, onPriorityFilterChange,
  onReset, hasActiveFilters,
}) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.row}>
        <SearchBar value={searchTerm} onChange={onSearchChange} />
        <PriorityFilter value={priorityFilter} onChange={onPriorityFilterChange} />
        {hasActiveFilters && (
          <button type="button" className={styles.resetButton} onClick={onReset}>
            <RotateCcw size={14} aria-hidden="true" />
            <span>Reset</span>
          </button>
        )}
      </div>
      <FilterTabs value={statusFilter} onChange={onStatusFilterChange} />
    </div>
  );
}

export default Toolbar;
