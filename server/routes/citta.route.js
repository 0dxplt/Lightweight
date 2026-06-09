const express = require('express');
const router = express.Router();
const controller = require('../controllers/citta.controller');

router.get('/', controller.getAllCities);
router.get('/full', controller.getAllFullCities);
router.get('/pts', controller.getAllCitiesPts);
router.get('/by-name/:cityName', controller.getByName);
router.post('/get-or-insert', controller.getOrInsert);

module.exports = router;