import Immutable from 'immutable';
import Cursor from 'immutable/contrib/cursor';
import objectSizeof from 'object-sizeof';


class ImmutableHistory {
  constructor(immutableCollection, onChange) {
    this.cursor = Cursor.from(immutableCollection, [], this._cursorHasChanged.bind(this));
    this._history = Immutable.List([immutableCollection]);
    this._onChange = onChange;
    this._emitChange();

    this._historyBranched = false;
    this._cursorIndex = 0;
  }

  _cursorHasChanged(newData) {
    const currentData = this._history.get(this._cursorIndex);
    if (Immutable.is(newData, currentData)) {
      return;
    }

    this._history = this._history.slice(0, this._cursorIndex + 1);
    this._history = this._history.push(newData);
    this.cursor = Cursor.from(this._history.last(), [], this._cursorHasChanged.bind(this));
    this._cursorIndex = this._history.size - 1;

    this._emitChange();

    console.log(`size ${objectSizeof(this._history)} bytes`)
  }

  _emitChange() {
    this._onChange(this.cursor);
  }

  freeze() {
    this._history = this._history.take(1);
    this._cursorIndex = 0;
  }

  canRedo() {
    return (this._cursorIndex < this._history.size - 1);
  }

  canUndo() {
    return (this._cursorIndex > 0);
  }

  redo() {
    if (this._cursorIndex < this._history.size - 1) {
      this._cursorIndex += 1;
      const newData = this._history.get(this._cursorIndex);
      this.cursor = Cursor.from(newData, [], this._cursorHasChanged.bind(this));
      this._emitChange();
    }
  }

  undo() {
    this._cursorIndex -= 1;
    const newData = this._history.get(this._cursorIndex);
    this.cursor = Cursor.from(newData, [], this._cursorHasChanged.bind(this));
    this._emitChange();
  }
}

module.exports = ImmutableHistory;
