import actionTypes from '../constants/action-types';
import MovieService from '../service/movie-service';

const MovieActions = {
  fetchMovie(id, existingMovie) {
    if (id) {
      return {
        storeIds: ['movie'],
        actionCreator: (dispatcher, state) => {
          const movies = state.get('movieState').get('movies');
          if (movies.has(id)) {
            return;
          }

          dispatcher.handleAction({
            id,
            actionType: actionTypes.FETCH_MOVIE_PENDING,
          });

          MovieService.fetchMovie(id).then((movie) => {
            dispatcher.handleAction({
              id,
              movie,
              actionType: actionTypes.FETCH_MOVIE_SUCCESS,
            });
          }, (error) => {
            dispatcher.handleAction({
              id,
              error,
              actionType: actionTypes.FETCH_MOVIE_ERROR,
            });
          });
        },
      };
    }

    return (dispatcher) => {
      dispatcher.handleAction({
        id: existingMovie.id,
        movie: existingMovie,
        actionType: actionTypes.FETCH_MOVIE_SUCCESS,
      });
    };
  },

  fetchMovies() {
    return (dispatcher) => {
      dispatcher.handleAction({
        actionType: actionTypes.FETCH_MOVIES_PENDING,
      });

      MovieService.fetchMovies().then((movies) => {
        movies.forEach(movie => {
          this.fetchMovie(null, movie)(dispatcher);
        });

        dispatcher.handleAction({
          actionType: actionTypes.FETCH_MOVIES_SUCCESS,
        });
      }, (error) => {
        dispatcher.handleAction({
          error,
          actionType: actionTypes.FETCH_MOVIES_ERROR,
        });
      });
    };
  },
};

export default MovieActions;
