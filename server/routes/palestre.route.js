const express = require('express');
const router = express.Router();
const controller = require('../controllers/palestre.controller');

router.get('/', controller.getAllGyms);

module.exports = router;