export const STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
};

export const STATUS_LABELS = {
  [STATUS.TODO]: 'To do',
  [STATUS.IN_PROGRESS]: 'In progress',
  [STATUS.COMPLETED]: 'Completed',
};

export const PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

export const PRIORITY_LABELS = {
  [PRIORITY.LOW]: 'Low',
  [PRIORITY.MEDIUM]: 'Medium',
  [PRIORITY.HIGH]: 'High',
};

export const CATEGORIES = ['Development', 'Design', 'Research', 'Marketing', 'Personal'];

/**
 * Generates a unique id for a new task. Falls back to a timestamp + random
 * string when crypto.randomUUID isn't available (older browsers, some test
 * environments).
 */
export function generateId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Derives dashboard statistics from the full task list. Never reads from
 * state that has already been filtered, and is safe to call on an empty list.
 */
export function calculateStats(tasks) {
  const total = tasks.length;
  const todo = tasks.filter((task) => task.status === STATUS.TODO).length;
  const inProgress = tasks.filter((task) => task.status === STATUS.IN_PROGRESS).length;
  const completed = tasks.filter((task) => task.status === STATUS.COMPLETED).length;
  const completionPercentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { total, todo, inProgress, completed, completionPercentage };
}

/**
 * Applies search + status + priority filters together, always against the
 * original task list (never against an already-filtered subset).
 */
export function filterTasks(tasks, { searchTerm = '', statusFilter = 'all', priorityFilter = 'all' } = {}) {
  const term = searchTerm.trim().toLowerCase();
  return tasks.filter((task) => {
    const matchesSearch = term === '' || task.title.toLowerCase().includes(term);
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });
}

export function formatDueDate(dateStr) {
  if (!dateStr) return 'No due date';
  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function isOverdue(dateStr, status) {
  if (!dateStr || status === STATUS.COMPLETED) return false;
  const due = new Date(`${dateStr}T23:59:59`);
  return due.getTime() < Date.now();
}
