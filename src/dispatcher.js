import { Dispatcher } from 'flux';
import Log from 'loglevel';
import invariant from 'invariant';


class OurDispatcher extends Dispatcher {
  handleAction(action) {
    invariant(action.actionType !== undefined,
      'Actions should always contain an actionType when dispatched'
    );

    Log.debug('API ACTION:', action);

    this.dispatch({
      source: 'API_ACTION',
      action: action,
    });
  }
}

export default OurDispatcher;
