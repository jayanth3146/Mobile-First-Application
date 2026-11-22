import { useState } from 'react';
import Modal from './Modal';
import { CATEGORIES, STATUS, STATUS_LABELS, PRIORITY, PRIORITY_LABELS } from '../utils/taskHelpers';
import styles from './TaskForm.module.css';

const EMPTY_FORM = {
  title: '',
  description: '',
  category: CATEGORIES[0],
  status: STATUS.TODO,
  priority: PRIORITY.MEDIUM,
  dueDate: '',
};

function validate(values) {
  const errors = {};
  if (!values.title.trim()) {
    errors.title = 'Title is required.';
  } else if (values.title.trim().length > 120) {
    errors.title = 'Title must be under 120 characters.';
  }
  if (!values.dueDate) errors.dueDate = 'Due date is required.';
  if (!values.status) errors.status = 'Status is required.';
  if (!values.priority) errors.priority = 'Priority is required.';
  return errors;
}

/**
 * Reused for both Create and Edit: when `initialTask` is provided the form
 * is pre-filled and the original id is preserved on submit (App.jsx decides
 * whether to call addTask or editTask with the returned values).
 */
function TaskForm({ isOpen, onClose, onSubmit, initialTask }) {
  // App.jsx gives this component a `key` that changes every time it is
  // opened (for create, or for a specific task to edit), so a fresh mount —
  // and therefore this lazy initializer — is all that's needed to load the
  // right starting values. No effect-based reset required.
  const [form, setForm] = useState(() => (initialTask ? {
    title: initialTask.title,
    description: initialTask.description || '',
    category: initialTask.category || CATEGORIES[0],
    status: initialTask.status,
    priority: initialTask.priority,
    dueDate: initialTask.dueDate,
  } : EMPTY_FORM));
  const [errors, setErrors] = useState({});
  const isEditMode = Boolean(initialTask);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const candidate = { ...form, title: form.title.trim() };
    const nextErrors = validate(candidate);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    onSubmit(candidate);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? 'Edit Task' : 'Create Task'} titleId="task-form-title">
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.field}>
          <label htmlFor="task-title">Title <span aria-hidden="true">*</span></label>
          <input
            id="task-title"
            type="text"
            value={form.title}
            onChange={(event) => handleChange('title', event.target.value)}
            aria-required="true"
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? 'task-title-error' : undefined}
          />
          {errors.title && <p id="task-title-error" className={styles.error} role="alert">{errors.title}</p>}
        </div>

        <div className={styles.field}>
          <label htmlFor="task-description">Description</label>
          <textarea
            id="task-description"
            rows={3}
            value={form.description}
            onChange={(event) => handleChange('description', event.target.value)}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="task-category">Category</label>
            <select id="task-category" value={form.category} onChange={(event) => handleChange('category', event.target.value)}>
              {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </div>
          <div className={styles.field}>
            <label htmlFor="task-status">Status <span aria-hidden="true">*</span></label>
            <select id="task-status" value={form.status} onChange={(event) => handleChange('status', event.target.value)} aria-required="true">
              {Object.entries(STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="task-priority">Priority <span aria-hidden="true">*</span></label>
            <select id="task-priority" value={form.priority} onChange={(event) => handleChange('priority', event.target.value)} aria-required="true">
              {Object.entries(PRIORITY_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>
          <div className={styles.field}>
            <label htmlFor="task-due-date">Due date <span aria-hidden="true">*</span></label>
            <input
              id="task-due-date"
              type="date"
              value={form.dueDate}
              onChange={(event) => handleChange('dueDate', event.target.value)}
              aria-required="true"
              aria-invalid={Boolean(errors.dueDate)}
              aria-describedby={errors.dueDate ? 'task-due-date-error' : undefined}
            />
            {errors.dueDate && <p id="task-due-date-error" className={styles.error} role="alert">{errors.dueDate}</p>}
          </div>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.cancelButton} onClick={onClose}>Cancel</button>
          <button type="submit" className={styles.submitButton}>{isEditMode ? 'Save Changes' : 'Create Task'}</button>
        </div>
      </form>
    </Modal>
  );
}

export default TaskForm;
