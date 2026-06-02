const express = require('express');
const router = express.Router();
const controller = require('../controllers/moderatori.controller');

router.get('/', controller.getAllModerators);
router.post('/update-session-validity', controller.updateSessionValidity);
router.post('/update-verify', controller.updateVerify);

module.exports = router;