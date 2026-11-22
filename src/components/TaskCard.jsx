import { Pencil, Trash2, CalendarDays } from 'lucide-react';
import { StatusBadge, PriorityBadge } from './Badge';
import { STATUS_LABELS, formatDueDate, isOverdue } from '../utils/taskHelpers';
import styles from './TaskCard.module.css';

function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <article className={styles.card}>
      <div className={styles.main}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{task.title}</h3>
          <span className={styles.category}>{task.category}</span>
        </div>

        {task.description && <p className={styles.description}>{task.description}</p>}

        <div className={styles.metaRow}>
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
          <span className={`${styles.dueDate} ${overdue ? styles.overdue : ''}`}>
            <CalendarDays size={13} aria-hidden="true" />
            {formatDueDate(task.dueDate)}
            {overdue && <span className={styles.overdueTag}>Overdue</span>}
          </span>
        </div>
      </div>

      <div className={styles.actions}>
        <div className={styles.statusControl}>
          <label className={styles.statusLabel} htmlFor={`status-${task.id}`}>Status</label>
          <select
            id={`status-${task.id}`}
            className={styles.statusSelect}
            value={task.status}
            onChange={(event) => onStatusChange(task.id, event.target.value)}
          >
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <div className={styles.iconActions}>
          <button type="button" className={styles.iconButton} onClick={() => onEdit(task)} aria-label={`Edit task: ${task.title}`}>
            <Pencil size={16} />
          </button>
          <button type="button" className={`${styles.iconButton} ${styles.danger}`} onClick={() => onDelete(task)} aria-label={`Delete task: ${task.title}`}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default TaskCard;
