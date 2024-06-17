import React, { useState, useEffect, useRef } from "react";
import imgsrc from "./images/c.png";
import key from 'keymaster';
import { Link } from "react-router-dom";  
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebaseauth.js";
import logout from "./images/logout.svg";
import pref from "./images/pref.svg";
const Cookies = require('js-cookie');

export default function Navbar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userName, setUserName] = useState("");
  const [userNameemail, setUserNameemail] = useState("");
  const [userId, setUserId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [isLoader, setIsLoader] = useState(false);
  const historys = useNavigate();
  const dropdownRef = useRef(null);
  const searchBoxRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isButtonClick = (event.target as HTMLElement).closest(
        ".text-slate-400"
      );
      const isDropdownClick =
        dropdownRef.current &&
        dropdownRef.current.contains(event.target as Node);
      const isSearchBoxClick = searchBoxRef.current && searchBoxRef.current.contains(event.target as Node);

      if (!isButtonClick && !isDropdownClick && !isSearchBoxClick) {
        setShowDropdown(false);
        setFilteredSuggestions([]);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setUserName(user?.displayName || "");
      setUserNameemail(user?.email || "");
      setUserId(user?.uid || "");
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      if (userId) {
        Cookies.remove(userId);
      }

      historys("/home");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handlePrefrence = () => {
    historys(`/pref/${userId}`);
  };

  const extractUsername = (email) => {
    const match = email.match(/^([a-zA-Z0-9._%+-]+)@/);
    return match && match[1] ? match[1] : "";
  };

  let usernameemail = extractUsername(userNameemail);

  if (userName === "" && userNameemail !== null) {
    usernameemail = extractUsername(userNameemail);
  } else if (userName !== null && userNameemail === "") {
    usernameemail = userName;
  }

  const handleClick = () => {
    setFilteredSuggestions([]);
    if (searchQuery.trim() !== '') {
      searchBoxRef.current.blur(); // Remove focus from search input
      historys("/search-results/" + searchQuery);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setFilteredSuggestions([]);
    setSearchQuery(suggestion);
    searchBoxRef.current.blur(); // Remove focus from search input
    // historys("/search-results/" + suggestion);
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      handleClick();
    }
  };

  useEffect(() => {
    key.filter = function (event) {
      const tagName = (event.target || event.srcElement).tagName;
      const editable =
        tagName === "INPUT" ||
        tagName === "SELECT" ||
        tagName === "TEXTAREA" ||
        (event.target || event.srcElement).isContentEditable;
      return !editable;
    };

    key("alt+enter", function () {
      const searchBox = document.getElementById("searchbox");
      if (searchBox) {
        searchBox.focus();
      } else {
        setShowDropdown(false);
      }
      return false; // Prevent the default action
    });

    return () => {
      key.unbind("alt+enter");
    };
  }, []);

  const fetchData = async () => {
    if (searchQuery.trim() === "") {
      setFilteredSuggestions([]);
      return;
    }

    setIsLoader(true);
    try {
      const url = `https://api.themoviedb.org/3/search/movie?query=${searchQuery}&include_adult=false&language=en-US&page=1`;
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZGJkZjI3ZTNmYjgyZTViNjliNzFhMTcxMzEwZTZhMyIsInN1YiI6IjY1ODkxNzA0MDcyMTY2NjdlNGE1YmFlYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.cgxsdMCxOIZQVpHLyfNR8uPNGLZtiAy0ZdwNJnJ7aFI'
        }
      };

      const response = await fetch(url, options);
      const data = await response.json();
      setFilteredSuggestions(data.results.map(movie => movie.title));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoader(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchQuery]);

  return (
    <div className="bg-opacity-10 bg-slate-200 backdrop-blur-md z-auto">
      <nav className="flex items-center justify-between p-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="sr-only">CinéSync</span>
            <img className="h-16 w-auto rounded-full" src={imgsrc} alt="" />
          </Link>
        </div>
        <div className="lg:hidden items-center">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              setMobileMenuOpen(!isMobileMenuOpen);
            }}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-6">
          <Link to="/watchlist" className="text-sm font-semibold leading-6 text-slate-400 hover:text-sky-400">
            WatchList
          </Link>
          <Link to="/playlist" className="text-sm font-semibold leading-6 text-slate-400 hover:text-sky-400">
            Playlists
          </Link>
        </div>
        <div className="lg:flex lg:flex-1 lg:justify-end items-center text-sm font-semibold leading-6 text-slate-400 hover:text-sky-400">
          <div className="relative mx-3">
            <input
              ref={searchBoxRef}
              type="text"
              id="searchbox"
              className="py-2 px-4 border rounded-md focus:outline-none focus:border-transparent focus:ring-4 focus:ring-violet-900 transition duration-300"
              placeholder={isMobileMenuOpen ? 'Search..' : "Alt+Enter to Search"}
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
            />
            <button
              className="absolute right-0 top-0 h-full px-3"
              disabled={searchQuery === ""}
              onClick={handleClick}
            >
              <svg
                className="h-5 w-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M21 21l-5.2-5.2" />
                <circle cx="10" cy="10" r="8" />
              </svg>
            </button>
            {filteredSuggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {filteredSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {isLoggedIn ? (
          <div className="relative inline-block text-left">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-slate-400 hover:text-sky-400"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              Profile
              <span className="ml-1" aria-hidden="true">
                &rarr;
              </span>
            </button>
            {showDropdown && (
              <div ref={dropdownRef} className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  <div className="block px-4 py-2 text-sm text-left text-gray-700">
                    Welcome, <br /> <b>{usernameemail}</b>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full max-w-xs mx-auto px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center"
                    role="menuitem"
                    style={{ height: "40px", width: "150px" }}
                  >
                    <img src={logout} alt="Logout" className="mr-2" style={{ height: "20px", width: "20px" }} />
                    Logout
                  </button>
                  <button
                    onClick={handlePrefrence}
                    className="block w-full max-w-xs mx-auto px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center"
                    role="menuitem"
                    style={{ height: "40px", width: "150px" }}
                  >
                    <img src={pref} alt="Change Preference" className="mr-2" style={{ height: "20px", width: "20px" }} />
                    Change Preference
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link to={"/login"} className="text-sm font-semibold leading-6 text-slate-400 hover:text-sky-400">
            Log in <span aria-hidden="true">&rarr;</span>
          </Link>
        )}
      </nav>
      {isMobileMenuOpen && (
        <div className="bg-gray-500 py-2 top-0 right-0">
          <Link to="/Watchlist" className="block px-4 py-2 text-sm font-semibold text-white hover:bg-gray-600">
            WatchList
          </Link>
          <Link to="/playlist" className="block px-4 py-2 text-sm font-semibold text-white hover:bg-gray-600">
            Playlists
          </Link>
        </div>
      )}
    </div>
  );
}
