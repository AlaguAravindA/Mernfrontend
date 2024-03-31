const express = require('express');
const router = express.Router();
const moviesdata = require('../models/movie');

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = 25;  // Set the number of movies per page to 25
    const maxRecords = 9000;  // Limit the total number of records to 1000
    const genreString = req.query.genres || '';

    // Check if genres are provided
    if (genreString) {
      const formattedGenres = genreString.split('|').map(genre => genre.toLowerCase().charAt(0).toUpperCase() + genre.slice(1).toLowerCase());

      const regexQueries = formattedGenres.map(genre => ({
        genres: {
          $in: [
            new RegExp(`(^|\\|)${genre}(\\||$)`),
            genre
          ]
        }
      }));

      const query = (page === 1 || page <= 5) && formattedGenres.length > 0 ? { $or: regexQueries } : {};

      const [movies, totalMovies] = await Promise.all([
        moviesdata.find(query).select('id imdb_id original_title genres').skip((page - 1) * perPage).limit(perPage),
        moviesdata.countDocuments(query)
      ]);

      const totalPages = Math.ceil(Math.min(totalMovies, maxRecords) / perPage);

      res.json({
        items: movies,
        totalPages,
      });
    } else {
      const [movies, totalMovies] = await Promise.all([
        moviesdata.find().select('id imdb_id original_title genres').skip((page - 1) * perPage).limit(perPage),
        moviesdata.countDocuments()
      ]);

      const totalPages = Math.ceil(Math.min(totalMovies, maxRecords) / perPage);

      res.json({
        items: movies,
        totalPages,
      });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/randommovies', async (req, res) => {
  try {
    const numberOfRandomMovies = 5;

    // Specify the genres you want to include in the random selection
    const selectedGenres = ['Action', 'Adventure', 'Science Fiction', 'Thriller'];

    // Use MongoDB Aggregation Framework to get random movies with specified genres
    const randomMovies = await moviesdata.aggregate([
      { $match: { genres: { $in: selectedGenres } } }, // Add this stage to filter by genres
      { $sample: { size: numberOfRandomMovies } }
    ]);

    res.json({ randomMovies });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;
