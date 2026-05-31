const express = require('express');
const router = express.Router();
const controller = require('../controllers/users.controller');

router.post('/change-password', controller.changePassword);
router.get('/:username', controller.getUser);
router.get('/:username/followers', controller.getFollowers);
router.get('/:username/followings', controller.getFollowings);

module.exports = router;