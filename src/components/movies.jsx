import React, { useState, useEffect, useCallback } from 'react';
import MovieCard from './MovieCard.js';
import Pagination from './Pagination.js';
import BackToTopButton from './backtotop.jsx';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseauth.js';
import Loader from './Loader.tsx';

function Movies() {
  const [user, setUser] = useState('');
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
 // Adjust as needed
  const apiKey = '6dbdf27e3fb82e5b69b71a171310e6a3'; // Replace with your actual API key const url = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=12';

  const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US`;
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      let url = apiUrl; // Initialize URL to default API URL
  
      // Fetch user preferences only when the user is logged in
      if (user) {
        const response = await fetch(`https://cineback-0zol.onrender.com/pref/${user}`);
     
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const userPreferences = data.preferences || []; // Ensure preferences is an array
        const genreIds = userPreferences[0]; // Extract genre IDs from preferences
        console.log(genreIds);
        
        url += `&with_genres=${genreIds}`; // Append genre IDs to the URL
      }
  
      const response = await fetch(`${url}&page=${currentPage}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setMovies(data.results);
      setTotalPages(data.total_pages);
    } catch (error) {
      setErrors(error);
      console.error('Error fetching movies:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, user, apiUrl]);
  
  

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user?.uid || '');
    });
    return () => unsubscribe();
  }, []);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="bg-transparent">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        {errors ? (
          <div className="text-center text-gray-600">
            <p>No movies found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {isLoading ? (
              <Loader />
            ) : (
              movies.map((movie) => (
                <MovieCard key={movie.id} id={movie.id} title={movie.title} />
              ))
            )}
          </div>
        )}
      </div>
      <BackToTopButton />
      {!errors && (
        <div className="bottom-16 sm:flex sm:flex-1 sm:items-center sm:justify-center">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      )}
    </div>
  );
}

export default Movies;
