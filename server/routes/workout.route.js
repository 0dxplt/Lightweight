const express = require('express');
const router = express.Router();
const controller = require('../controllers/workout.controller');

router.get('/:id', controller.getFullWorkout);
router.post('/save', controller.saveWorkout);

module.exports = router;