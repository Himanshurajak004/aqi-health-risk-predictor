var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ message: 'Backend is running' });
});

/* Test ping route */
router.get('/ping', function (req, res) {
  res.json({ status: 'ok', message: 'Ping successful' });
});

module.exports = router;
