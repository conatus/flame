import {BaseStore} from '../../src';

import Immutable from 'immutable';

class TestTwoStore extends BaseStore {
  getStoreId() {
    return 'testTwo';
  }

  getInitialState() {
    return Immutable.List([]);
  }
}

export default TestTwoStore;
