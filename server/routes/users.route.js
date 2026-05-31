const express = require('express');
const router = express.Router();
const controller = require('../controllers/users.controller');
const { route } = require('./esercizi.route');

router.get('/:username', controller.getUser);
router.get('/:username/followers', controller.getFollowers);
router.get('/:username/followings', controller.getFollowings);
router.get('/:followerId/follow/:otherId', controller.follow);
router.get('/:followerId/unfollow/:otherId', controller.unfollow);

module.exports = router;