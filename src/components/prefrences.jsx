import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './styles/UserPreferences.css';
import Cookies from 'js-cookie'; // Import Cookies library

const genreData = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
];

const UserPreferences = () => {
  const [selectedGenre, setSelectedGenre] = useState('');
  const [isStoringPreference, setStoringPreference] = useState(false);
  const navigate = useNavigate();
  const { uid } = useParams();

  const handleGenreSelection = (genreId) => {
    setSelectedGenre(genreId);
  };

  const handleSelection = async () => {
    setStoringPreference(true); // Start loader
  
    try {                             
      const response = await fetch(`https://cineback-0zol.onrender.com/prefrences/setpref/${uid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pref: selectedGenre }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      
      Cookies.set(`${uid}`, selectedGenre, { expires: 7 }); // Set an expiration of 7 days
  
      setStoringPreference(false); // Stop loader
      // Navigate to home after storing the preference
      navigate('/');
    } catch (error) {
      console.error('Error storing preference:', error);
      setStoringPreference(false); // Stop loader in case of error
    }
  };
  

  useEffect(() => {
    // Fetch preference existence status
    fetch(`https://cineback-0zol.onrender.com/prefrences/${uid}`)
      .then((response) => response.json())
      // .then((data) => setHasPref(data.exists));
  }, [uid, selectedGenre]);

  return (
    <div className="user-preferences-container bg-transparent text-white p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl mb-6 font-semibold text-center">Select Your Preferences</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {genreData.map((genre) => (
          <div
            key={genre.id}
            className={`genre-card genre-${genre.id} ${selectedGenre === genre.id ? 'selected' : ''} mb-4 p-4 rounded-full overflow-hidden shadow-lg cursor-pointer`}
            onClick={() => handleGenreSelection(genre.id)}
          >
            <h3 className="text-xl mb-2 font-bold">{genre.name}</h3>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
       
        <button
          onClick={handleSelection}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline"
          disabled={!selectedGenre || isStoringPreference}
        >
          {isStoringPreference ? 'Storing...' : 'OK'}
        </button>
      </div>
    </div>
  );
};

export default UserPreferences;
