import React, { useState, useEffect, useCallback } from 'react';
import MovieCard from './MovieCard.js';
import Pagination from './Pagination.js';
import BackToTopButton from './backtotop.jsx';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseauth.js';
import Loader from './Loader.tsx';
// import { ShufflingContext } from './suffeling.jsx'; // Import the context

function Movies() {
  // const api = '6dbdf27e3fb82e5b69b71a171310e6a3';
  const apiUrl = 'https://cineback-0zol.onrender.com/';

  // const { shufflingState, setShufflingState } = useContext(ShufflingContext);

  const [user, setUser] = useState('');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 100;
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(true);


  // const [userPreferences, setUserPreferences] = useState([]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);

    try {
      let apiUrlWithPreferences = `${apiUrl}?page=${currentPage}&perPage=${itemsPerPage}`;

      // Fetch user preferences only when the user is logged in
      if (user) {
        const response = await fetch(`https://cineback-0zol.onrender.com/pref/${user}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const genreString = data.preferences.join('|');
        apiUrlWithPreferences += `&genres=${genreString}`;
      }

      const response = await fetch(apiUrlWithPreferences);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setProducts(data.items);
      setTotalPages(data.totalPages);
      // await executeDeployHook();
    } catch (error) {
      setError(error);
      if(errors){
        console.log("errr");
      }
    } finally {
      setIsLoadingPreferences(false);
      setIsLoading(false);
    }
  }, [currentPage, user, errors]);
  
  // const executeDeployHook = async () => {
  //   try {
  //     // Make a request to your deploy hook URL
  //     const response = await fetch('https://api.render.com/deploy/srv-cml2vei1hbls73c0ooj0?key=SdAkzCxoIFM');
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     }
  //     const data = await response.json();
  //     console.log(data); // Log response from deploy hook
  //   } catch (error) {
  //     console.error('Error executing deploy hook:', error);
  //   }
  // };

  useEffect(() => {
    // Fetch movies when the component mounts and when currentPage or user change
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user?.uid || '');
    });

    return () => unsubscribe();
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  
 return (
    <div className="bg-transparent">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        {errors ? (
          <div className="flex  justify-center ">
          <div className="bg-gray-900 text-white rounded-lg shadow-lg p-8">
            <div className="text-4xl mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 00-.74.336c-4.418 4.395-4.562 7.39-3.702 9.562a7.29 7.29 0 001.445 1.667c.483.448 1.09.894 1.772 1.35a1 1 0 001.486 0c.682-.456 1.29-.902 1.772-1.35.595-.553 1.035-1.135 1.344-1.747a7.29 7.29 0 001.445-1.667c.86-2.172.716-5.167-3.702-9.562A1 1 0 0010 3zm0 2a1 1 0 01.587.192c3.4 2.687 3.517 4.603 2.829 6.273-.617 1.872-2.18 3.33-3.85 4.516a5.282 5.282 0 01-1.133.675l-.177.072-.177-.072a5.282 5.282 0 01-1.133-.675c-1.67-1.186-3.233-2.644-3.85-4.516-.688-1.67-.571-3.586 2.829-6.273A1 1 0 0110 5zm0 7a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
              </svg>
              Oops! Something Went Wrong 💔
            </div>
            <p className="text-lg mb-4 text-center">Please try again later.</p>
            <p className='text-center'>Check Your Internet Connection 😎</p>
          </div>
        </div>
        
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {isLoading && <Loader></Loader>}
            {isLoadingPreferences && <Loader />}
            {!isLoading && !isLoadingPreferences && products.length === 0 && (
              <div className="text-center text-gray-600">
                <p>No movies found.</p>
              </div>
            )}
            {!isLoading && !isLoadingPreferences &&
              products.map((product) => (
                <MovieCard
                  key={product.id}
                  id={product.imdb_id}
                  title={product.original_title}
                  genres={product.genres}
                />
              ))}
          </div>
        )}
      </div>
      <BackToTopButton />
      {!errors  ?   (<div className="bottom-16 sm:flex sm:flex-1 sm:items-center sm:justify-center">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>):
      <></>
      }
      </div>
  );
              } 

export default Movies;
