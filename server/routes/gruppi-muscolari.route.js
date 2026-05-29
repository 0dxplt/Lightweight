const express = require('express');
const router = express.Router();
const controller = require('../controllers/gruppi-muscolari.controller');

router.get('/', controller.getAllMuscolarGroups);

module.exports = router;