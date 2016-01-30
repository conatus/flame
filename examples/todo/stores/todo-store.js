import Immutable from 'immutable';

import actionTypes from '../constants/action-types';
import {BaseStore} from 'flame';

class TodoStore extends BaseStore {
  getStoreId() {
    return 'todo';
  }

  getInitialState() {
    return Immutable.Map([]);
  }

  getState(state) {
    return state.toArray();
  }

  getHandlers() {
    return {
      [actionTypes.ADD_TODO]: this._handleAddTodo,
      [actionTypes.DELETE_TODO]: this._handleDeleteTodo,
    };
  }

  _handleAddTodo(action, state) {
    const id = state.size + 1;

    return state.set(id, Immutable.fromJS({
      id: id,
      todo: action.todo,
    }));
  }

  _handleDeleteTodo(action, state) {
    return state.delete(action.id);
  }
}

export default TodoStore;
