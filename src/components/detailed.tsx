import React, { useState, useEffect, useCallback } from "react";
import { StarIcon } from "@heroicons/react/20/solid";
import { useParams } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseauth";
import moviesimages from "../backend/moviesimg";
import CommentSection from "./comment";
import NotFound404 from "./404notfoun.jsx";
import Loader from "./Loader.tsx";

export default function Detailed() {
  const { id } = useParams();
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [userId, setUserId] = useState("");
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isAddingToWatchlist, setIsAddingToWatchlist] = useState(false);
  const [movieLoaded, setMovieLoaded] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [imageSrc, setImageSrc] = useState("");

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

  useEffect(() => {
    const setImg = async () => {
      try {
        const result = await moviesimages(id, "6dbdf27e3fb82e5b69b71a171310e6a3");
        setImageSrc(result);
      } catch (error) {
        console.error("Error fetching image:", error.message);
      }
    };

    setImg();
  }, [id]);

  useEffect(() => {
    fetch(`https://cineback-0zol.onrender.com/searchmovies/${id}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 404) {
          setMovieLoaded(true);
          setNotFound(true);
          throw new Error("Movie not found");
        } else {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      })
      .then((data) => {
        setSelectedMovie(data.items[0]);
        setMovieLoaded(true);
      })
      .catch((error) => {
        console.error("Error fetching movie details:", error);
      });
  }, [id]);

  if (!movieLoaded) {
    return <Loader />;
  }

  if (notFound) {
    return <NotFound404></NotFound404>;
  }

  return (
    <div className="container mt-4 mx-auto pt-10 bg-slate-50 bg-opacity-10 rounded-3xl ">
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
            {selectedMovie.genres}
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
              Release Year: <br />
            </p>
            <p className="text-gray-400 mr-2">{selectedMovie.release_year} </p>
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
            <p className="text-gray-400 mr-2">
              Director :<br />
            </p>
            <p className="text-gray-400 mr-2">
              <b>{selectedMovie.director}</b>{" "}
            </p>
          </div>
          <div className="flex items-center mb-6">
            <p className="text-gray-400 mr-2">
              Cast-members:
              <br />
            </p>
            <p className="text-gray-400 mr-2">
              <b>{selectedMovie.cast}</b>{" "}
            </p>
          </div>
          <div className="flex items-center mb-6">
            <p className="text-gray-400 mr-3">
              Production Companies:
              <span className="font-bold ml-2">
                {selectedMovie.production_companies}
              </span>{" "}
            </p>
          </div>

          <h2 className="text-xl font-bold text-gray-400 mb-4 mt-3">Description</h2>
          <p className="text-slate-100 mb-8">{selectedMovie.overview}</p>
          <button
            type="button"
            onClick={addToWatchlist}
            className={`bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              !userId
                ? "opacity-50 cursor-not-allowed"
                : isInWatchlist
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={!userId || isInWatchlist || isAddingToWatchlist}
          >
            {isAddingToWatchlist ? (
              <Loader /> 
            ) : (
              userId
                ? isInWatchlist
                  ? "Added to Watchlist"
                  : "Add to Watchlist"
                : "Login to Add to Watchlist"
            )}
          </button>
        </div>
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
