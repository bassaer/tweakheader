/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useReducer } from 'react';
import M from "materialize-css";

type Action = 'Add' | 'Modify' | 'Delete';

let counter = 0;

interface Header {
  id: string;
  name: string;
  value: string;
  enable: boolean;
  action: Action;
}

type State = {
  playing: boolean;
  headers: Header[];
}

type ActionType = {
  type: 'playing' | 'add' | 'name' | 'value' | 'enable' | 'enable' | 'action' | 'delete';
  playing?: boolean;
  header?: Header;
  name?: string;
  value?: string;
  enable?: boolean;
  action?: Action;
}

const initialState: State = {
  playing: false,
  headers: [
    {
      id: String(counter++),
      name: 'user-agent',
      value: 'foo',
      action: 'Modify',
      enable: true
    },
    {
      id: String(counter++),
      name: 'Accept',
      value: 'text/html',
      action: 'Delete',
      enable: true
    },
    {
      id: String(counter++),
      name: '',
      value: '',
      action: 'Add',
      enable: false
    }
  ]
};

const reducer = (state: State, action: ActionType): State => {
  if (action.type === 'playing') {
    return {
      ...state,
      playing: !state.playing
    };
  }
  if (action.type === 'add') {
    const lastHeader = state.headers[state.headers.length - 1];
    if (lastHeader !== undefined && !lastHeader.name && !lastHeader.value) {
      return { ...state }
    }
    return {
      ...state,
      headers: [
        ...state.headers,
        { id: String(counter++), name: '', value: '', enable: false, action: 'Add' }
      ]
    }
  }
  if (!action.header) {
    return { ...state }
  }
  const header: Header = {
    id: action.header.id,
    name: action.name === undefined ? action.header.name : action.name,
    value: action.value === undefined ? action.header.value : action.value,
    enable: action.enable === undefined ? action.header.enable : action.enable,
    action: action.action === undefined ? action.header.action : action.action
  };
  header.enable = header.enable && !!header.name && !!header.value;
  const targetIndex = state.headers.findIndex(header => header.id === action.header?.id)
  switch (action.type) {
    case 'name':
    case 'value':
    case 'enable':
    case 'action':
      return {
        ...state,
        headers: [
          ...state.headers.slice(0, targetIndex),
          header,
          ...state.headers.slice(targetIndex + 1),
        ]
      }
  }
  return { ...state, headers: state.headers.filter((_, index) => index !== targetIndex) }
}

const App: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    const elems = document.querySelectorAll('select');
    M.FormSelect.init(elems, {});
  }, [state]);
  return (
    <div className="App">
      <nav>
        <div className="nav-wrapper teal lighten-1">
          <a href="#" className="brand-logo center">Tweak Header</a>
          <ul className="hide-on-med-and-down">
            <li>
              <a onClick={e => dispatch({ type: 'playing' })}>
                {state.playing ?
                  <i className="material-icons">pause</i>
                  :
                  <i className="material-icons">play_arrow</i>
                }
              </a>
            </li>
            <li><a onClick={e => dispatch({ type: 'add' })}><i className="material-icons">add</i></a></li>
          </ul>
        </div>
      </nav>
      <ul className="collection" style={{ overflow: 'visible' }}>
        <form>
          {state.headers.map(header => (
            < li key={header.id} className="collection-item" style={{ padding: 0 }}>
              <div className="row" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 0 }}>
                <div className="switch col s1">
                  <label>
                    <input className="cyan" type="checkbox" checked={header.enable} onChange={e => dispatch({ type: 'enable', enable: e.target.checked, header })} />
                    <span className="lever"></span>
                  </label>
                </div>
                <div className="input-field col s1">
                  <select className="cyan" defaultValue={header.action} onChange={e => dispatch({ type: 'action', action: e.target.value as Action, header })}>
                    <option value="Add">Add</option>
                    <option value="Modify">Modify</option>
                    <option value="Delete">Delete</option>
                  </select>
                </div>
                <div className="input-field col s4">
                  <input placeholder="Name" defaultValue={header.name} onChange={e => { dispatch({ type: 'name', name: e.target.value, header }) }} />
                </div>
                <div className="input-field col s4">
                  <input placeholder="Value" defaultValue={header.value} onChange={e => { dispatch({ type: 'value', value: e.target.value, header }) }} />
                </div>
                <a href="#!" className="col s1 " onClick={e => { dispatch({ type: 'delete', header }) }}>
                  <i className="material-icons" style={{ color: "#26a69a" }}>
                    delete
                  </i>
                </a>
              </div>
            </li>
          ))}
        </form>
      </ul>
    </div >
  );
}

export default App;
