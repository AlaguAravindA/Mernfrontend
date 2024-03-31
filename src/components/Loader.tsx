import React, { useEffect, useState } from 'react';
import '../components/styles/Loader.css';

const Loader = () => {
  const [loadingTooLong, setLoadingTooLong] = useState(false);
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    // Set a timeout to show the text after a certain duration
    const timeout = setTimeout(() => {
      setLoadingTooLong(true);
    }, 12000); // Change the duration as needed (in milliseconds)

    // Clean up the timeout to prevent memory leaks
    return () => clearTimeout(timeout);
  }, []); // Empty dependency array ensures the effect runs only once

  useEffect(() => {
    // Intervals to update the text index with increasing time spans
    const interval = setInterval(() => {
      setTextIndex(prevIndex => (prevIndex + 1) % 5); // Switch between 0 to 4
    }, 4000); // Repeat every 4 seconds

    // Clean up the interval to prevent memory leaks
    return () => clearInterval(interval);
  }, []); // Empty dependency array ensures the effect runs only once

  return (
    <div className='loader-container'>
      <div className="loader-backdrop">
        <svg className="pl" viewBox="0 0 100 100" width="100" height="100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="pl-grad1" x1="1" y1="0.5" x2="0" y2="0.5">
              <stop offset="0%" stopColor="hsl(313,90%,55%)" />
              <stop offset="100%" stopColor="hsl(223,90%,55%)" />
            </linearGradient>
            <linearGradient id="pl-grad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(313,90%,55%)" />
              <stop offset="100%" stopColor="hsl(223,90%,55%)" />
            </linearGradient>
          </defs>
          <circle className="pl__ring" cx="50" cy="50" r="41" fill="none" stroke="url(#pl-grad1)" strokeWidth="18" strokeDasharray="0 129 0.5 129" strokeDashoffset="0.01" strokeLinecap="round" transform="rotate(-90,50,50)" />
          <line className="pl__ball" stroke="url(#pl-grad2)" x1="50" y1="9" x2="50.01" y2="91" strokeWidth="18" strokeDasharray="0.5 82" strokeLinecap="round" />
        </svg>
       

      {loadingTooLong && (
        <div className='text-container'>
          {textIndex === 1 && <p className='text-gray-50'>Loading is taking too long. Please wait...</p>}
          {textIndex === 2 && <p className='text-gray-50'>Fetching Movies of Your Favorites.</p>}
          {textIndex === 3 && <p className='text-gray-50'>Wandering through reel realms... Keep calm and wait for the magic to load!</p>}
          {textIndex === 4 && <p className='text-gray-50'>Doing Something... 🤫</p>}
          {textIndex === 0 && <p className='text-gray-50'>Still Doing Something... 🤫</p>}
        </div>
      )}
      </div>
    </div>
  );
};

export default Loader;
