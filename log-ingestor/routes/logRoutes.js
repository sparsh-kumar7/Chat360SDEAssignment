// logRoutes.js

const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');

router.post('/', logController.createLog);
router.post('/search',logController.searchLogs)

module.exports = router;
