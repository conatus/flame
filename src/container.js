import React from 'react';

const Container = React.createClass({
  childContextTypes: {
    app: React.PropTypes.object,
  },

  propTypes: {
    app: React.PropTypes.object.isRequired,
    children: React.PropTypes.element.isRequired,
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
