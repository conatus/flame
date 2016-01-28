import { EventEmitter } from 'events';
import Immutable from 'immutable';
import ImmutableHistory from './immutable-history';

import Dispatcher from './dispatcher';

class App extends EventEmitter {
  constructor(id, ...stores) {
    super(id, ...stores);

    this._id = id;
    this._dispatcher = new Dispatcher();
    this._history = new ImmutableHistory(Immutable.Map(), this._stateHasChanged.bind(this));

    this._stores = Immutable.Map(stores.map(Store => {
      const store = new Store(
        this._dispatcher,
        this.getStoreState.bind(this),
        this.setStoreState.bind(this)
      );
      return [store.getStoreId(), store];
    }));

    this._history.freeze();
    this.onStateChange = null;
  }

  _stateHasChanged(diffs) {
    this.emit('CHANGE', diffs);
  }

  subscribe(callback) {
    this.on('CHANGE', callback);
  }

  unsubscribe(callback) {
    this.removeListener('CHANGE', callback);
  }

  addDiffs(diffs) {
    this._history.addDiffs(diffs);
  }

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

  getAppState() {
    return this._history.cursor;
  }

  getStoreState(id) {
    const store = this._stores.get(id);
    let state = this._history.cursor.get(id);
    if (store.getState) {
      state = store.getState(state);
    }
    return state;
  }

  setStoreState(id, state) {
    this._history.cursor.set(id, state);
  }

  getStateFromStores(ids) {
    return Immutable.Map(ids.map(storeId => {
      return [`${storeId}State`, this.getStoreState(storeId)];
    }));
  }

  redo() {
    this._history.redo();
  }

  undo() {
    this._history.undo();
  }

  canRedo() {
    return this._history.canRedo();
  }

  canUndo() {
    return this._history.canUndo();
  }

  record() {

  }
}

export default App;
