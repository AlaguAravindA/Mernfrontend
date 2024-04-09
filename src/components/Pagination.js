import React from 'react';
import { ArrowRightIcon,ArrowLeftIcon } from '@heroicons/react/20/solid';


const Pagination = ({ currentPage, totalPages, onPageChange }) => {

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <nav className="flex items-center justify-center space-x-4 my-8">
      {/* Previous button */}
      <button
        className={`relative rounded-full inline-flex items-center justify-center w-10 h-10 text-sm font-semibold ${
          currentPage === 1
            ? 'pointer-events-none bg-gray-300 text-gray-600'
            : 'text-gray-600 bg-gray-200 hover:bg-gray-300'
        }`}
        onClick={() => {
          onPageChange(currentPage - 1);
          scrollToTop(); // Smooth scroll to top
        }}
        disabled={currentPage === 1}
      >
         <ArrowLeftIcon className="h-5 w-5" />
      </button>

      {/* Current page number */}
      <span className="flex items-center rounded-full justify-center w-10 h-10 text-sm font-semibold bg-indigo-600 text-white">
        {currentPage}
      </span>

      {/* Next button */}
      <button
        className={`relative rounded-full inline-flex items-center justify-center w-10 h-10 text-sm font-semibold ${
          currentPage === totalPages
            ? 'pointer-events-none bg-gray-300 text-gray-600'
            : 'text-gray-600 bg-gray-200 hover:bg-gray-300'
        }`}
        onClick={() => {
          onPageChange(currentPage + 1);
          scrollToTop(); // Smooth scroll to top
        }}
        disabled={currentPage === totalPages}
      >
        <ArrowRightIcon className="h-5 w-5" />
      </button>
    </nav>
  );
};

export default Pagination;
