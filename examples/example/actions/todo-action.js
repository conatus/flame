import actionTypes from '../constants/action-types';

const TodoActions = {
  newTodo(todo) {
    return (dispatchAction) => {
      dispatchAction({
        actionType: actionTypes.ADD_TODO,
        todo: todo,
      });
    };
  },
};

export default TodoActions;
