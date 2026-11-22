import { describe, it, expect } from 'vitest';
import { calculateStats, filterTasks, generateId, STATUS, PRIORITY } from './taskHelpers';

describe('calculateStats', () => {
  it('returns zeros and 0% for an empty task list (no division-by-zero)', () => {
    expect(calculateStats([])).toEqual({ total: 0, todo: 0, inProgress: 0, completed: 0, completionPercentage: 0 });
  });

  it('calculates counts and completion percentage from task data', () => {
    const tasks = [
      { status: STATUS.TODO },
      { status: STATUS.IN_PROGRESS },
      { status: STATUS.COMPLETED },
      { status: STATUS.COMPLETED },
    ];
    const stats = calculateStats(tasks);
    expect(stats.total).toBe(4);
    expect(stats.inProgress).toBe(1);
    expect(stats.completed).toBe(2);
    expect(stats.completionPercentage).toBe(50);
  });
});

describe('filterTasks', () => {
  const tasks = [
    { id: '1', title: 'Write report', status: STATUS.TODO, priority: PRIORITY.HIGH },
    { id: '2', title: 'Review code', status: STATUS.IN_PROGRESS, priority: PRIORITY.MEDIUM },
    { id: '3', title: 'Deploy release', status: STATUS.COMPLETED, priority: PRIORITY.LOW },
  ];

  it('matches titles case-insensitively and partially', () => {
    const result = filterTasks(tasks, { searchTerm: 'REPORT' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('combines search, status and priority filters together', () => {
    const result = filterTasks(tasks, { searchTerm: 'e', statusFilter: STATUS.IN_PROGRESS, priorityFilter: PRIORITY.MEDIUM });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('returns every task when filters are at their defaults', () => {
    expect(filterTasks(tasks)).toHaveLength(3);
  });

  it('returns no tasks when nothing matches', () => {
    expect(filterTasks(tasks, { searchTerm: 'nonexistent' })).toHaveLength(0);
  });
});

describe('generateId', () => {
  it('produces unique values across many calls', () => {
    const ids = new Set(Array.from({ length: 200 }, () => generateId()));
    expect(ids.size).toBe(200);
  });
});
