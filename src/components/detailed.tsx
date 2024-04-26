import React, { useState, useEffect, useCallback } from "react";
import { StarIcon } from "@heroicons/react/20/solid";
import { useParams, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseauth";
import moviesimages from "../backend/moviesimg";
import CommentSection from "./comment";
import NotFound404 from "./404notfoun.jsx";
import Loader from "./Loader.tsx";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import ErrorModal from "./auth/errorModal.tsx";


export default function Detailed() {
  const { id } = useParams();
  const history = useNavigate();
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [userId, setUserId] = useState("");
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isAddingToWatchlist, setIsAddingToWatchlist] = useState(false);
  const [movieLoaded, setMovieLoaded] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [trailerUrl, setTrailerUrl] = useState([]);
  // const [error, setError] = useState(null);
  const [errorModal, setErrorModal] = useState(false);

  const checkWatchlist = useCallback(async () => {
    try {
      if (!userId) {
        return;
      }
      const response = await fetch(
        `https://cineback-0zol.onrender.com/watchlist/fetchWatchlist/${userId}/${id}`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch watchlist information. Status: ${response.status}`
        );
      }

      const data = await response.json();
      setIsInWatchlist(data.isInWatchlist);
    } catch (error) {
      console.error("Error checking watchlist:", error.message);
      
    }
  }, [userId, id]);

  //trailers
  useEffect(() => {
    const apiKey = "6dbdf27e3fb82e5b69b71a171310e6a3";
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setSelectedMovie(data);
        setMovieLoaded(true);

        // Fetch trailer
        const trailerResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}&language=en-US`
        );
        if (trailerResponse.ok) {
          const trailerData = await trailerResponse.json();
          if (trailerData.results.length > 0) {
            const filteredTrailers = trailerData.results.filter(
              (resultdata) =>
                resultdata.type === "Trailer" &&
                (resultdata.name.includes("Official Trailer") ||
                  resultdata.name.includes("Trailer"))
            );
           
            setTrailerUrl(filteredTrailers);
          }
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
        setNotFound(true);
        
        
      }
    };

    fetchData();
  }, [id]);

  const addToWatchlist = useCallback(async () => {
    try {
      if (!userId) {
        console.warn("User is not logged in. Cannot add to watchlist.");
        return;
      }

      setIsAddingToWatchlist(true);
   

      const response = await fetch(
        `https://cineback-0zol.onrender.com/watchlist/addtowatchlist/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: id }),
        }
      );

      if (response.ok) {
        const data = await response.json();

        if (data.error) {
          console.error("Error adding movie to watchlist:", data.error);
        } else {
          setIsInWatchlist(true);
          console.log("Movie added to watchlist successfully");
        }
      } else {
        console.error(
          "Error checking watchlist. Server returned:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error checking watchlist:", error.message);
    } finally {
      setIsAddingToWatchlist(false);
    }
  }, [userId, id]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid || "");
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    checkWatchlist();
  }, [checkWatchlist]);

  const apiKey = "6dbdf27e3fb82e5b69b71a171310e6a3";
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setSelectedMovie(data);
        setMovieLoaded(true);
      } catch (error) {
        console.error("Error fetching movie details:", error);
        setNotFound(true);
      }
    };

    fetchData();
  }, [id, apiKey]);

  useEffect(() => {
    const setImg = async () => {
      try {
        const result = await moviesimages(
          id,
          "6dbdf27e3fb82e5b69b71a171310e6a3"
        );
        setImageSrc(result);
      } catch (error) {
        console.error("Error fetching image:", error.message);
      }
    };

    setImg();
  }, [id]);

  const handleBackClick = () => {
    history("/");
  };

  if (!movieLoaded) {
    return <Loader />;
  }

  if (notFound) {
    return <NotFound404 />;
  }
  const handleCloseModal = () => {
    setErrorModal(false);
  };

  return (
    <div className="container mt-4 mx-auto pt-10 bg-slate-50 bg-opacity-10 rounded-3xl relative">
      {errorModal && <ErrorModal errorMeassge={error} onclose={handleCloseModal}/> }
      <button
        className="absolute top-4 left-4 bg-gray-800 text-white px-2 py-2 mb-4 rounded-full focus:outline-none"
        onClick={handleBackClick}
      >
        <ArrowLeftIcon className="h-5 w-5" />
      </button>
      <div className="flex p-4 flex-col lg:flex-row justify-center items-center gap-8">
        <div className="aspect-w-2 aspect-h-3 w-full lg:w-1/3 lg:max-w-md">
          <img
            src={imageSrc}
            alt={selectedMovie.original_title}
            className="object-cover w-full h-full rounded-2xl shadow-lg"
          />
        </div>
        <div className="flex-1 p-4">
          <h1 className="text-3xl font-bold text-gray-100 mb-4">
            {selectedMovie.original_title}
          </h1>
          <p className="text-gray-100 mb-2">
            <span className="text-gray-400 font-bold">Genres:</span>{" "}
            <span className="flex flex-wrap gap-2">
              {selectedMovie.genres.map((genre, index) => (
                <span
                  key={index}
                  className="bg-gray-600 px-3 py-1 rounded-full text-sm text-white"
                >
                  {genre.name}
                </span>
              ))}
            </span>
          </p>

          <div className="flex items-center mb-6">
            <p className="text-gray-400 mr-2">
              Rating: <br />
            </p>
            <SingleStarRating rating={parseFloat(selectedMovie.vote_average)} />
          </div>
          <div className="flex items-center mb-6">
            <p className="text-gray-400 mr-2">
              Runtime: <br />
            </p>
            <p className="text-gray-400 mr-2">{selectedMovie.runtime} min</p>
          </div>

          <div className="flex items-center mb-6">
            <p className="text-gray-400 mr-2">
              Release Date: <br />
            </p>
            <p className="text-gray-400 mr-2">
              <b>{selectedMovie.release_date}</b>{" "}
            </p>
          </div>

          <div className="flex items-center mb-6">
            <p className="text-gray-400 mr-3">
              Production Companies:
              <span className="font-bold ml-2">
                {selectedMovie.production_companies
                  .map((company) => company.name)
                  .join(", ")}
              </span>{" "}
            </p>
          </div>

          <h2 className="text-xl font-bold text-gray-400 mb-4 mt-3">
            Description
          </h2>
          <p className="text-slate-100 mb-8">{selectedMovie.overview}</p>
          <button
          
            type="button"
            onClick={addToWatchlist}
            className={`bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              !userId || isInWatchlist || isAddingToWatchlist
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={!userId || isInWatchlist || isAddingToWatchlist}
          >
            {isAddingToWatchlist ? (
             "Adding to Watchlist"

            ) : userId ? (
              isInWatchlist ? (
                "Added to Watchlist"
              ) : (
                "Add to Watchlist"
              )
            ) : (
              "Login to Add to Watchlist"
            )}
          </button>
        </div>
      </div>
      <div className="container mt-4 mx-auto pt-10 bg-slate-50 bg-opacity-10 rounded-3xl p-4">
        <h2 className="text-xl font-bold text-gray-400 mb-4 mt-3">
          Watch Trailer
        </h2>
        {trailerUrl && trailerUrl.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {trailerUrl.map((trailer, index) => (
              <div
                key={index}
                className="aspect-w-16 aspect-h-9 overflow-hidden"
              >
                <iframe
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title={`Trailer ${index + 1}`}
                  allowFullScreen
                  style={{ padding: "10px" }} // Add padding to increase size
                ></iframe>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No trailers available</p>
        )}
      </div>

      <CommentSection imdb_id={id}></CommentSection>
    </div>
  );
}

const SingleStarRating = ({ rating }) => {
  return (
    <div className="flex items-center">
      <StarIcon className="h-6 w-6 text-yellow-400" />
      <p className="ml-2 text-gray-400">{rating}</p>
    </div>
  );
};
