const express = require('express');
const router = express.Router();
const controller = require('../controllers/sessioni.controller');

router.get('/:id/full', controller.getAllFullSessions);
router.get('/:id', controller.getSingleSession);

module.exports = router;