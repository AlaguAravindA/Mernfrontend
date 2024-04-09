import React from 'react'

export default function upcomings() {
    return (
        <div className="bg-transparent">
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
            {errors ? (
              <div className="text-center text-gray-600">
                <p>No movies found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                {isLoading ? (
                  <Loader />
                ) : (
                  movies.map((movie) => (
                    <MovieCard key={movie.id} id={movie.id} title={movie.title} />
                  ))
                )}
              </div>
            )}
          </div>
          <BackToTopButton />
          {!errors && (
            <div className="bottom-16 sm:flex sm:flex-1 sm:items-center sm:justify-center">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
          )}
        </div>
      );
}
