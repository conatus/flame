import React from 'react';

import MovieItem from './movie-item.jsx';

const MovieList = React.createClass({
  render() {
    return (
      <div>
        {this.props.movies.map((movie, index) => {
          return <MovieItem key={index} movie={movie} />;
        })}
      </div>
    );
  },
});

export default MovieList;
