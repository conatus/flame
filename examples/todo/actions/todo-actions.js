import actionTypes from '../constants/action-types';

const TodoActions = {
  newTodo(todo) {
    return (dispatchAction) => {
      dispatchAction({
        actionType: actionTypes.ADD_TODO,
        todo,
      });
    };
  },

  deleteTodo(id) {
    return (dispatchAction) => {
      dispatchAction({
        actionType: actionTypes.DELETE_TODO,
        id,
      });
    };
  },

  editTodo(id, todo) {
    return (dispatchAction) => {
      dispatchAction({
        actionType: actionTypes.DELETE_TODO,
        id,
        todo,
      });
    };
  },
};

export default TodoActions;
