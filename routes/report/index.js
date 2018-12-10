const express = require('express');
const router = express.Router();

//router.use('/stu', require('./stu.js'));
router.use('/', require('./report.js'));

//router.use('/pro', require('./pro.js'));
//router.use('/form', require('./form.js'));

module.exports = router;