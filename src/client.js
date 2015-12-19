import Immutable from 'immutable';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './app';
import Container from './container.jsx';
import Home from './components/pages/home.jsx';
import TodoStore from './stores/todo-store';

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

const webSocket = new WebSocket('ws://192.168.1.115:8000/');
const isSlave = getParameterByName('slave');

const app = new App('app', TodoStore);
if (isSlave) {
  console.log("is slave")
  webSocket.onmessage = (event) => {
    console.log("receviing data", event)
    const diffs = JSON.parse(event.data);
    app.addDiffs(Immutable.fromJS(diffs));
  };
} else {
  console.log("is master")
  app.addDiffListener((diffs) => {
    const data = JSON.stringify(diffs);
    console.log("sending data", data);
    webSocket.send(data);
  });
}

ReactDOM.render(
  <Container app={app}>
    <Home />
  </Container>,
  document.getElementById('root')
);
