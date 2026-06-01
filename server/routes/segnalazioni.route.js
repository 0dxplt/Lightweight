const express = require('express');
const router = express.Router();
const controller = require('../controllers/segnalazioni.controller');

router.get('/full', controller.getAllFullReports);
router.post('/confirm-report', controller.confirmReport);

module.exports = router;