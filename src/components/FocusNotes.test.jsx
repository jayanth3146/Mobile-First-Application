import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FocusNotes from './FocusNotes';

const notes = [
  { id: 'a', title: 'First', body: 'First body' },
  { id: 'b', title: 'Second', body: 'Second body' },
  { id: 'c', title: 'Third', body: 'Third body' },
];

describe('FocusNotes carousel', () => {
  it('shows the first slide initially', () => {
    render(<FocusNotes notes={notes} />);
    expect(screen.getByText('First')).toBeInTheDocument();
  });

  it('advances with Next and wraps back to the first slide', async () => {
    const user = userEvent.setup();
    render(<FocusNotes notes={notes} />);
    const next = screen.getByRole('button', { name: /next focus note/i });
    await user.click(next);
    expect(screen.getByText('Second')).toBeInTheDocument();
    await user.click(next);
    expect(screen.getByText('Third')).toBeInTheDocument();
    await user.click(next);
    expect(screen.getByText('First')).toBeInTheDocument();
  });

  it('goes backward with Previous and wraps from the first to the last slide', async () => {
    const user = userEvent.setup();
    render(<FocusNotes notes={notes} />);
    await user.click(screen.getByRole('button', { name: /previous focus note/i }));
    expect(screen.getByText('Third')).toBeInTheDocument();
  });

  it('jumps directly to a slide via its indicator and marks it active', async () => {
    const user = userEvent.setup();
    render(<FocusNotes notes={notes} />);
    const thirdIndicator = screen.getByRole('button', { name: /focus note 3/i });
    await user.click(thirdIndicator);
    expect(screen.getByText('Third')).toBeInTheDocument();
    expect(thirdIndicator).toHaveAttribute('aria-current', 'true');
  });
});
