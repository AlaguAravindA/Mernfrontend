import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MovieCard from './MovieCard';
import Loader from './Loader.tsx';
import notfound from './images/posters/undraw_not_found_re_bh2e.svg';

const Searchresults = () => {
  const { searchquery } = useParams();
  const [datareq, setDatareq] = useState(null);
  const [isLoader, setIsLoader] = useState(false);
  const [recco, setRecco] = useState([]);
  const [movieId, setMovieId] = useState(null);
  const [arr , setArr] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoader(true);
      try {
        const response = await fetch(`https://cineback-0zol.onrender.com/searchmovies/movietitles/${searchquery}`);
        const data = await response.json();
        setDatareq(data.items[0]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoader(false);
      }
    };

    fetchData();
  }, [searchquery]);

  useEffect(() => {
    const fetchMovieIdFromDatabase = async () => {
      try {
        const movieIdResponse = await fetch(`https://cineback-0zol.onrender.com/searchmovies/movieID/${searchquery}`);
        const movieIdData = await movieIdResponse.json();
        setMovieId(movieIdData.items[0].id);
      } catch (error) {
        console.error('Error fetching movie ID:', error);
      }
    };

    if (searchquery) {
      fetchMovieIdFromDatabase();
    }
  }, [searchquery]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        if (!movieId) return;
        const url = `https://api.themoviedb.org/3/movie/${movieId}/recommendations?language=en-US&page=1`;
        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZGJkZjI3ZTNmYjgyZTViNjliNzFhMTcxMzEwZTZhMyIsInN1YiI6IjY1ODkxNzA0MDcyMTY2NjdlNGE1YmFlYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.cgxsdMCxOIZQVpHLyfNR8uPNGLZtiAy0ZdwNJnJ7aFI'
          }
        };

        const response = await fetch(url, options);
        const json = await response.json();
        const titles = json.results.slice(0, 4).map(movie => movie.original_title);
        setArr(titles);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    };

    fetchRecommendations();
  }, [movieId]);

  const fetchMovies = async (recommendations) => {
    try {
      const response = await fetch(`https://cineback-0zol.onrender.com/searchmovies/reccomendations/${recommendations}`);
      const reccomendation = await response.json();
      setRecco(reccomendation);
    } catch (error) {
      console.error(error);
    }
  };

  if(arr.length !== 0){
    fetchMovies(arr);
  }

  return (
    <div className='bg-gray-900 bg-opacity-80 p-8'>
      <div className='max-w-screen-xl mx-auto'>
        {isLoader && <Loader />} 
        <h2 className='text-3xl font-bold mb-6 relative overflow-hidden inline-block w-auto'>
          <span className='relative text-white text-opacity-90 p-4 rounded-md shadow-md'>
            Results for {searchquery}
          </span>
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {datareq === null && !isLoader && (
            <div className="flex flex-col h-screen">
              <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-md mb-4">
                <div className="flex items-center">
                  <div className="ml-2">
                    <p className="text-sm leading-5 font-medium w-auto">
                      No results found <span className="text-gray-600">Check what you have typed.</span>
                    </p>
                  </div>
                </div>
              </div>
              <img className='mx-auto max-w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg' src={notfound} alt="" />
            </div>
          )}

          {datareq && (
            <div key={datareq.imdb_id} className='bg-gray-800 p-4 rounded-lg transition-transform transform hover:scale-105'>
              {isLoader && <Loader />}
              <MovieCard id={datareq.imdb_id} title={datareq.original_title} />
            </div>
          )}
        </div>
      </div>

      {datareq !== null && (
        <div className='bg-gray-900 bg-opacity-80 rounded-lg mt-9 p-8 backdrop-filter backdrop-blur-lg'>
          <h2 className='text-4xl font-extrabold text-white mb-6'>
            More Like  "{searchquery}"
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {recco?.recco && recco.recco.map((movies) => (
              <div key={movies.imdb_id} className='bg-gray-800 p-4 rounded-lg transition-transform transform hover:scale-105'>
                <MovieCard id={movies.imdb_id} title={movies.original_title}></MovieCard>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Searchresults;
