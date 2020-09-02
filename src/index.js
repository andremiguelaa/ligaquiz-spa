import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { StateProvider } from 'state/State';
import { initialState, MainReducer } from 'state/MainReducer';

ReactDOM.render(
  <StateProvider initialState={initialState} reducer={MainReducer}>
    <App />
  </StateProvider>,
  document.getElementById('root')
);

serviceWorker.register();
