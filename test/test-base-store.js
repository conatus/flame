import 'babel-register';

import Immutable from 'immutable';
import test from 'ava';

import App from '../src/app';
import TestStore from './helpers/test-store';


test('sets initial state on instantiation', t => {
  const app = new App('test', [
    TestStore,
  ]);

  const storeState = app._getStoreState('test');
  t.ok(Immutable.is(storeState, Immutable.fromJS([])));
});

test('sets handlers on instantiation', t => {
  t.plan(1);

  const handler = () => {};

  TestStore.prototype.getHandlers = () => {
    return {
      actionType: handler,
    };
  };

  const app = new App('test', [
    TestStore,
  ]);

  t.ok(Immutable.is(app._stores.get('test')._handlers, Immutable.fromJS({
    actionType: handler,
  })));
});

test('modifies state after handling action', t => {
  t.plan(2);

  const actionToSend = {
    actionType: 'testActionType',
    payload: ['new-item'],
  };

  const handler = (action) => {
    t.pass();
    return Immutable.fromJS(action.payload);
  };

  TestStore.prototype.getHandlers = () => {
    return {
      testActionType: handler,
    };
  };

  const app = new App('test', [
    TestStore,
  ]);

  const storeInstance = app._stores.get('test');
  storeInstance._handle(actionToSend);

  t.ok(Immutable.is(app._getStoreState('test'), Immutable.fromJS(['new-item'])));
});
