import React from 'react';

const Container = React.createClass({
  childContextTypes: {
    app: React.PropTypes.object,
  },

  propTypes: {
    app: React.PropTypes.object.isRequired,
    children: React.PropTypes.element.isRequired,
  },

  componentWillMount() {
    const { app } = this.props;
    app.subscribe(this._onChange);
  },

  componentWillUnmount() {
    const { app } = this.props;
    app.unsubscribe(this._onChange);
  },

  getChildContext() {
    const { app } = this.props;
    return {
      app: app,
    };
  },

  getInitialState() {
    return this._getState();
  },

  _onChange() {
    if (this.storeHasUpdated) {
      this.storeHasUpdated();
    }

    this.setState(this._getState());
  },

  _getState() {
    const { app } = this.props;
    return {
      data: app.getState(),
    };
  },

  render() {
    const {children} = this.props;
    const {data} = this.state;
    const element = React.Children.only(children);

    if (!data) {
      return null;
    }

    return React.cloneElement(element, {
      appState: data,
    });
  },
});

export default Container;
