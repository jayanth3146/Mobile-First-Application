import { ListChecks, Clock, CheckCircle2, TrendingUp } from 'lucide-react';
import StatCard from './StatCard';
import styles from './StatsOverview.module.css';

function StatsOverview({ stats }) {
  return (
    <section className={styles.grid} aria-label="Task statistics">
      <StatCard label="Total tasks" value={stats.total} icon={ListChecks} tone="default" testId="total" />
      <StatCard label="In progress" value={stats.inProgress} icon={Clock} tone="info" testId="in-progress" />
      <StatCard label="Completed" value={stats.completed} icon={CheckCircle2} tone="success" testId="completed" />
      <StatCard label="Completion rate" value={`${stats.completionPercentage}%`} icon={TrendingUp} tone="primary" testId="completion" />
    </section>
  );
}

export default StatsOverview;
