const express = require('express');
const router = express.Router();
const controller = require('../controllers/citta.controller');

router.get('/', controller.getAllCities);

module.exports = router;