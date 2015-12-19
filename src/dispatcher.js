import { Dispatcher } from 'flux';
import Log from 'loglevel';
import invariant from 'invariant';


class OurDispatcher extends Dispatcher {
  handleAction(action) {
    invariant(action.actionType !== undefined,
      'Actions should contain an actionType when dispatched'
    );

    Log.debug('ACTION:', action);

    this.dispatch({
      source: 'ACTION',
      action: action,
    });
  }
}

export default OurDispatcher;
