const express = require('express');
const router = express.Router();
const controller = require('../controllers/palestre.controller');

router.get('/', controller.getAllGyms);
router.post('/new', controller.addGym);

module.exports = router;