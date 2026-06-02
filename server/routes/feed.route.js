const express = require("express");
const router = express.Router();
const controller = require('../controllers/feed.controller.js');

router.get('/myfeed', controller.getUserFeed);

module.exports = router;