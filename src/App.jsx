import React, {useEffect, useState} from 'react';
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import {useDebounce} from "react-use";
import {getTrendingMovies, updateSearchCount} from "./appwrite.js";



const API_BASE_URL = 'https://api.themoviedb.org';
const API_KEY = import.meta.env.VITE_TMDB_API_TOKEN;
const API_OPTIONS = {
    method: "GET", headers: {
        accept: "application/json", authorization: `Bearer ${API_KEY}`,
    }
}


const App = () => {
    const [SearchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const [movieList, setMovieList] = useState([]);
    const [loading, isLoading] = useState(false);
    const [debounded, setDebounded] = useState('');
    const [trendingMovies, setTrendingMovies] = useState([]);

    useDebounce(() => {
        setDebounded(SearchTerm)
    }, 500, [SearchTerm])

    const fetchMovies = async (query = '') => {
        isLoading(true);
        setError('');
        try {
            const endpoint = query ? `${API_BASE_URL}/3/search/movie?query=${encodeURIComponent(SearchTerm)}` :

                `${API_BASE_URL}/3/discover/movie?sort_by=popularity.desc`;

            const response = await fetch(endpoint, API_OPTIONS);

            // console.log(response)

            if (!response.ok) {
                throw new Error("Error fetching movie");
            }
            const data = await response.json();

            console.log("data", data);

            if (data.Response === 'False') {
                setError(data.Error || 'Failed to fetch movies');
                setMovieList([])
                return;
            }
            setMovieList(data.results || []);
            if (query && data.results.length > 0) {
                await updateSearchCount(query, data.results[0]);
            }
        } catch (error) {
            console.log(`Error fetching movies: ${error.message}`);
            setError(error.message || "Please use vpn to see movies!");
        } finally {
            isLoading(false);
        }
    }

    const loadTrendingMovie = async () => {
        try {
            const movies = await getTrendingMovies();
            setTrendingMovies(movies);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchMovies(debounded)
    }, [debounded])

    useEffect(() => {
        loadTrendingMovie()
    }, [])
    return (<main>
        <div className="pattern">
            <div className="wrapper">
                <header>
                    <img src='/hero.png' alt="Hero Banner"/>
                    <h1>Find<span className='text-gradient'>Movies</span>You'll Enjoy Without the Hassle</h1>
                    <Search SearchTerm={SearchTerm} setSearchTerm={setSearchTerm}/>
                </header>

                {trendingMovies.length > 0 && (<section className="trending">
                        <h2>Trending Movies</h2>
                        <ul>
                            {trendingMovies.map((movie, index) => (<li key={movie.$id}>
                                    <p>{index + 1}</p>
                                    <img src={movie.poster_url ? movie.poster_url : '/no-movie.png'} alt="movie.title"/>
                                </li>))}
                        </ul>
                    </section>)}

                <section className="all-movies">
                    <h2>All Movies</h2>
                    {loading ? (<Spinner/>) : error ? (<p className='text-red-500'>{error}</p>) :

                        (<ul>
                            {movieList.map((movie) => (<MovieCard movie={movie} key={movie.id}/>))}
                        </ul>)}
                </section>


            </div>
        </div>

    </main>);
};

export default App;