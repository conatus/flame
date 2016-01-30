import Log from 'loglevel';
import React from 'react';
import ReactDOM from 'react-dom';

import {App, Container} from 'flame';

import Home from './components/pages/home.jsx';
import TodoStore from './stores/todo-store';


Log.setLevel(Log.levels.TRACE);
const app = new App('app', [TodoStore]);

ReactDOM.render(
  <Container app={app}>
    <Home />
  </Container>,
  document.getElementById('root')
);
