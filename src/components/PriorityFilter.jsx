import styles from './PriorityFilter.module.css';

function PriorityFilter({ value, onChange }) {
  return (
    <div className={styles.wrapper}>
      <label htmlFor="priority-filter" className={styles.label}>Priority</label>
      <select
        id="priority-filter"
        className={styles.select}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="all">All priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>
  );
}

export default PriorityFilter;
