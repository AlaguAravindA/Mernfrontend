import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseauth';
import WatchlistNotFound from './Wacthlistnotfound';
import MovieCard from './MovieCard';
import Loader from './Loader.tsx'; // Import the Loader component

export default function Watchlist() {
  const [userId, setUserId] = useState('');
  const [watchlist, setWatchlist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
   const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid || '');
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchWatchlistDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`https://cineback-0zol.onrender.com/watchlist/${userId}`);
        const data = await response.json();

        if (data.error) {
          setWatchlist([]);
        } else {
          setWatchlist(data.watchlist);
        }
      } catch (error) {
        console.error('Error fetching watchlist:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchWatchlistDetails();
    }
  }, [userId]);

const removeFromWatchlist = async (imdbId) => {
    try {
      setRemovingId(imdbId); // Set the id of the movie being removed
      const response = await fetch(`https://cineback-0zol.onrender.com/watchlist/${userId}/${imdbId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to remove movie from watchlist. Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        console.error('Error removing movie from watchlist:', data.error);
      } else {
        // Update the watchlist state without triggering re-render
        setWatchlist((prevWatchlist) => prevWatchlist.filter((id) => id !== imdbId));
      }
    } catch (error) {
      console.error('Error removing movie from watchlist:', error);
    } finally {
      setRemovingId(null); // Reset removingId after removal process completes
    }
  };

  const reversedWatchlist = watchlist.slice().reverse();

  return (
    <div className="bg-transparent">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only text-slate-50">Watchlist</h2>

        {isLoading ? (
          <Loader /> // Display loader while fetching watchlist
        ) : reversedWatchlist.length === 0 ? (
          <WatchlistNotFound />
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {reversedWatchlist.map((movieId, index) => (
              <div key={index} className="group relative">
                <MovieCard id={movieId} />
                {removingId === movieId ? ( // Render button conditionally based on removingId
                  <button
                    className="absolute top-2 right-2 text-white bg-gray-500 cursor-not-allowed px-4 py-2 rounded-full"
                    disabled
                  >
                    Removing...
                  </button>
                ) : (
                  <button
                    onClick={() => removeFromWatchlist(movieId)}
                    className="absolute top-2 right-2 text-white cursor-pointer bg-red-500 px-4 py-2 rounded-full hover:bg-red-600 transition duration-300"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
