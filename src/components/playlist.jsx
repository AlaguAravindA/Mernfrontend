import React, { useState, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { onAuthStateChanged } from 'firebase/auth';
import Loader from './Loader.tsx'; // Import a Loader component
import { Link } from 'react-router-dom';
import { auth } from '../firebaseauth';
import noplay from './images/posters/undraw_my_password_re_ydq7.svg';

gsap.registerPlugin();

function Playlist() {
  const [playlistName, setPlaylistName] = useState('');
  const [playlistItems, setPlaylistItems] = useState([]);
  const [allplaylist, setAllPlaylist] = useState([]);
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [userNameemail, setUserNameemail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const extractUsername = (email) => {
    const match = email.match(/^([a-zA-Z0-9._%+-]+)@/);
    return match && match[1] ? match[1] : '';
  };

  let usernameemail = extractUsername(userNameemail);

  if (userName === '' && userNameemail != null) {
    // usernameemail = usernameemail;
  } else if (userName !== null && userNameemail === '') {
    usernameemail = userName;
  } else if (userName !== '' || userNameemail !== '') {
    usernameemail = userName;
  } else {
    console.log('some problem');
  }

  const fetchPlaylistData = useCallback(async () => {
   
    try {
      const response = await fetch(`https://cineback-0zol.onrender.com/playlist/all/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setAllPlaylist(data);
      } else {
        console.error('Error fetching playlist data');
      }
    } catch (error) {
      console.error('An error occurred while fetching playlist data:', error);
    }
  }, [userId]);

  const fetchUserPlaylists = useCallback(async () => {
    try {
      const response = await fetch(`https://cineback-0zol.onrender.com/playlist/user/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setPlaylistItems(data.playlists || []);
      } else {
        console.error('Error fetching user playlists');
      }
    } catch (error) {
      console.error('An error occurred while fetching user playlists:', error);
    }
  }, [userId]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserName(user?.displayName || '');
      setUserNameemail(user?.email || '');
      setUserId(user?.uid || '');
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      await fetchPlaylistData();
      await fetchUserPlaylists();
      setIsLoading(false);
    };

    fetchInitialData();
  }, [userId, fetchPlaylistData, fetchUserPlaylists]);

  const openModal = () => {
    setModalOpen(true);
    gsap.fromTo('.modal', { y: '-100%' }, { y: '0%', duration: 0.5, ease: 'power3.inOut' });
  };
  

  const closeModal = () => {
    gsap.to('.modal', {
      y: '-100%',
      duration: 0.5,
      ease: 'power3.inOut',
      onComplete: () => setPlaylistName(''),
    });
  };

  const handleInputChange = (e) => {
    setPlaylistName(e.target.value);
  };

  const handleCreatePlaylist = async () => {
    if (playlistName.trim() !== '') {
      setIsCreatingPlaylist(true);

      try {
        const response = await fetch('https://cineback-0zol.onrender.com/playlist/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userID: userId,
            username: usernameemail,
            PlaylistName: playlistName,
            movies: [],
          }),
        });
        

        if (response.ok) {
          await fetchUserPlaylists();
          await fetchPlaylistData();
        } else {
          console.error('Error creating playlist');
        }
      } catch (error) {
        console.error('An error occurred while creating playlist:', error);
      } finally {
        setIsCreatingPlaylist(false);
      }

      setPlaylistName('');
      closeModal();
    }
  };

  return (
    <>
      <div className="container mx-auto mt-8 p-8 bg-slate-500 bg-opacity-10 rounded-lg shadow-lg text-white">
        <h1 className="text-3xl font-bold mb-6">Cinesync Playlist Creator</h1>
        <button
          onClick={openModal}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          Create Playlist
        </button>

        {isLoading ? (
          <Loader /> // Display loader while fetching data
        ) : (
          <>
            {playlistItems.length === 0 ? (
              <div className="mt-6">
                <h2>No playlists found!!!</h2>
                <div className="flex flex-col items-center mt-4">
                  <p className="text-white text-2xl mb-4">
                    You don't have any playlists. Let's create one!
                  </p>
                  <img src={noplay} alt="Create Playlist" />
                </div>
              </div>
            ) : (
              <div className="mt-6">
                <h2 className="text-white text-2xl ml-2">Your Playlists:</h2>
                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {playlistItems.map((item, index) => (
                    <Link to={`detail/${item._id}`} className="block" key={index}>
                      <li
                        className="bg-gray-800 mt-4 p-4 rounded-lg shadow-md"
                        key={index}
                      >
                        <strong className="text-blue-500 ">{item.PlaylistName}</strong>
                      </li>
                    </Link>
                  ))}
                </ul>
              </div>
            )}

<div className={`modal fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 ${isModalOpen ? 'block' : 'hidden'}`}>
              <div className="modal-content bg-gray-700 p-8 rounded-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <h2 className="text-2xl font-bold mb-4">Create Playlist</h2>
                <label className="block mb-4">
                  <span className="text-gray-300">Playlist Name:</span>
                  <input
                    type="text"
                    value={playlistName}
                    onChange={handleInputChange}
                    className="block w-full mt-1 p-3 bg-gray-600 text-white rounded text-lg"
                  />
                </label>
                <div className="flex justify-end">
                  <button
                    onClick={handleCreatePlaylist}
                    className="bg-blue-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    disabled={isCreatingPlaylist} // Disable the button while creating
                  >
                    {isCreatingPlaylist ? 'Creating...' : 'Create'}
                  </button>
                  <button
                    onClick={closeModal}
                    className="ml-4 bg-gray-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-white text-2xl font-bold ml-2">Newly Added Playlists:</h2>
              <ul className="list-disc pl-8 mt-5">
                {allplaylist.map((item, index) => (
                  <Link to={`detail/${item._id}`} className="text-blue-500 " key={index}>
                    <li className="mb-4 text-white bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center">
                      <div>
                        <strong className="text-2xl">{item.PlaylistName}</strong>
                        <p className="text-sm mt-2 text-gray-400">
                          Created by <strong>{item.username}</strong> , {item.createdAt}
                        </p>
                      </div>
                    </li>
                  </Link>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Playlist;
