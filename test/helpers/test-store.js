import {BaseStore} from '../../src';

import Immutable from 'immutable';

class TestStore extends BaseStore {
  getStoreId() {
    return 'test';
  }

  getInitialState() {
    return Immutable.List([]);
  }
}

export default TestStore;
