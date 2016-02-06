import {appProviderMixin} from 'flame';
import React from 'react';

import TodoActions from '../../actions/todo-actions';


const TodoItem = React.createClass({
  mixins: [
    appProviderMixin,
  ],

  propTypes: {
    todoItemState: React.PropTypes.object.isRequired,
  },

  _handleDelete() {
    const id = this.props.todoItemState.get('id');

    this.context.app.fireActionCreator(
      TodoActions.deleteTodo(id)
    );
  },

  render() {
    const {todoItemState} = this.props;
    const id = todoItemState.get('id');
    const todo = todoItemState.get('todo');

    return (
      <li>
        {id} - {todo} - <button onClick={this._handleDelete}>X</button>
      </li>
    );
  },
});

export default TodoItem;
