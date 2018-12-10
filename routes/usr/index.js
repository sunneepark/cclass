const express = require('express');
const router = express.Router();

router.use('/', require('./usr.js'));
router.use('/student', require('./student.js'));

module.exports = router;