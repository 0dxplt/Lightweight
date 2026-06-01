const express = require('express');
const router = express.Router();
const controller = require('../controllers/ranking.controller');

router.get('/global', controller.getGlobalRankings);
router.get('/seasonal', controller.getSeasonalRankings);

module.exports = router;