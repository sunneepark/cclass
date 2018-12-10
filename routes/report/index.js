const express = require('express');
const router = express.Router();

router.use('/list', require('./list.js'));
router.use('/', require('./report.js'));

router.use('/feedback', require('./feedback.js'));
router.use('/form', require('./form.js'));

module.exports = router;