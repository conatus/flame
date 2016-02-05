import 'babel-register';

import Immutable from 'immutable';
import test from 'ava';

import App from '../src/app';
import TestStore from './helpers/test-store';


test('app instantiates with default state', t => {
  const app = new App('test', [
    TestStore,
  ]);

  const appState = app.getAppState();
  t.ok(Immutable.is(appState, Immutable.fromJS({
    'test': [],
  })));
});
