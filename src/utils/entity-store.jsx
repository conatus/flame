import Immutable from 'immutable';

import {BaseStore} from 'flame';
import Status from './status';


class EntityStore extends BaseStore {
  getInitialState() {
    return Immutable.fromJS({});
  }

  getHandlers() {
    const updateActionTypes = this.getUpdateActionTypes();

    return {
      [updateActionTypes.updatePendingActionType]: this._handleUpdatePending,
      [updateActionTypes.updateSuccessActionType]: this._handleUpdateSuccess,
      [updateActionTypes.updateErrorActionType]: this._handleUpdateError,
    };
  }

  _getNormalizer() {
    return this.normalizeEntity || (id => id);
  }

  _handleUpdatePending(action, state) {
    if (!action.id) {
      throw new Error('Pending actions must contain an id as part of the action payload when using EntityStore');
    }

    const id = action.id;

    let newEntity = {};
    const existingEntity = state.get(this._getNormalizer()(id));

    if (existingEntity) {
      newEntity = existingEntity.set('status', new Status('reloading'));
    } else {
      newEntity = Immutable.fromJS({
        id: id,
        status: new Status('pending'),
        [this.getStoreId()]: {},
      });
    }

    return state.set(this._getNormalizer()(id), newEntity);
  }

  _handleUpdateSuccess(action, state) {
    if (!action.id) {
      throw new Error('Success actions must contain an id as part of the action payload when using EntityStore');
    }

    return state.set(this._getNormalizer()(action.id), Immutable.fromJS({
      id: action.id,
      status: new Status('loaded'),
      [this.getStoreId()]: action[this.getStoreId()],
    }));
  }

  _handleUpdateError(action, state) {
    if (!action.error) {
      throw new Error('Error actions must contain an error as part of the action payload when using EntityStore');
    }

    if (!action.id) {
      throw new Error('Error actions must contain an id as part of the action payload when using EntityStore');
    }

    return state.set(this._getNormalizer()(action.id), Immutable.fromJS({
      id: action.id,
      status: new Status('error'),
      [this.getStoreId()]: {},
      error: action.error,
    }));
  }

}


export default EntityStore;
