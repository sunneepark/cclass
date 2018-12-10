const express = require('express');
const router = express.Router();

router.use('/', require('./usr.js'));

module.exports = router;