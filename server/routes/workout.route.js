const express = require('express');
const router = express.Router();
const controller = require('../controllers/workout.controller');

const canAccessWorkout = require("../middlewares/workout.middleware");

router.post('/', canAccessWorkout, controller.getFullWorkout);
router.post('/save', canAccessWorkout, controller.saveWorkout);
router.post('/delete', canAccessWorkout, controller.deleteWorkout);

module.exports = router;