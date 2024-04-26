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

      if (!isButtonClick && !isDropdownClick) {
        setShowDropdown(false);
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
    
  } else if (userName !== null && userNameemail === "") {
    usernameemail = userName;
  }


  const handleClick = ()=>{
   if(searchQuery.trim()!== ''){

     historys("/search-results/" + searchQuery);
    }
  };

  const handleKeyDown = (event) => {
    // Check if the pressed key is the Enter key (key code 13)
   
    if (event.keyCode === 13) {
      // Call your desired function here
     handleClick();
    }
  };
  
  
  useEffect(() => {
    key.filter = function(event) {
      // Allow keymaster to work only when input element is not focused
      const tagName = (event.target || event.srcElement).tagName;
      const editable =
        tagName === "INPUT" ||
        tagName === "SELECT" ||
        tagName === "TEXTAREA" ||
        (event.target || event.srcElement).isContentEditable;
      return !editable;
    };
  
    key("alt+enter", function() {
      const searchBox = document.getElementById("searchbox");
      if (searchBox) {
        searchBox.focus();
      }
      return false; // Prevent the default action
    });
  
    return () => {
      key.unbind("alt+enter");
    
    };
  }, []);
  
  

  
  

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
              placeholder="Alt+Enter to Search."
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
