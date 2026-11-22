import { Circle, Clock, CheckCircle2, ArrowDown, Minus, ArrowUp } from 'lucide-react';
import styles from './Badge.module.css';

const STATUS_META = {
  todo: { label: 'To do', icon: Circle, className: 'statusTodo' },
  'in-progress': { label: 'In progress', icon: Clock, className: 'statusInProgress' },
  completed: { label: 'Completed', icon: CheckCircle2, className: 'statusCompleted' },
};

const PRIORITY_META = {
  low: { label: 'Low priority', icon: ArrowDown, className: 'priorityLow' },
  medium: { label: 'Medium priority', icon: Minus, className: 'priorityMedium' },
  high: { label: 'High priority', icon: ArrowUp, className: 'priorityHigh' },
};

// Status/priority are always conveyed with both an icon and a text label, so
// nothing on the dashboard relies on colour alone to communicate meaning.
export function StatusBadge({ status }) {
  const meta = STATUS_META[status] ?? STATUS_META.todo;
  const Icon = meta.icon;
  return (
    <span className={`${styles.badge} ${styles[meta.className]}`}>
      <Icon size={13} aria-hidden="true" />
      {meta.label}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const meta = PRIORITY_META[priority] ?? PRIORITY_META.medium;
  const Icon = meta.icon;
  return (
    <span className={`${styles.badge} ${styles[meta.className]}`}>
      <Icon size={13} aria-hidden="true" />
      {meta.label}
    </span>
  );
}
