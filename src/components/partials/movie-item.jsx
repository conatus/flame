import React from 'react';

const MovieItem = React.createClass({
  render() {
    return (
      <div>
        {this.props.movie.get('status')}
        {" "}
        {this.props.movie.getIn(['movie', 'title'])}
      </div>
    );
  },
});

export default MovieItem;
