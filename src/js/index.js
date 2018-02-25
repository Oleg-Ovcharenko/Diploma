/* global window */
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { render } from 'react-dom';
import App from './containers/App';
import reducer from './reducers';
import initStore from './store';

const reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
const store = createStore(reducer, initStore, reduxDevTools);

render(
    <Provider store={store}>
        <App dispatch={store.dispatch} />
    </Provider>,
    document.getElementById('root')
);
