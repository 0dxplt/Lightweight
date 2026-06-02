const express = require('express');
const router = express.Router();
const controller = require('../controllers/solved.controller');

router.get('/count', controller.counter);
router.get('/reports/full', controller.getFullSolvedReports);
router.get('/requests/full', controller.getFullSolvedRequests);

module.exports = router;