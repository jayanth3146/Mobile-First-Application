import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

beforeEach(() => {
  window.localStorage.clear();
});

describe('FocusBoard App', () => {
  it('switches between dark and light themes and persists the selection', async () => {
    const user = userEvent.setup();
    render(<App />);

    const header = screen.getByRole('banner');
    const darkButton = within(header).getByRole('button', { name: 'Dark' });
    const lightButton = within(header).getByRole('button', { name: 'Light' });

    expect(darkButton).toHaveAttribute('aria-pressed', 'true');
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');

    await user.click(lightButton);
    expect(lightButton).toHaveAttribute('aria-pressed', 'true');
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    expect(window.localStorage.getItem('focusboard_theme')).toBe('"light"');

    await user.click(darkButton);
    expect(darkButton).toHaveAttribute('aria-pressed', 'true');
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(window.localStorage.getItem('focusboard_theme')).toBe('"dark"');
  });

  it('renders at least six sample tasks on first load', () => {
    render(<App />);
    const list = screen.getByRole('list', { name: /tasks/i });
    expect(within(list).getAllByRole('listitem').length).toBeGreaterThanOrEqual(6);
  });

  it('filters the task list by search term, case-insensitively', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByLabelText(/search tasks by title/i), 'ONBOARDING');
    const list = screen.getByRole('list', { name: /tasks/i });
    const items = within(list).getAllByRole('listitem');
    expect(items).toHaveLength(1);
    expect(items[0].textContent.toLowerCase()).toContain('onboarding');
  });

  it('shows a no-matching-tasks empty state and clears it on reset', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByLabelText(/search tasks by title/i), 'zzz-no-such-task');
    expect(screen.getByText(/no matching tasks/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /reset filters/i }));
    expect(screen.queryByText(/no matching tasks/i)).not.toBeInTheDocument();
  });

  it('rejects an empty title when creating a task and does not add it', async () => {
    const user = userEvent.setup();
    render(<App />);
    const totalBefore = Number(screen.getByTestId('stat-total').textContent);

    await user.click(screen.getByRole('button', { name: /^add task$/i }));
    await user.click(screen.getByRole('button', { name: /^create task$/i }));

    expect(await screen.findByText(/title is required/i)).toBeInTheDocument();
    expect(Number(screen.getByTestId('stat-total').textContent)).toBe(totalBefore);
  });

  it('rejects a whitespace-only title', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /^add task$/i }));
    await user.type(screen.getByLabelText(/^title/i), '   ');
    await user.click(screen.getByRole('button', { name: /^create task$/i }));
    expect(await screen.findByText(/title is required/i)).toBeInTheDocument();
  });

  it('creates a valid task, closes the form, and updates the total immediately', async () => {
    const user = userEvent.setup();
    render(<App />);
    const totalBefore = Number(screen.getByTestId('stat-total').textContent);

    await user.click(screen.getByRole('button', { name: /^add task$/i }));
    await user.type(screen.getByLabelText(/^title/i), '  Write interview notes  ');
    await user.type(screen.getByLabelText(/due date/i), '2026-12-15');
    await user.click(screen.getByRole('button', { name: /^create task$/i }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByText('Write interview notes')).toBeInTheDocument();
    expect(Number(screen.getByTestId('stat-total').textContent)).toBe(totalBefore + 1);
  });

  it('cancelling the form discards changes', async () => {
    const user = userEvent.setup();
    render(<App />);
    const totalBefore = Number(screen.getByTestId('stat-total').textContent);
    await user.click(screen.getByRole('button', { name: /^add task$/i }));
    await user.type(screen.getByLabelText(/^title/i), 'Should not be saved');
    await user.click(screen.getByRole('button', { name: /^cancel$/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByText('Should not be saved')).not.toBeInTheDocument();
    expect(Number(screen.getByTestId('stat-total').textContent)).toBe(totalBefore);
  });

  it('edits an existing task in place, preserving its identity', async () => {
    const user = userEvent.setup();
    render(<App />);
    const list = screen.getByRole('list', { name: /tasks/i });
    const totalBefore = Number(screen.getByTestId('stat-total').textContent);
    const card = within(list).getByText('Set up CI pipeline for frontend repo').closest('li');

    await user.click(within(card).getByRole('button', { name: /edit task/i }));
    const titleInput = screen.getByLabelText(/^title/i);
    await user.clear(titleInput);
    await user.type(titleInput, 'Set up CI/CD pipeline');
    await user.click(screen.getByRole('button', { name: /save changes/i }));

    expect(screen.getByText('Set up CI/CD pipeline')).toBeInTheDocument();
    expect(screen.queryByText('Set up CI pipeline for frontend repo')).not.toBeInTheDocument();
    // Editing must not change the total task count.
    expect(Number(screen.getByTestId('stat-total').textContent)).toBe(totalBefore);

    // Explicit ID-preservation check: the same task-2 id should now carry
    // the new title, rather than the edit having deleted-and-recreated it.
    const stored = JSON.parse(window.localStorage.getItem('focusboard_tasks'));
    const updated = stored.find((task) => task.id === 'task-2');
    expect(updated).toBeDefined();
    expect(updated.title).toBe('Set up CI/CD pipeline');
  });

  it('requires confirmation before deleting, and Cancel preserves the task', async () => {
    const user = userEvent.setup();
    render(<App />);
    const list = screen.getByRole('list', { name: /tasks/i });
    const card = within(list).getByText('Research competitor pricing models').closest('li');

    await user.click(within(card).getByRole('button', { name: /delete task/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /^cancel$/i }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByText('Research competitor pricing models')).toBeInTheDocument();
  });

  it('deletes a task after confirmation and updates stats', async () => {
    const user = userEvent.setup();
    render(<App />);
    const totalBefore = Number(screen.getByTestId('stat-total').textContent);
    const list = screen.getByRole('list', { name: /tasks/i });
    const card = within(list).getByText('Research competitor pricing models').closest('li');

    await user.click(within(card).getByRole('button', { name: /delete task/i }));
    await user.click(screen.getByRole('button', { name: /^delete$/i }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByText('Research competitor pricing models')).not.toBeInTheDocument();
    expect(Number(screen.getByTestId('stat-total').textContent)).toBe(totalBefore - 1);
  });

  it('updates stats immediately when a task status changes, without changing the total', async () => {
    const user = userEvent.setup();
    render(<App />);
    const completedBefore = Number(screen.getByTestId('stat-completed').textContent);
    const totalBefore = Number(screen.getByTestId('stat-total').textContent);

    const list = screen.getByRole('list', { name: /tasks/i });
    const card = within(list).getByText('Set up CI pipeline for frontend repo').closest('li');
    await user.selectOptions(within(card).getByLabelText(/^status$/i), 'completed');

    expect(Number(screen.getByTestId('stat-completed').textContent)).toBe(completedBefore + 1);
    expect(Number(screen.getByTestId('stat-total').textContent)).toBe(totalBefore);
  });

  it('persists task changes to localStorage and restores them on remount (simulated refresh)', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);
    const list = screen.getByRole('list', { name: /tasks/i });
    const card = within(list).getByText('Renew domain and SSL certificates').closest('li');
    await user.click(within(card).getByRole('button', { name: /delete task/i }));
    await user.click(screen.getByRole('button', { name: /^delete$/i }));
    unmount();

    render(<App />);
    expect(screen.queryByText('Renew domain and SSL certificates')).not.toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem('focusboard_tasks'))).not.toBeNull();
  });

  it('falls back to sample data when localStorage holds invalid JSON, instead of crashing', () => {
    window.localStorage.setItem('focusboard_tasks', 'not-valid-json{{{');
    render(<App />);
    const list = screen.getByRole('list', { name: /tasks/i });
    expect(within(list).getAllByRole('listitem').length).toBeGreaterThanOrEqual(6);
  });

  it('does not reseed sample data when a valid, empty task list was already saved', () => {
    window.localStorage.setItem('focusboard_tasks', JSON.stringify([]));
    render(<App />);
    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
    expect(screen.queryByText('Design the onboarding flow wireframes')).not.toBeInTheDocument();
  });

  it('combines a status filter and a priority filter together', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'In progress' }));
    await user.selectOptions(screen.getByLabelText(/^priority$/i), 'high');

    const list = screen.getByRole('list', { name: /tasks/i });
    const items = within(list).getAllByRole('listitem');
    expect(items.length).toBeGreaterThan(0);
    items.forEach((item) => {
      // selector: 'span' avoids matching the identical text inside the
      // task's hidden <option value="in-progress"> status-select option.
      expect(within(item).getByText('In progress', { selector: 'span' })).toBeInTheDocument();
      expect(within(item).getByText('High priority', { selector: 'span' })).toBeInTheDocument();
    });
  });
});
