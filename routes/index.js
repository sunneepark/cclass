var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// auth
router.use('/auth', require('./auth/index'));
// usr
router.use('/usr', require('./usr/index'));
// report
router.use('/report', require('./report/index'));

module.exports = router;
