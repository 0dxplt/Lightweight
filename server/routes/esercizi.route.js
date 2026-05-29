const express = require('express');
const router = express.Router();
const controller = require('../controllers/esercizi.controller');

router.get('/', controller.getAllExercises);

module.exports = router;