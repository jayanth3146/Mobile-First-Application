import Modal from './Modal';
import styles from './ConfirmDialog.module.css';

function ConfirmDialog({ isOpen, task, onConfirm, onCancel }) {
  if (!task) return null;

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="Delete task" titleId="confirm-dialog-title">
      <div className={styles.body}>
        <p className={styles.message}>
          Are you sure you want to delete <strong>&ldquo;{task.title}&rdquo;</strong>? This action cannot be undone.
        </p>
        <div className={styles.actions}>
          <button type="button" className={styles.cancelButton} onClick={onCancel}>Cancel</button>
          <button type="button" className={styles.confirmButton} onClick={() => onConfirm(task.id)}>Delete</button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
