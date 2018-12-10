const express = require('express');
const router = express.Router();

//login
router.use('/', require('./login.js'));

module.exports = router;