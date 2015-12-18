import React from 'react';
import ReactDOM from 'react-dom';

import App from './myapp';
import Container from './container.jsx';
import Home from './components/pages/home.jsx';
import TodoStore from './stores/todo-store';


const app = new App(TodoStore);
const slut = new App(TodoStore);

window.app = app;

ReactDOM.render(
  <Container app={app}>
    <Home />
  </Container>,
  document.getElementById('root')
);

ReactDOM.render(
  <Container app={slut}>
    <Home />
  </Container>,
  document.getElementById('slut')
);
