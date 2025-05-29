import React, {useState, useEffect} from 'react';
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_TOKEN;
const API_OPTIONS = {
    method: "GET",
    headers: {
        accept: "application/json",
        authorization: `Bearer ${API_KEY}`,
    }
}





const App = () => {
    const [SearchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const [movieList, setMovieList] = useState([]);
    const [loading, isLoading] = useState(false);

    const fetchMovies = async () => {
        isLoading(true);
        setError('');
        try {
            const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

            const response = await fetch(endpoint,API_OPTIONS);

            if(!response.ok) {
                throw new Error("Failed to fetch movies");
            }
            const data = await response.json();
            console.log(data);
            if(data.Response === 'False') {
                setError(data.Error || 'Failed to fetch movies');
                setMovieList([])
                return;
            }
            setMovieList(data.results);
        } catch (error) {
            console.log(`Error fetching movies: ${error.message}`);
            setError("Error fetching movies. Please try again later.");
        }finally {
            isLoading(false);
        }
    }

    useEffect(() => {
        fetchMovies()
    },[])
    return (
       <main>
           <div className="pattern">
               <div className="wrapper">
                   <header>
                       <img src='/hero.png' alt="Hero Banner"/>
                       <h1>Find<span className='text-gradient'>Movies</span>You'll Enjoy Without the Hassle</h1>
                       <Search SearchTerm={SearchTerm} setSearchTerm={setSearchTerm}/>
                   </header>

                   <section className="all-movies">
                        <h2>All Movies</h2>
                       { loading ? (
                           <Spinner/>
                       ): error ? (
                           <p className='text-red-500'>{error}</p>
                       ): (
                           <ul>
                               {movieList.map((movie) => (
                                  <MovieCard movie={movie} key={movie.id}/>
                               ))}
                           </ul>
                       )
                       }
                   </section>
               </div>
           </div>
       </main>
    );
};

export default App;