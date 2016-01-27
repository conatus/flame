import React from 'react';


function storesMixinFactory(...storeIds) {
  const StoresMixin = {
    contextTypes: {
      app: React.PropTypes.object,
    },

    componentWillMount() {
      const { app } = this.context;
      app.subscribe(this._onChange);
    },

    componentWillUnmount() {
      const { app } = this.context;
      app.unsubscribe(this._onChange);
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
      return {
        data: app.getStateFromStores(storeIds),
      };
    },

  };

  return StoresMixin;
}

export default storesMixinFactory;
