const express = require('express');
const router = express.Router();
const controller = require('../controllers/profile.controller');

const canAccessProfile = require('../middlewares/profile.middleware');
const antiCheat = require('../middlewares/anti-cheat.middleware');

const config = require('../config/env');
const multer = require('multer');
const path = require('path');
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

router.post('/update', upload.single('propic'), controller.update);
router.post('/follows', controller.follows);
router.post('/change-password', controller.changePassword);
router.post('/save-session', antiCheat, controller.saveSession);
router.post('/remove-session', controller.removeSession);
router.post('/update-session-visibility', controller.updateSessionVisibility);
router.post('/report-user', controller.reportUser);
router.post('/already-reported', controller.isAreadyReported);
router.post('/new-verify-request', controller.newRequest);

module.exports = router;