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
    if (this._stores) {
      this._stores.get('todo').emit('CHANGE');
      this.emit('CHANGE', diffs);
    }
  }

  addDiffListener(callback) {
    this.on('CHANGE', callback);
  }

  removeDiffListener(callback) {
    this.removeListener('CHANGE', callback);
  }

  dispatchAction(actionCreator) {
    actionCreator(this._dispatcher);
  }

  addStoreListeners(listener, storeIds) {
    storeIds.forEach(storeId => {
      const store = this._stores.get(storeId);
      store.addChangeListener(listener);
    });
  }

  removeStoreListeners(listener, storeIds) {
    storeIds.forEach(storeId => {
      const store = this._stores.get(storeId);
      store.removeChangeListener(listener);
    });
  }

  getAppState() {
    return this._history.cursor;
  }

  getStoreState(id) {
    return this._history.cursor.get(id);
  }

  setStoreState(id, state) {
    this._history.cursor.set(id, state);
  }

  addDiffs(diffs) {
    this._history.addDiffs(diffs);
  }

  redo() {
    this._history.redo();
    this._stores.get('todo').emit('CHANGE');
  }

  undo() {
    this._history.undo();
    this._stores.get('todo').emit('CHANGE');
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
