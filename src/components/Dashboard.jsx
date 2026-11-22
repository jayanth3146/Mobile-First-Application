import StatsOverview from './StatsOverview';
import FocusNotes from './FocusNotes';
import Toolbar from './Toolbar';
import TaskList from './TaskList';
import { focusNotes } from '../data/focusNotesData';
import styles from './Dashboard.module.css';

function Dashboard({
  stats, tasks, totalCount, filters,
  onSearchChange, onStatusFilterChange, onPriorityFilterChange, onResetFilters,
  onEdit, onDelete, onStatusChange, onAddTask,
}) {
  const hasActiveFilters = filters.searchTerm.trim() !== '' || filters.statusFilter !== 'all' || filters.priorityFilter !== 'all';

  return (
    <main className={styles.main} id="main-content">
      <StatsOverview stats={stats} />
      <FocusNotes notes={focusNotes} />

      <section className={styles.taskSection} aria-label="Tasks">
        <Toolbar
          searchTerm={filters.searchTerm}
          onSearchChange={onSearchChange}
          statusFilter={filters.statusFilter}
          onStatusFilterChange={onStatusFilterChange}
          priorityFilter={filters.priorityFilter}
          onPriorityFilterChange={onPriorityFilterChange}
          onReset={onResetFilters}
          hasActiveFilters={hasActiveFilters}
        />
        <TaskList
          tasks={tasks}
          totalCount={totalCount}
          filters={filters}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          onAddTask={onAddTask}
          onResetFilters={onResetFilters}
        />
      </section>
    </main>
  );
}

export default Dashboard;
