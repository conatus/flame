import React from 'react';
import TodoActions from '../../actions/todo-action';
import storeMixinFactory from '../mixins/stores-mixin-factory.jsx';

import MovieActions from '../../actions/movie-actions';
import MovieList from '../partials/movie-list.jsx';


const Home = React.createClass({
  mixins: [
    storeMixinFactory('todo', 'movie'),
  ],

  getInitialState() {
    return {
      movieFlag: false,
    };
  },

  _fetchMovie() {
    this.setState({
      movieFlag: true,
    });

    this.context.app.dispatchAction(
      MovieActions.fetchMovie(2)
    );
  },

  _fetchMovies() {
    this.context.app.dispatchAction(
      MovieActions.fetchMovies()
    );
  },

  _onClick() {
    this.context.app.dispatchAction(
      TodoActions.newTodo(`my new todo ${Math.random()}`)
    );
  },

  _redo() {
    this.context.app.redo();
  },

  _undo() {
    this.context.app.undo();
  },

  render() {
    const {app} = this.context;

    if (!this.state.data) {
      return null;
    }

    const data = this.state.data;
    const movieState = data.get('movieState');
    const todoState = data.get('todoState');

    const canRedo = app.canRedo();
    const canUndo = app.canUndo();

    const movie = movieState.get('movies').get(2);

    return (
      <div>
        <button disabled={!canRedo} onClick={this._redo}>Redo</button>
        <button disabled={!canUndo} onClick={this._undo}>Undo</button>
        <div>
          <h3>Movies</h3>
          <button onClick={this._fetchMovies}>Fetch Movies</button>
          {movieState.get('status')}
          {movieState.get('status') === 'success' &&
            <MovieList movies={movieState.get('movies').toList()} />
          }
          <h5>Invididual Movie</h5>
          <button onClick={this._fetchMovie}>Fetch Movie</button>
          {movie && this.state.movieFlag &&
            <MovieList movies={[movie]} />
          }
        </div>
        <div>
          <h3>Todos</h3>
          <button onClick={this._onClick}>add todo</button>
          <ul>
            {todoState.map((todo, index) => {
              return (
                <li key={index}>{todo}</li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  },
});

export default Home;
