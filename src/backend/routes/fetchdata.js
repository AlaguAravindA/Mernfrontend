const express = require('express');
const router = express.Router();
const Watchlist = require('../models/watchlist');

router.get('/:uid/:movieid', async (req, res) => {
  try {
    const uid = req.params.uid;
    const movieId = req.params.movieid;

    // Find the watchlist for the specified user ID
    const userWatchlist = await Watchlist.findOne({ userId: uid });

    if (!userWatchlist || userWatchlist.watchlist.length === 0) {
      return res.status(404).send("<h1 className='text-white' >No Watchlist found</h1>");
    }

    // Check if the specified movie is in the watchlist
    const isInWatchlist = userWatchlist.watchlist.includes(movieId);

    // Send the result in the response
    res.status(200).json({ isInWatchlist });
  } catch (error) {
    console.error('Error checking watchlist in the movie:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
