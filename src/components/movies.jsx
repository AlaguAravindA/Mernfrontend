import React, { useState, useEffect, useCallback } from 'react';
import MovieCard from './MovieCard.js';
import Pagination from './Pagination.js';
import BackToTopButton from './backtotop.jsx';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseauth.js';
import Loader from './Loader.tsx';
import { useCookies } from 'react-cookie'; // Import useCookies hook from react-cookie
import Cookies from 'js-cookie'; // Import Cookies library

function Movies() {
  const [user, setUser] = useState('');
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [cookies, setCookie] = useCookies([user]); // Define cookies and setCookie function

  const apiKey = '6dbdf27e3fb82e5b69b71a171310e6a3';
  const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US`;

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      let url = apiUrl;
      // console.log(cookies[user]+"hello")

      if (cookies[user]) { // Check if user's preferences are stored in cookies
           
        
        url += `&with_genres=${Cookies.get(`${user}`)}`; // Use preferences from cookies
      } else if (user) {
        console.log("hello"); 
        const response = await fetch(`https://cineback-0zol.onrender.com/pref/${user}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const userPreferences = data.preferences || [];
        const genreIds = userPreferences[0] || '';
        setCookie(user, genreIds, { path: '/', expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }); // Set preferences to cookies with expiration
        url += `&with_genres=${genreIds}`;
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
  }, [currentPage, user, apiUrl, cookies, setCookie]);

  useEffect(() => {
    // Update the URL and fetch data when user preferences change

      fetchData(); // Fetch data with updated preferences
    
  }, [ fetchData]);

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
