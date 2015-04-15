var express = require('express');
var router = express.Router();

/* GET upload page. */
router.get('/', function(req, res, next) {
  res.render('upload', { title: 'Upload' });
});
module.exports = router;
