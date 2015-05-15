var express = require('express');
var router = express.Router();
var dbactions = require('../public/javascripts/DB_Transactions.js');


/* Get methods get a jade view to show the user
 * Post methods push data to the database as post is more secure than get.
 */


router.get('/calendar', function(req, res){
  dbactions.getClassroom(false, function(data){
    res.render('calendar', {rooms: data,title: "Calendar"});
  });
});

router.get('/getCalendarInfo', function(req, res){
  var class_list = [];
  dbactions.getClassroomByNumber(req.query.room_number, function(class_ids){
    for (var x = 0; x < class_ids.length; x++) {
      dbactions.getClass(class_ids[x]["class_id"], function (classInfo) {
        class_list.push(classInfo);
        if (class_ids.length == class_list.length) {
          res.send(class_list);
        }
      });
    }
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

      /* Send the new class to the database*/
router.post('/addClass', function(req,res){
  var class_data = {
    "Subject": req.body.Subject,
    "Course_ID": req.body.Catalog,
    "Section_ID": req.body.Section,
    "Class_ID": req.body.Class,
    "Course_Title": req.body.Title,
    "Lecture_Type": req.body.Component,
    "Class_Time": {
      "Start": req.body.MtgS,
      "End": req.body.MtgE,
      "Days": req.body.Pat
    },
    "Instructor": {
      First_Name: req.body.First,
      Last_Name: req.body.Last
    },
    "Class_Capacity": req.body.Cap,
    "Description": req.body.Descr,
    "Acad_Group": req.body.Acad,
    "Tot_Enrl": req.body.Tot,
    "Start_Date": req.body.Start,
    "End_Date": req.body.End,
    "Session": req.body.Session,
    "Location": req.body.Location,
    "Mode": req.body.Mode,
    "CrsAtr_Val": req.body.CrsAtr_Val,
    "Group_ID": req.body.Class
  };
  dbactions.insertClass(class_data, function(){
    //empty for return
  });
  res.redirect('/classes');
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
      /* Send edit class data to the database */
router.post('/editClassData', function(req,res){
  var class_data = {
    "Subject": req.body.Subject,
    "Course_ID": req.body.Catalog,
    "Section_ID": req.body.Section,
    "Class_ID": req.body.Class,
    "Course_Title": req.body.Title,
    "Lecture_Type": req.body.Component,
    "Class_Time": {
      "Start": req.body.MtgS,
      "End": req.body.MtgE,
      "Days": req.body.Pat
    },
    "Instructor": {
      First_Name: req.body.First,
      Last_Name: req.body.Last
    },
    "Class_Capacity": req.body.Cap,
    "Description": req.body.Descr,
    "Acad_Group": req.body.Acad,
    "Tot_Enrl": req.body.Tot,
    "Start_Date": req.body.Start,
    "End_Date": req.body.End,
    "Session": req.body.Session,
    "Location": req.body.Location,
    "Mode": req.body.Mode,
    "CrsAtr_Val": req.body.CrsAtr_Val,
    "Room_Assigned": req.body.Room_Assigned,
    "Group": req.body.group
  };
  dbactions.updateClass(req.body._id,class_data,function(){
    //empty for return
  });
  res.redirect('/classes');
});
    /* Remove class page */
router.get('/getremoveclassy', function(req, res){
  dbactions.getClass(false, function(data){
    res.render('removeclassy', {rooms: data,title: "Classes"});
  });
});
      /* Remove specified class from database */
router.post('/removeclassydata', function(req,res){
  res.redirect('/classes');//should go to scheduler page when added
  dbactions.removeClassroom(req.body.class_id,function(){
    //empty function for callback
  });
});
/* End of Classes CRUD operations */


/* Rooms CRUD Operations */
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
/* End of rooms CRUD operations */


/* GET Create Schedule. */
router.get('/createSchedule', function(req, res, next) {
  res.render('createSchedule', { title: 'Scheduler' });
});

/* GET Edit Schedule. */
router.get('/editSchedule', function(req, res, next) {
  res.render('editSchedule', { title: 'Rooms' });
});
/* Clear the Schedule */
router.get('/clearSchedule', function(req, res){
  dbactions.clearSchedule(function(){
    res.redirect('/createSchedule');
  });
});
/* GET Practice. */
router.get('/practice', function(req, res, next) {
  res.render('practice', { title: 'Express' });
});
module.exports = router;

/* Purge database */
router.get('/clearScheduler', function(req, res){
  dbactions.clearScheduler(function(){
    res.redirect('/');
  });
});