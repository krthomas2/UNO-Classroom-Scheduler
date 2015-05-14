var express = require('express');
var router = express.Router();
var dbactions = require('../public/javascripts/DB_Transactions.js');





router.get('/calendar', function(req, res){
  dbactions.getClassroom(false, function(data){
    res.render('calendar', {rooms: data,title: "Calendar"});
  });
});

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
/* Classes CRUD Operations */
  /* GET Classes Page with choices for add/edit/remove */
router.get('/classes', function(req, res, next) {
  res.render('classes', { title: 'Classes' });
});
    /* Class add page */
router.get('/getaddclass', function(req, res, next) {
  res.render('addclass', { title: 'Classes' });
});
    /* Class edit page */
router.get('/editclass',function(req,res){
  dbactions.getClass(false,function(data){
    res.render('editClass',{rooms: data, title:"rooms"});
  });
});
      /* Get specified class information for edit page */
router.get('/getClassInfo', function(req, res){//set values for class room data
  dbactions.getClass(req.query.id, function(data){
    res.send(data);
  });
});
    /* Remove class page */
router.get('/getremoveclassy', function(req, res){
  dbactions.getClass(false, function(data){
    res.render('removeclassy', {rooms: data,title: "Classes"});
  });
});
/* End of Class CRUD operations */


/* Room CRUD Operations */
  /* Classroom Page with choices for add/edit/remove */
router.get('/rooms', function(req, res, next) {
  res.render('rooms', { title: 'Rooms' });
});
    /* Classroom add page*/
router.get('/getaddroom', function(req, res, next) {
  res.render('addroom', { title: 'Rooms' });
});
      /* Send newly added classroom information to database */
router.post('/addRoom', function(req,res){
  dbactions.insertClassroom(req.body,function(){
    //empty function for callback
  });
  res.redirect('/rooms');
});
    /* Classroom edit page */
router.get('/editroom',function(req,res){
  dbactions.getClassroom(false,function(data){
    res.render('editroom',{rooms: data, title:"Rooms"});
  });
});
      /* Get specified room information for edit page */
router.get('/getRoomInfo', function(req, res){//set values for class room data
  dbactions.getClassroom(req.query.room_number, function(class_ids){
    res.send(class_ids);
  });
});
      /* Send changed room data to database */
router.post('/editRoomdata',function(req,res){
  var room_data = {
    "Room_Number": req.body.Room_Number,
    "Max_Capacity": req.body.Max_Cap,
    "Spec_Trait": req.body.Spec
  };
  dbactions.updateClassroom(req.body.Room_ID,room_data,function(){
    //empty for return
  });
  res.redirect('/rooms');
});
    /* Remove classroom page */
router.get('/getremoveroom', function(req, res){
  dbactions.getClassroom(false, function(data){
    res.render('removeroom', {rooms: data, title: "Rooms"});
  });
});
      /* Remove classroom from database */
router.post('/removeroomdata', function(req,res){
  res.redirect('/rooms');//should go to scheduler page when added
  dbactions.removeClassroom(req.body.room_id,function(){
    //empty function for callback
  });
});
/* End of CRUD for rooms */
/* GET Preferences Page. */
router.get('/prefs', function(req, res, next) {
  res.render('prefs', { title: 'Request' });
});






/* GET Register Page. */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Express' });
});

/* GET Create Schedule. */
router.get('/createSchedule', function(req, res, next) {
  res.render('createSchedule', { title: 'Scheduler' });
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
