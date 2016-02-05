import { EventEmitter } from 'events';
import Immutable from 'immutable';
import ImmutableHistory from './immutable-history';

import Dispatcher from './dispatcher';

class App extends EventEmitter {
  constructor(id, stores) {
    super(id, stores);

    this._id = id;
    this._dispatcher = new Dispatcher();
    this._history = new ImmutableHistory(Immutable.Map(), this._stateHasChanged.bind(this));

    this._stores = Immutable.Map(stores.map(Store => {
      const store = new Store(
        this._dispatcher,
        this._getStoreState.bind(this),
        this._setStoreState.bind(this)
      );
      return [store.getStoreId(), store];
    }));

    this._history.freeze();
  }

  /**
   * Returns a cursor into the app's state
   *
   * @returns {Immutable Cursor}.
   */
  getAppState() {
    return this._history.cursor;
  }

  /**
   * Subscribes a function to any change in app state
   *
   * @params {function} the callback.
   */
  subscribe(callback) {
    this.on('CHANGE', callback);
  }

  /**
   * Unsubscribes a function to any change in app state
   *
   * @params {function} the callback.
   */
  unsubscribe(callback) {
    this.removeListener('CHANGE', callback);
  }

  /**
   * Returns an Immutable Map of a given set of store's state keyed by the store's ID
   *
   * @params {array} an array of store ids.
   *
   * @returns {Immutable.Map} a map of the store's state.
   */
  getStateFromStores(ids) {
    ids.forEach(id => {
      if (!this._stores.has(id)) {
        throw new Error(`Unknown store with id '${id}'`);
      }
    });

    return Immutable.Map(ids.map(storeId => {
      return [`${storeId}State`, this._getStoreState(storeId)];
    }));
  }

  /**
   * Fire's a given action creator, providing that action creator
   * with a a function to actually dispatch the action, the current state of the app,
   * and a reference to this function to call additional action creators.
   *
   * @params {actionCreator} the action creator to call.
   */
  fireActionCreator(actionCreator) {
    const dispatchAction = this._dispatcher.handleAction.bind(this._dispatcher);
    const boundFireActionCreator = this.fireActionCreator.bind(this);

    if (typeof actionCreator === 'function') {
      actionCreator(dispatchAction, boundFireActionCreator);
    } else {
      const storeIds = actionCreator.storeIds;
      const state = this.getStateFromStores(storeIds);
      const func = actionCreator.actionCreator;
      return func(dispatchAction, state, boundFireActionCreator);
    }
  }

  /**
   * @params {diffs} an Immutable.List of Immutable diffs to be applied to the app's state.
   */
  applyImmutableDiffs(diffs) {
    this._history.applyImmutableDiffs(diffs);
  }

  /**
   * Sets the state of the Immutable history object forward one step
   */
  redo() {
    this._history.redo();
  }

  /**
   * Sets the state of the Immutable history object back one step
   */
  undo() {
    this._history.undo();
  }

  /**
   * Checks if the store's state has history in the future to redo
   */
  canRedo() {
    return this._history.canRedo();
  }

  /**
   * Checks if the store's state has history in the past to undo
   */
  canUndo() {
    return this._history.canUndo();
  }

  _stateHasChanged(diffs) {
    this.emit('CHANGE', diffs);
  }

  _getStoreState(id, raw = false) {
    if (!this._stores.has(id)) {
      throw new Error(`Unknown store with id '${id}'`);
    }

    const store = this._stores.get(id);
    let state = this._history.cursor.get(id);
    if (store.getState && !raw) {
      state = store.getState(state);
    }
    return state;
  }

  _setStoreState(id, state) {
    this._history.cursor.set(id, state);
  }
}

export default App;
