const express = require('express');
const router = express.Router();
const controller = require('../controllers/citta.controller');

router.get('/', controller.getAllCities);
router.get('/full', controller.getAllFullCities);

module.exports = router;