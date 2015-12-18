import React from 'react';
import TodoActions from '../../actions/todo-action';
import storeMixinFactory from '../mixins/stores-mixin-factory.jsx';

const Home = React.createClass({
  mixins: [
    storeMixinFactory('todo'),
  ],

  _onClick() {
    this.context.app.fireAction(
      TodoActions.newTodo('my new todo')
    );
  },

  _redo() {
    this.context.app.redo();
  },

  _undo() {
    this.context.app.undo();
  },

  render() {
    const { app } = this.context;
    const { todoState } = this.state;

    const canRedo = app.canRedo();
    const canUndo = app.canUndo();

    return (
      <div>
        <button disabled={!canRedo} onClick={this._redo}>Redo</button>
        <button disabled={!canUndo} onClick={this._undo}>Undo</button>
        <ul>
          {todoState.map((todo, index) => {
            return (
              <li key={index}>{todo}</li>
            );
          })}
          <button onClick={this._onClick}>add todo</button>
        </ul>
      </div>
    );
  },
});

export default Home;
