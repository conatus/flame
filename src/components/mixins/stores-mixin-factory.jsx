import Immutable from 'immutable';

import React from 'react';


function storesMixinFactory(...storeIds) {
  const StoresMixin = {
    contextTypes: {
      app: React.PropTypes.object,
    },

    componentDidMount() {
      const { app } = this.context;
      app.addStoreListeners(this._onChange, storeIds);
    },

    componentWillUnmount() {
      const { app } = this.context;
      app.removeStoreListeners(this._onChange, storeIds);
    },

    getInitialState() {
      return this._getStateFromStores();
    },

    _onChange() {
      if (this.storeHasUpdated) {
        this.storeHasUpdated();
      }

      this.setState(this._getStateFromStores());
    },

    _getStateFromStores() {
      const { app } = this.context;

      return Immutable.Map(storeIds.map(storeId => {
        return [`${storeId}State`, app.getStoreState(storeId)];
      })).toJS();
    },

  };

  return StoresMixin;
}

export default storesMixinFactory;
