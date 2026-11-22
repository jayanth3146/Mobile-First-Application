import { Inbox, SearchX, PartyPopper, Plus } from 'lucide-react';
import styles from './EmptyState.module.css';

const ICONS = { inbox: Inbox, search: SearchX, party: PartyPopper };

function EmptyState({ icon = 'inbox', title, message, actionLabel, onAction }) {
  const Icon = ICONS[icon] ?? Inbox;
  return (
    <div className={styles.wrapper} role="status">
      <span className={styles.iconWrap} aria-hidden="true"><Icon size={28} /></span>
      <p className={styles.title}>{title}</p>
      <p className={styles.message}>{message}</p>
      {actionLabel && onAction && (
        <button type="button" className={styles.action} onClick={onAction}>
          <Plus size={16} aria-hidden="true" />
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
