import React, { useEffect, useState, useCallback } from "react";
import AddMovie from "./FetchMovie/AddMovie";
import MoviesList from "./components/MoviesList";
import "./App.css";

function AppApiFetch() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const ApiHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://react-http-97734-default-rtdb.firebaseio.com/movies.json"
      );
      if (!response.ok) {
        throw new Error("Something went wrong ....Retrying");
      }
      const data = await response.json();
      const loadedMovies = [];
      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }

      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }, []);
  useEffect(() => {
    ApiHandler();
  }, [ApiHandler]);

  const retryingremovHandler = (event) => {
    setError(event.target.parentNode.remove());
  };
  async function addMovieHandler(movie) {
    const response = await fetch(
      "https://react-http-97734-default-rtdb.firebaseio.com/movies.json",
      {
        method: "POST",
        body: JSON.stringify(movie),
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = await response.json();
    console.log(data);
  }

  async function deleteMovieHandler(id) {
    try {
      const response = await fetch(
        `https://react-http-97734-default-rtdb.firebaseio.com/movies/${id}.json`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Something went wrong while deleting movie.");
      }

      const updatedMovies = movies.filter((movie) => movie.id !== id);
      setMovies(updatedMovies);
    } catch (error) {
      setError(error.message);
    }
  }
  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={ApiHandler}>Fetch Movies</button>
      </section>
      <section>
        {!isLoading && (
          <MoviesList movies={movies} onDelete={deleteMovieHandler} />
        )}

        {!isLoading && error && <p>{error} </p>}

        {isLoading && <p>Loading...</p>}
      </section>

      <div>
        {error && <button onClick={retryingremovHandler}>Cancel</button>}
      </div>
    </React.Fragment>
  );
}

export default AppApiFetch;
