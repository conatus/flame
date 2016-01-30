import Log from 'loglevel';
import React from 'react';
import ReactDOM from 'react-dom';

import {App, Container} from 'flame';

import Home from './components/pages/home.jsx';
import MovieStore from './stores/movie-store';
import TodoStore from './stores/todo-store';

// function getParameterByName(name) {
//     name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
//     var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
//         results = regex.exec(location.search);
//     return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
// }

// const webSocket = new WebSocket('ws://192.168.1.115:8000/');
// const isSlave = getParameterByName('slave');

Log.setLevel(Log.levels.TRACE);
const app = new App('app', [MovieStore, TodoStore]);

// if (isSlave) {
//   console.log("is slave")
//   webSocket.onmessage = (event) => {
//     console.log("recevsiing data", event)
//     const diffs = JSON.parse(event.data);
//     app.applyImmutableDiffs(Immutable.fromJS(diffs));
//   };
// } else {
//   console.log("is master")
//   app.addDiffListener((diffs) => {
//     const data = JSON.stringify(diffs);
//     console.log("sending data", data);
//     webSocket.send(data);
//   });
// }

ReactDOM.render(
  <Container app={app}>
    <Home />
  </Container>,
  document.getElementById('root')
);
