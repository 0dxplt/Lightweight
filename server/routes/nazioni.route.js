const express = require('express');
const router = express.Router();
const controller = require('../controllers/nazioni.controller');

router.get('/', controller.getAllNations);
router.get('/:id', controller.getNationFromID);

module.exports = router;