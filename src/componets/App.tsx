/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useReducer } from 'react';
import M from "materialize-css";

type Action = 'Add' | 'Modify' | 'Delete';

interface Header {
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
    type: 'name' | 'value' | 'enable' | 'enable' | 'delete';
    index: number
    name?: string;
    value?: string;
    enable?: boolean;
    action?: Action;
}

const initialState: State = {
    headers: [
        {
            name: 'user-agent',
            value: 'foo',
            action: 'Modify',
            enable: true
        },
        {
            name: 'Accept',
            value: 'text/html',
            action: 'Delete',
            enable: true
        },
        {
            name: '',
            value: '',
            action: 'Add',
            enable: false
        }
    ]
};

const reducer = (state: State, action: ActionType) => {
    switch (action.type) {
        case 'name':
            state.headers[action.index].name = action.name || '';
            break;
        case 'value':
            state.headers[action.index].value = action.value || '';
            break;
        case 'enable':
            state.headers[action.index].enable = action.enable === undefined ? false : action.enable;
            break;
        case 'delete':
            state.headers.splice(action.index, 1);
            break;
    }
    return { headers: state.headers };
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
                        < li key={index.toString()} className="collection-item" style={{ padding: 0 }}>
                            <div className="row" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 0 }}>
                                <div className="switch col s1">
                                    <label>
                                        <input type="checkbox" checked={header.enable} onChange={e => dispatch({ type: 'enable', enable: e.target.checked, index })} />
                                        <span className="lever"></span>
                                    </label>
                                </div>
                                <div className="input-field col s1">
                                    <select>
                                        <option value="" disabled>Operation</option>
                                        <option value="Add">Add</option>
                                        <option value="Modify">Modify</option>
                                        <option value="Delete">Delete</option>
                                    </select>
                                </div>
                                <div className="input-field col s4">
                                    <input placeholder="Name" defaultValue={header.name} onChange={e => { dispatch({ type: 'name', name: e.target.value, index }) }} />
                                </div>
                                <div className="input-field col s4">
                                    <input placeholder="Value" defaultValue={header.value} onChange={e => { dispatch({ type: 'value', value: e.target.value, index }) }} />
                                </div>
                                <a href="#!" className="col s1" onClick={e => { dispatch({ type: 'delete', index }) }}>
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
