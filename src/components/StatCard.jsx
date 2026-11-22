import styles from './StatCard.module.css';

function StatCard({ label, value, icon: Icon, tone = 'default', testId }) {
  return (
    <div className={`${styles.card} ${styles[tone]}`}>
      <span className={styles.iconWrap} aria-hidden="true"><Icon size={20} /></span>
      <div>
        <p className={styles.value} data-testid={testId ? `stat-${testId}` : undefined}>{value}</p>
        <p className={styles.label}>{label}</p>
      </div>
    </div>
  );
}

export default StatCard;
