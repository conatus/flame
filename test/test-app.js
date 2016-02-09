import 'babel-register';

import Immutable from 'immutable';

import test from 'ava';
import sinon from 'sinon';

import App from '../src/app';
import TestStore from './helpers/test-store';
import TestTwoStore from './helpers/test-two-store';


test('app instantiates with default state', t => {
  const app = new App('test', [
    TestStore,
    TestTwoStore,
  ]);

  const appState = app.getState();
  t.ok(Immutable.is(appState, Immutable.fromJS({
    'testState': [],
    'testTwoState': [],
  })));
});

test('getStateFromStores returns only requested state', t => {
  const app = new App('test', [
    TestStore,
    TestTwoStore,
  ]);

  const state = app.getStateFromStores(['test']);

  t.ok(Immutable.is(state, Immutable.fromJS({
    'testState': [],
  })));
});

test('getStateFromStores errors on unknown store', t => {
  const app = new App('test', [
    TestStore,
  ]);

  t.throws(() => {
    app.getStateFromStores(['non-existent']);
  }, `Unknown store with id 'non-existent'`);
});

test('_setStoreState sets state', t => {
  const app = new App('test', [
    TestStore,
  ]);

  app._setStoreState('test', Immutable.fromJS(['new-item']));
  const storeState = app._getStoreState('test');
  t.ok(Immutable.is(storeState, Immutable.fromJS(['new-item'])));
});

test('_setStoreState calls subscribed callbacks', t => {
  const app = new App('test', [
    TestStore,
  ]);

  t.plan(1);

  app.subscribe(() => {
    t.pass();
  });

  app._setStoreState('test', Immutable.fromJS(['new-item']));
});

test('fireActionCreator calls actionCreator with expected inputs', t => {
  const app = new App('test', [
    TestStore,
  ]);

  t.plan(2);

  app.fireActionCreator((dispatchAction, fireActionCreator) => {
    t.ok(typeof dispatchAction === 'function');
    t.ok(typeof fireActionCreator === 'function');
  });
});

test('undo calls through to ImmutableHistory redo', t => {
  const app = new App('test', [TestStore]);

  sinon.spy(app._history, 'redo');
  t.plan(1);

  app.redo();
  t.ok(app._history.redo.calledOnce);
});

test('undo calls through to ImmutableHistory undo', t => {
  const app = new App('test', [TestStore]);

  sinon.spy(app._history, 'undo');
  t.plan(1);

  app.undo();
  t.ok(app._history.undo.calledOnce);
});

test('undo calls through to ImmutableHistory canRedo', t => {
  const app = new App('test', [TestStore]);

  sinon.spy(app._history, 'canRedo');
  t.plan(1);

  app.canRedo();
  t.ok(app._history.canRedo.calledOnce);
});

test('undo calls through to ImmutableHistory canUndo', t => {
  const app = new App('test', [TestStore]);

  sinon.spy(app._history, 'canUndo');
  t.plan(1);

  app.canUndo();
  t.ok(app._history.canUndo.calledOnce);
});

test('fireActionCreator provides actionCreator with specified store state', t => {
  const app = new App('test', [
    TestStore,
  ]);

  t.plan(3);

  app.fireActionCreator({
    storeIds: ['test'],
    actionCreator: (dispatchAction, state, fireActionCreator) => {
      t.ok(typeof dispatchAction === 'function');
      t.ok(typeof fireActionCreator === 'function');
      t.ok(Immutable.is(state, Immutable.fromJS({
        testState: [],
      })));
    },
  });
});
