import invariant from 'invariant';
import Immutable from 'immutable';
import { EventEmitter } from 'events';
import Log from 'loglevel';


class BaseStore extends EventEmitter {
  constructor(dispatcher, getStoreState, setStoreState, ...args) {
    super(...args);

    this._dispatcher = dispatcher;
    this._getStoreState = getStoreState;
    this._setStoreState = setStoreState;
    this._args = args;

    this._setInitialState();
    this._dispatcher.register(this._handle.bind(this));

    this._handlers = Immutable.Map(
      this.getHandlers()
    );
  }

  /**
   * A unique id used as a key in the global immutable state tree.
   *
   * @returns {string} The store's id.
   */
  getStoreId() {
    invariant(true, 'A store must implement storeId');
  }

  /**
   * Implement this to provide initial state for the store. Defaults to an Immutable.Map.
   *
   * @returns {Immutable} An immutable object.
   */
  getInitialState() {
    return Immutable.Map();
  }

  /**
   * getState provides the implementing store an opportunity to modify the state of the store before it's
   * provided to subscribed components.
   *
   * @param {Immutable.Map} The stores's state.
   *
   * @returns {Immutable.Map} The state provided to subscribers.
   */
  getState(state) {
    return state;
  }

  /**
   * Sets stores state back to the result of getInitialState
   *
   *
   * @returns {Immutable.Map} The store's new state.
   */
  resetState() {
    this._setInitialState();
  }

  /**
   * Implement this to bind handlers to an action.
   *
   *
   * @returns {Immutable.Map} The handlers to bind with the follow shape:
   *
   * {
   *   [actionType]: this._actionHandler,
   * }
   *
   * Each handler function will receive (action, state) where action is the object given to `dispatchAction`
   * inside the action creator, and state is the store's current state. The handler is expected to return an
   * immutable object which is used as the store's updated state.
   */
  getHandlers() {
    return Immutable.Map();
  }

  _handle(action) {
    let handled = false;

    if (this._handlers.has(action.actionType)) {
      const storeId = this.getStoreId();
      Log.debug(`${storeId} is handling ${action.actionType}`);

      const existingState = this._getStoreState(storeId, true);
      const updatedState = this._handlers.get(action.actionType).call(this, action, existingState);
      this._setStoreState(storeId, updatedState);

      handled = true;
    }

    return handled;
  }

  _setInitialState() {
    this._setStoreState(this.getStoreId(), this.getInitialState(...this._args));
  }
}

export default BaseStore;
