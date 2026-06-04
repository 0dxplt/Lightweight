const express = require('express');
const router = express.Router();
const controller = require('../controllers/imgs.controller');

router.get('/users', controller.getAvatar);
router.get('/global-icon/:level', controller.getGlobalLevelIcon);
router.get('/seasonal-icon/:profileId', controller.getSeasonalLevelIcon);

module.exports = router;