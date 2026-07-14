import { useEffect, useReducer, useState } from 'react';
import type { Action, ActionType, Header, State } from '../models/state';
import headerFields from '../models/fields';

const blankHeader = (): Header => ({
  id: crypto.randomUUID(),
  name: '',
  value: '',
  action: 'Set',
  enable: false
});

const initialState: State = { running: false, headers: [blankHeader()] };

const persist = (state: State) => {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    void chrome.storage.local.set({ state });
  }
};

export const reducer = (state: State, action: ActionType): State => {
  if (action.type === 'init' && action.state) {
    const migrated: State = {
      ...action.state,
      headers: action.state.headers.map((header) => ({
        ...header,
        action: (header.action as string) === 'Delete' || header.action === 'Remove' ? 'Remove' : 'Set'
      }))
    };
    persist(migrated);
    return migrated;
  }

  if (action.type === 'running') {
    const result = { ...state, running: action.running ?? !state.running };
    persist(result);
    return result;
  }

  if (action.type === 'add') {
    const last = state.headers.at(-1);
    if (last && !last.name && !last.value) return state;
    return { ...state, headers: [...state.headers, blankHeader()] };
  }

  if (!action.header) return state;
  const target = action.header;
  let headers: Header[];

  if (action.type === 'delete') {
    headers = state.headers.filter(({ id }) => id !== target.id);
    if (headers.length === 0) headers = [blankHeader()];
  } else {
    const updated: Header = {
      ...target,
      name: action.name ?? target.name,
      value: action.value ?? target.value,
      enable: action.enable ?? target.enable,
      action: action.action ?? target.action
    };
    updated.enable = updated.enable && Boolean(updated.name.trim()) &&
      (updated.action === 'Remove' || Boolean(updated.value));
    headers = state.headers.map((header) => header.id === updated.id ? updated : header);
  }

  const result = { ...state, headers };
  persist(result);
  return result;
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof chrome === 'undefined' || !chrome.storage) {
      setLoaded(true);
      return;
    }
    void chrome.storage.local.get('state').then(({ state: saved }) => {
      if (saved) dispatch({ type: 'init', state: saved as State });
      setLoaded(true);
    });
  }, []);

  if (!loaded) return <main className="loading" aria-live="polite">Loading…</main>;

  return (
    <>
      <header>
        <h1>Tweak Header</h1>
        <div className="toolbar">
          <button
            className={state.running ? 'stop' : 'start'}
            onClick={() => dispatch({ type: 'running' })}
            aria-label={state.running ? 'Pause header modifications' : 'Start header modifications'}
          >
            {state.running ? 'Pause' : 'Start'}
          </button>
          <button onClick={() => dispatch({ type: 'add' })}>+ Add header</button>
        </div>
      </header>
      <main>
        <p className="status" role="status">
          Header modification is <strong>{state.running ? 'active' : 'paused'}</strong>.
        </p>
        <datalist id="header-names">
          {headerFields.map((name) => <option value={name} key={name} />)}
        </datalist>
        <div className="header-list">
          {state.headers.map((header) => (
            <section className="header-row" key={header.id}>
              <label className="enabled">
                <input
                  type="checkbox"
                  checked={header.enable}
                  onChange={(event) => dispatch({ type: 'enable', enable: event.target.checked, header })}
                />
                Enabled
              </label>
              <label>
                Action
                <select
                  value={header.action}
                  onChange={(event) => dispatch({ type: 'action', action: event.target.value as Action, header })}
                >
                  <option value="Set">Set</option>
                  <option value="Remove">Remove</option>
                </select>
              </label>
              <label>
                Header name
                <input
                  list="header-names"
                  placeholder="X-Example"
                  value={header.name}
                  onChange={(event) => dispatch({ type: 'name', name: event.target.value, header })}
                />
              </label>
              <label>
                Value
                <input
                  placeholder="value"
                  value={header.value}
                  disabled={header.action === 'Remove'}
                  onChange={(event) => dispatch({ type: 'value', value: event.target.value, header })}
                />
              </label>
              <button className="delete" onClick={() => dispatch({ type: 'delete', header })} aria-label={`Delete ${header.name || 'empty'} header`}>
                Delete
              </button>
            </section>
          ))}
        </div>
      </main>
    </>
  );
};

export default App;
