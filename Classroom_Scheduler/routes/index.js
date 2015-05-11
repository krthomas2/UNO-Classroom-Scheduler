var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

/* GET group page. */
router.get('/group', function(req, res, next) {
  res.render('group', { title: 'Groups' });
});

/* GET Upload Page. */
router.get('/upload', function(req, res, next) {
  res.render('upload', { title: 'Upload' });
});

/* GET AddClass Page */
router.get('/getaddclass', function(req, res, next) {
  res.render('addclass', { title: 'Classes' });
});

/* Get addRoom Page */
router.get('/getaddroom', function(req, res, next) {
  res.render('addroom', { title: 'Rooms' });
});

/* GET Preferences Page. */
router.get('/prefs', function(req, res, next) {
  res.render('prefs', { title: 'Request' });
});

/* GET Classroom Page. */
router.get('/rooms', function(req, res, next) {
  res.render('rooms', { title: 'Rooms' });
});

/* GET Classes Page. */
router.get('/classes', function(req, res, next) {
  res.render('classes', { title: 'Classes' });
});


/* GET Register Page. */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Express' });
});

/* GET Create Schedule. */
router.get('/createSchedule', function(req, res, next) {
  res.render('createSchedule', { title: 'Scheduler' });
});

/* GET Automate Schedule. */
router.get('/automateSchedule', function(req, res, next) {
  res.render('automateSchedule', { title: 'Express' });
});

/* GET Edit Schedule. */
router.get('/editSchedule', function(req, res, next) {
  res.render('editSchedule', { title: 'Rooms' });
});
/* GET Practice. */
router.get('/practice', function(req, res, next) {
  res.render('practice', { title: 'Express' });
});
module.exports = router;
