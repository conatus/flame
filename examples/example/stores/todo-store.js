import Immutable from 'immutable';

import actionTypes from '../constants/action-types';
import {BaseStore} from 'flame';

class TodoStore extends BaseStore {
  getStoreId() {
    return 'todo';
  }

  getInitialState() {
    return Immutable.List([]);
  }

  getHandlers() {
    return {
      [actionTypes.ADD_TODO]: this._handleAddTodo,
    };
  }

  _handleAddTodo(action, state) {
    return state.push(action.todo);
  }
}

export default TodoStore;
