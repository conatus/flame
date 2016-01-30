import Immutable from 'immutable';
import Cursor from 'immutable/contrib/cursor';

import immutableDiff from 'immutable-diff';


class ImmutableHistory {
  constructor(immutableCollection, onChange) {
    this.cursor = Cursor.from(immutableCollection, [], this._cursorHasChanged.bind(this));
    this._onChange = onChange;
    this._baseState = immutableCollection;
    this._diffs = Immutable.List();
    this._cursorIndex = 0;
  }

  freeze() {
    this._baseState = this.cursor.deref();
    this._cursorIndex = 0;
    this._diffs = this._diffs.clear();
  }

  canRedo() {
    return (this._cursorIndex < this._diffs.size);
  }

  canUndo() {
    return (this._cursorIndex > 0);
  }

  addDiffs(diffs) {
    this._diffs = this._diffs.concat(diffs);
    this._rebuildState(this._diffs.size);
  }

  redo() {
    if (this.canRedo()) {
      this._rebuildState(this._cursorIndex + 1);
    }
  }

  undo() {
    if (this.canUndo()) {
      this._rebuildState(this._cursorIndex - 1);
    }
  }

  _cursorHasChanged(newData, oldData) {
    if (Immutable.is(newData, oldData)) {
      return;
    }

    this.cursor = Cursor.from(newData, [], this._cursorHasChanged.bind(this));
    const newDiffs = immutableDiff(oldData, newData);

    this._diffs = this._diffs.slice(0, this._cursorIndex).concat(newDiffs);
    this._cursorIndex += newDiffs.size;

    this._onChange(newDiffs, this.cursor.deref());
  }

  _correctPath(path) {
    return path.substring(1).split('/');
  }

  _rebuildState(newIndex) {
    let newState = this._baseState;
    const requiredDiffs = this._diffs.slice(0, newIndex);

    requiredDiffs.forEach(diff => {
      const op = diff.get('op');
      const path = diff.get('path');
      const value = diff.get('value');

      if (op === 'add' || op === 'replace') {
        newState = newState.setIn(path, value);
      } else if (op === 'remove') {
        newState = newState.deleteIn(path, value);
      }
    });

    const diffs = immutableDiff(this.cursor.deref(), newState);
    this.cursor = Cursor.from(newState, [], this._cursorHasChanged.bind(this));
    this._cursorIndex = newIndex;

    this._onChange(diffs, this.cursor.deref());
  }
}

module.exports = ImmutableHistory;
