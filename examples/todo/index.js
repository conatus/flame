import Immutable from 'immutable';
import Log from 'loglevel';
import querystring from 'querystring';
import React from 'react';
import ReactDOM from 'react-dom';

import {App, Provider} from 'flame';

import Home from './components/pages/home.jsx';
import TodoStore from './stores/todo-store';


Log.setLevel(Log.levels.TRACE);
const app = new App('app', [TodoStore]);

const webSocket = new WebSocket('ws://localhost:10001/');
const useWebsockets = querystring.parse(location.search.replace('?', '')).ws;
const isSlave = querystring.parse(location.search.replace('?', '')).slave;

if (useWebsockets) {
  if (isSlave) {
    Log.debug('WS: App is listening...');
    webSocket.onmessage = (event) => {
      Log.debug('WS: Receiving state changes...');
      const diffs = JSON.parse(event.data);
      app.applyImmutableDiffs(Immutable.fromJS(diffs));
    };
  } else {
    Log.debug('WS: App is master...');
    app.subscribe((diffs) => {
      Log.debug('WS: Sending state changes...');
      const data = JSON.stringify(diffs);
      webSocket.send(data);
    });
  }
}

ReactDOM.render(
  <Provider app={app}>
    <Home />
  </Provider>,
  document.getElementById('root')
);
