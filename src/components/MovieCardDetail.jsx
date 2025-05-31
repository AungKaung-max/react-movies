import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaHome,FaPlay, FaImdb, FaCalendarAlt, FaClock, FaEye, FaStar } from 'react-icons/fa';

import { useParams, useNavigate } from 'react-router-dom';
import Spinner from "./Spinner.jsx";

// const API_BASE_URL = 'https://api.themoviedb.org';
const API_KEY = import.meta.env.VITE_TMDB_API_TOKEN;
const API_OPTIONS = {
    method: "GET", headers: {
        accept: "application/json", authorization: `Bearer ${API_KEY}`,
    }
}


const MovieCardDetail= () => {

    const {id} = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [trailer, setTrailers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);



    useEffect(() => {
        const fetchMovieData = async () => {
            try {
                setLoading(true);

                const data = await fetch(`https://api.themoviedb.org/3/movie/${id}`,API_OPTIONS)
                const movieResponse = await data.json();
                const data2 = await fetch(
                    `https://api.themoviedb.org/3/movie/${id}/videos`,API_OPTIONS
                )
                const trailersResponse = await data2.json();

                setMovie(movieResponse);
                setTrailers(trailersResponse.results[0]);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchMovieData();
    }, [id]);

    // Helper functions
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatRuntime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };



    if (loading) {
        return (
            <main className="min-h-screen bg-primary flex items-center justify-center">
                <Spinner/>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen bg-primary flex items-center justify-center">
                <div className="text-red-400 text-xl">Error: {error}</div>
            </main>
        );
    }

    if (!movie) {
        return (
            <main className="min-h-screen bg-primary flex items-center justify-center">
                <div className="text-white text-xl">Movie not found</div>
            </main>
        );
    }

    return (
        <main className="min-h-screen relative bg-primary">
            {/* Backdrop Image with Gradient Overlay */}
            <div className="relative h-80 w-full overflow-hidden md:h-96">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-30"
                    style={{
                        backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
                    }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent"></div>
                <div className="absolute top-5 left-10 z-10 ">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#AB8BFF]/90 hover:bg-[#AB8BFF] rounded-lg transition-all text-white cursor-pointer"
                    >
                        <FaArrowLeft />
                        <span>Back</span>
                    </button>

                </div>
            </div>

            {/* Main Content */}
            <div className="wrapper">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Poster Column */}
                    <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
                        <div className="rounded-2xl overflow-hidden shadow-inner shadow-light-100/10 transform hover:scale-105 transition duration-300">
                            <img
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                                className="w-full h-auto"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/placeholder-movie.png';
                                }}
                            />
                        </div>
                    </div>

                    {/* Details Column */}
                    <div className="flex-1">
                        {/* Title and Tagline */}
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-white mb-2 sm:text-4xl">{movie.title}</h1>
                            <p className="text-xl text-light-200 italic">{movie.tagline}</p>
                        </div>

                        {/* Rating and Release Info */}
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            <div className="flex items-center bg-dark-100 px-3 py-2 rounded-lg">
                                <div className="bg-gradient-to-r from-[#D6C7FF] to-[#AB8BFF] rounded-full w-10 h-10 flex items-center justify-center">
                                    <span className="font-bold text-white">{movie.vote_average.toFixed(1)}</span>
                                </div>
                                <span className="ml-2 text-light-100">/10 ({movie.vote_count} votes)</span>
                            </div>

                            <div className="flex items-center bg-dark-100 px-3 py-2 rounded-lg">
                                <FaStar className="text-light-200 mr-1" />
                                <span className="text-light-100">{movie.status}</span>
                            </div>

                            <div className="flex items-center bg-dark-100 px-3 py-2 rounded-lg">
                                <FaCalendarAlt className="text-light-200 mr-1" />
                                <span className="text-light-100">
                  {new Date(movie.release_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                  })}
                </span>
                            </div>

                            <div className="flex items-center bg-dark-100 px-3 py-2 rounded-lg">
                                <FaClock className="text-light-200 mr-1" />
                                <span className="text-light-100">{formatRuntime(movie.runtime)}</span>
                            </div>
                        </div>

                        {/* Genres */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {movie.genres.map(genre => (
                                <span key={genre.id} className="px-3 py-1 bg-dark-100 rounded-full text-sm text-light-100">
                  {genre.name}
                </span>
                            ))}
                        </div>

                        {/* Trailer Section */}
                        {trailer && (
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-white mb-4">Trailers</h2>
                                <div className="space-y-4">

                                        <div key={trailer.id} className="bg-dark-100 rounded-2xl overflow-hidden shadow-inner shadow-light-100/10">
                                            <div className="relative group aspect-w-16 aspect-h-9">
                                                <img
                                                    src={`https://img.youtube.com/vi/${trailer.key}/maxresdefault.jpg`}
                                                    alt={trailer.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = '/placeholder-trailer.jpg';
                                                    }}
                                                />
                                                <a
                                                    href={`https://www.youtube.com/watch?v=${trailer.key}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                >
                                                    <div className="bg-gradient-to-r from-[#D6C7FF] to-[#AB8BFF] rounded-full p-4">
                                                        <FaPlay className="text-white text-xl" />
                                                    </div>
                                                </a>
                                            </div>

                                            <div className="p-4">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="text-lg font-bold text-white">{trailer.name}</h3>
                                                    {trailer.official && (
                                                        <span className="bg-[#D6C7FF] text-primary text-xs font-bold px-2 py-1 rounded">
                              OFFICIAL
                            </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center mt-2 text-light-200 text-sm">
                          <span className="flex items-center mr-3">
                            <FaCalendarAlt className="mr-1" />
                              {new Date(trailer.published_at).toLocaleDateString()}
                          </span>
                                                    <span className="flex items-center">
                            <FaEye className="mr-1" />
                                                        {trailer.site}
                          </span>
                                                </div>
                                            </div>
                                        </div>

                                </div>
                            </div>
                        )}

                        {/* Overview */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-white mb-3">Overview</h2>
                            <p className="text-light-100 leading-relaxed">{movie.overview || 'No overview available.'}</p>
                        </div>

                        {/* Watch Now Button */}
                        {movie.homepage && (
                            <div className="mb-8">
                                <a
                                    href={movie.homepage}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#D6C7FF] to-[#AB8BFF] hover:opacity-90 rounded-lg font-bold transition duration-300 text-primary"
                                >
                                    <FaPlay className="mr-2" />
                                    Watch Now
                                </a>
                            </div>
                        )}

                        {/* Collection */}
                        {movie.belongs_to_collection && (
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-white mb-3">Part of Collection</h2>
                                <div className="flex items-center bg-dark-100 rounded-lg p-4 hover:bg-dark-100/80 transition duration-300">
                                    <img
                                        src={`https://image.tmdb.org/t/p/w92${movie.belongs_to_collection.poster_path}`}
                                        alt={movie.belongs_to_collection.name}
                                        className="w-16 h-24 object-cover rounded-lg mr-4"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/placeholder-collection.png';
                                        }}
                                    />
                                    <div>
                                        <h3 className="font-bold text-white">{movie.belongs_to_collection.name}</h3>
                                        <p className="text-sm text-light-200">Movie Collection</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Production Companies */}
                        {movie.production_companies && movie.production_companies.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-white mb-3">Production Companies</h2>
                                <div className="flex flex-wrap gap-4">
                                    {movie.production_companies.map(company => (
                                        company.logo_path ? (
                                            <div key={company.id} className="bg-white p-2 rounded-lg">
                                                <img
                                                    src={`https://image.tmdb.org/t/p/original${company.logo_path}`}
                                                    alt={company.name}
                                                    className="h-8 object-contain p-1"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = '/placeholder-company.png';
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            <span key={company.id} className="px-3 py-2 bg-dark-100 rounded-lg text-sm text-light-100">
                        {company.name}
                      </span>
                                        )
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-dark-100 p-6 rounded-2xl shadow-inner shadow-light-100/10">
                        <h3 className="text-xl font-bold text-white mb-3">Budget</h3>
                        <p className="text-2xl text-gradient">
                            {movie.budget ? formatCurrency(movie.budget) : 'Not available'}
                        </p>
                    </div>

                    <div className="bg-dark-100 p-6 rounded-2xl shadow-inner shadow-light-100/10">
                        <h3 className="text-xl font-bold text-white mb-3">Revenue</h3>
                        <p className="text-2xl text-gradient">
                            {movie.revenue ? formatCurrency(movie.revenue) : 'Not available'}
                        </p>
                    </div>

                    <div className="bg-dark-100 p-6 rounded-2xl shadow-inner shadow-light-100/10">
                        <h3 className="text-xl font-bold text-white mb-3">Original Title</h3>
                        <p className="text-xl text-light-100">{movie.original_title}</p>
                    </div>

                    <div className="bg-dark-100 p-6 rounded-2xl shadow-inner shadow-light-100/10">
                        <h3 className="text-xl font-bold text-white mb-3">IMDb</h3>
                        {movie.imdb_id ? (
                            <a
                                href={`https://www.imdb.com/title/${movie.imdb_id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gradient hover:underline flex items-center"
                            >
                                <FaImdb className="mr-2 text-2xl text-yellow-400" />
                                View on IMDb
                            </a>
                        ) : (
                            <p className="text-light-200">Not available</p>
                        )}
                    </div>
                </div>
            </div>
            <button
                onClick={() => navigate(-1)}
                className="ml-10 mb-10 flex items-center gap-2 px-4 py-2 bg-[#AB8BFF]/90 hover:bg-[#AB8BFF] rounded-lg transition-all text-white cursor-pointer"
            >
                <FaHome />
                <span>Home</span>
            </button>
        </main>
    );
};

export default MovieCardDetail;