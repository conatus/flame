import movies from '../movies';

const MovieService = {
  fetchMovies() {
    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve(movies);
      }, 2000);
    });
  },

  fetchMovie(id) {
    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve(movies[id]);
      }, 2000);
    });
  },
};

export default MovieService;
