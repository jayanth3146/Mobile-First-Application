import { useCallback, useMemo, useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TaskForm from './components/TaskForm';
import ConfirmDialog from './components/ConfirmDialog';
import { useTasks } from './hooks/useTasks';
import { calculateStats, filterTasks } from './utils/taskHelpers';
import styles from './App.module.css';

/**
 * App owns all state and wiring; everything below it is presentational and
 * receives data + callbacks as props. See README.md for why plain hooks
 * (rather than Context or a state library) were enough for this tree.
 */
function App() {
  const { tasks, addTask, editTask, removeTask, changeStatus } = useTasks();

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);

  const stats = useMemo(() => calculateStats(tasks), [tasks]);
  const filteredTasks = useMemo(
    () => filterTasks(tasks, { searchTerm, statusFilter, priorityFilter }),
    [tasks, searchTerm, statusFilter, priorityFilter],
  );

  const openCreateForm = useCallback(() => {
    setEditingTask(null);
    setFormOpen(true);
  }, []);

  const openEditForm = useCallback((task) => {
    setEditingTask(task);
    setFormOpen(true);
  }, []);

  const closeForm = useCallback(() => {
    setFormOpen(false);
    setEditingTask(null);
  }, []);

  const handleFormSubmit = useCallback((values) => {
    if (editingTask) {
      editTask(editingTask.id, values);
    } else {
      addTask(values);
    }
    setFormOpen(false);
    setEditingTask(null);
  }, [editingTask, editTask, addTask]);

  const requestDelete = useCallback((task) => setConfirmTarget(task), []);
  const cancelDelete = useCallback(() => setConfirmTarget(null), []);
  const confirmDelete = useCallback((id) => {
    removeTask(id);
    setConfirmTarget(null);
  }, [removeTask]);

  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setStatusFilter('all');
    setPriorityFilter('all');
  }, []);

  return (
    <div className={styles.shell}>
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className={styles.content}>
        <Header onAddTask={openCreateForm} onOpenSidebar={() => setSidebarOpen(true)} />
        <Dashboard
          stats={stats}
          tasks={filteredTasks}
          totalCount={tasks.length}
          filters={{ searchTerm, statusFilter, priorityFilter }}
          onSearchChange={setSearchTerm}
          onStatusFilterChange={setStatusFilter}
          onPriorityFilterChange={setPriorityFilter}
          onResetFilters={resetFilters}
          onEdit={openEditForm}
          onDelete={requestDelete}
          onStatusChange={changeStatus}
          onAddTask={openCreateForm}
        />
      </div>

      <TaskForm
        key={!isFormOpen ? 'form-closed' : editingTask ? `form-edit-${editingTask.id}` : 'form-create'}
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={handleFormSubmit}
        initialTask={editingTask}
      />
      <ConfirmDialog isOpen={Boolean(confirmTarget)} task={confirmTarget} onConfirm={confirmDelete} onCancel={cancelDelete} />
    </div>
  );
}

export default App;
