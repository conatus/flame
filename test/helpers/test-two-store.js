import {BaseStore} from '../../src';

import Immutable from 'immutable';

class TestTwoStore extends BaseStore {
  getStoreId() {
    return 'test-two';
  }

  getInitialState() {
    return Immutable.List([]);
  }
}

export default TestTwoStore;
