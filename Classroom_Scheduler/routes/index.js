var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET Upload Page. */
router.get('/upload', function(req, res, next) {
  res.render('upload', { title: 'Express' });
});

/* GET AddClass Page */
router.get('/getaddclass', function(req, res, next) {
  res.render('addclass', { title: 'Express' });
});

/* Get addRoom Page */
router.get('/getaddroom', function(req, res, next) {
  res.render('addroom', { title: 'Express' });
});

/* GET Preferences Page. */
router.get('/prefs', function(req, res, next) {
  res.render('prefs', { title: 'Express' });
});

/* GET Classroom Page. */
router.get('/rooms', function(req, res, next) {
  res.render('rooms', { title: 'Express' });
});

/* GET Classes Page. */
router.get('/classes', function(req, res, next) {
  res.render('classes', { title: 'Express' });
});


/* GET Classes Page. */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Express' });
});
module.exports = router;
