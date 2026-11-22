import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { sampleTasks } from '../data/sampleTasks';
import { generateId, STATUS } from '../utils/taskHelpers';

const STORAGE_KEY = 'focusboard_tasks';

/**
 * Centralises task state and every mutation (create/edit/delete/status
 * change) behind one hook, backed by localStorage. This is the single
 * source of truth consumed by App.jsx; every derived view (stats, filtered
 * list) is computed from the `tasks` this hook returns, never duplicated.
 */
export function useTasks() {
  const [tasks, setTasks] = useLocalStorage(STORAGE_KEY, sampleTasks);

  const addTask = useCallback((values) => {
    const newTask = {
      id: generateId(),
      title: values.title.trim(),
      description: (values.description ?? '').trim(),
      category: values.category || 'Development',
      status: values.status || STATUS.TODO,
      priority: values.priority,
      dueDate: values.dueDate,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  }, [setTasks]);

  const editTask = useCallback((id, values) => {
    setTasks((prev) => prev.map((task) => (
      task.id === id
        ? {
          ...task,
          ...values,
          id: task.id,
          title: values.title !== undefined ? values.title.trim() : task.title,
          description: values.description !== undefined ? values.description.trim() : task.description,
        }
        : task
    )));
  }, [setTasks]);

  const removeTask = useCallback((id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, [setTasks]);

  const changeStatus = useCallback((id, status) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, status } : task)));
  }, [setTasks]);

  return { tasks, addTask, editTask, removeTask, changeStatus };
}
