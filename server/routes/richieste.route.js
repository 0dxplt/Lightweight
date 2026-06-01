const express = require('express');
const router = express.Router();
const controller = require('../controllers/richieste.controller');

router.get('/full', controller.getAllFullRequests);
router.get('/count', controller.counter);
router.post('/approve', controller.approveRequest);
router.post('/reject', controller.rejectRequest);

module.exports = router;