const express = require('express');
const router = express.Router();
const controller = require('../controllers/workouts.controller');

router.get('/', controller.getWorkouts);

module.exports = router;