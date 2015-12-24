import React from 'react';

const Container = React.createClass({
  propTypes: {
    app: React.PropTypes.object.isRequired,
    children: React.PropTypes.element.isRequired,
  },

  childContextTypes: {
    app: React.PropTypes.object,
  },

  getChildContext() {
    return {
      app: this.props.app,
    };
  },

  render() {
    return this.props.children;
  },
});

export default Container;
