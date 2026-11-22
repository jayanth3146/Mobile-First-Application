import { useState } from 'react';
import { ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react';
import styles from './FocusNotes.module.css';

/**
 * Three-slide "Focus Notes" carousel. Navigation is circular (next from the
 * last slide wraps to the first, and vice versa) and the active slide is
 * tracked with plain useState — it is intentionally kept independent from
 * the task/filter state managed higher up.
 */
function FocusNotes({ notes }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const goTo = (index) => setActiveIndex((index + notes.length) % notes.length);
  const activeNote = notes[activeIndex];

  return (
    <section className={styles.wrapper} aria-roledescription="carousel" aria-label="Focus notes">
      <div className={styles.header}>
        <span className={styles.iconBadge} aria-hidden="true"><Lightbulb size={16} /></span>
        <h2 className={styles.heading}>Focus Notes</h2>
      </div>

      <div className={styles.slideRow}>
        <button type="button" className={styles.navButton} onClick={() => goTo(activeIndex - 1)} aria-label="Previous focus note">
          <ChevronLeft size={18} />
        </button>

        <div className={styles.slide} aria-live="polite">
          <p className={styles.slideTitle}>{activeNote.title}</p>
          <p className={styles.slideBody}>{activeNote.body}</p>
        </div>

        <button type="button" className={styles.navButton} onClick={() => goTo(activeIndex + 1)} aria-label="Next focus note">
          <ChevronRight size={18} />
        </button>
      </div>

      <div className={styles.indicators} role="group" aria-label="Choose a focus note">
        {notes.map((note, index) => (
          <button
            key={note.id}
            type="button"
            aria-current={index === activeIndex}
            aria-label={`Focus note ${index + 1}: ${note.title}`}
            className={`${styles.dot} ${index === activeIndex ? styles.dotActive : ''}`}
            onClick={() => goTo(index)}
          />
        ))}
      </div>
    </section>
  );
}

export default FocusNotes;
