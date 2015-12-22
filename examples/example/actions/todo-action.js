import actionTypes from '../constants/action-types';

const TodoActions = {
  newTodo(todo) {
    return (dispatcher) => {
      dispatcher.handleAction({
        actionType: actionTypes.ADD_TODO,
        todo: todo,
      });
    };
  },
};

export default TodoActions;
