import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App, { reducer } from './App';
import type { State } from '../models/state';

beforeEach(() => {
  vi.stubGlobal('chrome', {
    storage: {
      local: {
        get: vi.fn().mockResolvedValue({}),
        set: vi.fn().mockResolvedValue(undefined)
      }
    }
  });
});

describe('App', () => {
  it('shows the paused state after loading', async () => {
    render(<App />);
    expect(await screen.findByText(/modification is/i)).toHaveTextContent('paused');
    expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument();
  });

  it('enables a valid header', () => {
    const state: State = {
      running: false,
      headers: [{ id: '1', name: 'X-Test', value: 'yes', enable: false, action: 'Set' }]
    };
    const result = reducer(state, { type: 'enable', header: state.headers[0], enable: true });
    expect(result.headers[0].enable).toBe(true);
  });

  it('migrates legacy actions to Set and Remove', () => {
    const legacy = {
      running: true,
      headers: [
        { id: '1', name: 'X-Set', value: 'yes', enable: true, action: 'Modify' },
        { id: '2', name: 'X-Remove', value: '', enable: true, action: 'Delete' }
      ]
    } as unknown as State;
    const result = reducer({ running: false, headers: [] }, { type: 'init', state: legacy });
    expect(result.headers.map(({ action }) => action)).toEqual(['Set', 'Remove']);
  });
});
