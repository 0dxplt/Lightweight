const express = require('express');
const router = express.Router();
const controller = require('../controllers/pts.controller');

router.post('/from-city', controller.getPtsCity);

module.exports = router;