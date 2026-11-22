import TaskCard from './TaskCard';
import EmptyState from './EmptyState';
import { STATUS_LABELS } from '../utils/taskHelpers';
import styles from './TaskList.module.css';

/**
 * Renders the filtered task list, or one of three distinct empty states:
 *  - no tasks exist at all yet
 *  - a status-only filter (To do / In progress) matched nothing, which reads
 *    as a positive "all caught up" message rather than a dead end
 *  - search and/or priority filters matched nothing
 */
function TaskList({ tasks, totalCount, filters, onEdit, onDelete, onStatusChange, onAddTask, onResetFilters }) {
  const { searchTerm, statusFilter, priorityFilter } = filters;
  const hasActiveFilters = searchTerm.trim() !== '' || statusFilter !== 'all' || priorityFilter !== 'all';

  if (totalCount === 0) {
    return (
      <EmptyState
        icon="inbox"
        title="No tasks yet"
        message="Create your first task to start tracking your work."
        actionLabel="Add your first task"
        onAction={onAddTask}
      />
    );
  }

  if (tasks.length === 0 && hasActiveFilters) {
    const isStatusOnlyFilter = (statusFilter === 'todo' || statusFilter === 'in-progress')
      && searchTerm.trim() === ''
      && priorityFilter === 'all';

    if (isStatusOnlyFilter) {
      return (
        <EmptyState
          icon="party"
          title="All caught up"
          message={`You have no ${STATUS_LABELS[statusFilter].toLowerCase()} tasks right now.`}
        />
      );
    }

    return (
      <EmptyState
        icon="search"
        title="No matching tasks"
        message="Try a different search term, or clear your filters."
        actionLabel="Reset filters"
        onAction={onResetFilters}
      />
    );
  }

  return (
    <ul className={styles.list} aria-label="Tasks">
      {tasks.map((task) => (
        <li key={task.id}>
          <TaskCard task={task} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />
        </li>
      ))}
    </ul>
  );
}

export default TaskList;
