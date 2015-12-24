import actionTypes from '../constants/action-types';
import MovieService from '../service/movie-service';

const MovieActions = {
  fetchMovie(id, existingMovie) {
    if (id) {
      return {
        storeIds: ['movie'],
        actionCreator: (dispatchAction, state) => {
          const movies = state.get('movieState').get('movies');
          if (movies.has(id)) {
            return;
          }

          dispatchAction({
            id,
            actionType: actionTypes.FETCH_MOVIE_PENDING,
          });

          MovieService.fetchMovie(id).then((movie) => {
            dispatchAction({
              id,
              movie,
              actionType: actionTypes.FETCH_MOVIE_SUCCESS,
            });
          }, (error) => {
            dispatchAction({
              id,
              error,
              actionType: actionTypes.FETCH_MOVIE_ERROR,
            });
          });
        },
      };
    }

    return (dispatchAction) => {
      dispatchAction({
        id: existingMovie.id,
        movie: existingMovie,
        actionType: actionTypes.FETCH_MOVIE_SUCCESS,
      });
    };
  },

  fetchMovies() {
    return (dispatchAction, fireActionCreator) => {
      dispatchAction({
        actionType: actionTypes.FETCH_MOVIES_PENDING,
      });

      MovieService.fetchMovies().then((movies) => {
        movies.forEach(movie => {
          fireActionCreator(
            this.fetchMovie(null, movie)
          );
        });

        dispatchAction({
          actionType: actionTypes.FETCH_MOVIES_SUCCESS,
        });
      }, (error) => {
        dispatchAction({
          error,
          actionType: actionTypes.FETCH_MOVIES_ERROR,
        });
      });
    };
  },
};

export default MovieActions;
