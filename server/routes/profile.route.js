const express = require('express');
const router = express.Router();
const controller = require('../controllers/profile.controller');

const canAccessProfile = require('../middlewares/profile.middleware');

router.post('/update', canAccessProfile, controller.update);
router.post('/follows', canAccessProfile, controller.follows);
router.post('/change-password', canAccessProfile, controller.changePassword);

module.exports = router;