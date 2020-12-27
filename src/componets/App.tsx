/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useReducer } from 'react';
import M from "materialize-css";

type Action = 'Add' | 'Modify' | 'Delete';

interface Header {
  id: string;
  name: string;
  value: string;
  enable: boolean;
  action: Action;
  //[name: string]: string;
}

type State = {
  headers: Header[]
}

type ActionType = {
  type: 'name' | 'value' | 'enable' | 'enable' | 'action' | 'delete';
  header: Header;
  name?: string;
  value?: string;
  enable?: boolean;
  action?: Action;
}

const initialState: State = {
  headers: [
    {
      id: '1',
      name: 'user-agent',
      value: 'foo',
      action: 'Modify',
      enable: true
    },
    {
      id: '2',
      name: 'Accept',
      value: 'text/html',
      action: 'Delete',
      enable: true
    },
    {
      id: '3',
      name: '',
      value: '',
      action: 'Add',
      enable: false
    }
  ]
};

const reducer = (state: State, action: ActionType): State => {
  const header: Header = {
    id: action.header.id,
    name: action.name === undefined ? action.header.name : action.name,
    value: action.value === undefined ? action.header.value : action.value,
    enable: action.enable === undefined ? action.header.enable : action.enable,
    action: action.action === undefined ? action.header.action : action.action
  };
  const targetIndex = state.headers.findIndex(header => header.id === action.header.id)
  switch (action.type) {
    case 'name':
    case 'value':
    case 'enable':
    case 'action':
      return {
        headers: [
          ...state.headers.slice(0, targetIndex),
          header,
          ...state.headers.slice(targetIndex + 1),
        ]
      }
  }
  return { headers: state.headers.filter((_, index) => index !== targetIndex) }
}

const App: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    const elems = document.querySelectorAll('select');
    M.FormSelect.init(elems, {});
  }, []);
  return (
    <div className="App">
      <ul className="collection with-header">
        <li className="collection-header">
          <h4 style={{ display: 'inline-block', marginRight: '10%' }}>Tweak Header</h4>
          <a
            className="btn-floating btn-large waves-effect waves-light cyan"
            style={{ marginLeft: '10px', marginRight: '10px' }}
          >
            <i className="material-icons">play_arrow</i>
          </a>
          <a
            className="btn-floating btn-large waves-effect waves-light cyan"
            style={{ marginLeft: '10px', marginRight: '10px' }}
          >
            <i className="material-icons">add</i>
          </a>
          <a className="btn-floating btn-large waves-effect waves-light cyan">
            <i className="material-icons">replay</i>
          </a>
        </li>
        <form>
          {state.headers.map((header, index) => (
            < li key={header.id} className="collection-item" style={{ padding: 0 }}>
              <div className="row" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 0 }}>
                <div className="switch col s1">
                  <label>
                    <input type="checkbox" checked={header.enable} onChange={e => dispatch({ type: 'enable', enable: e.target.checked, header })} />
                    <span className="lever"></span>
                  </label>
                </div>
                <div className="input-field col s1">
                  <select defaultValue={header.action} onChange={e => dispatch({ type: 'action', action: e.target.value as Action, header })}>
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
                <a href="#!" className="col s1" onClick={e => { dispatch({ type: 'delete', header }) }}>
                  <i className="material-icons">
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
