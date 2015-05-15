var express = require('express');
var router = express.Router();
var dbactions = require('../public/javascripts/DB_Transactions.js');


/* Get methods get a jade view to show the user
 * Post methods push data to the database as post is more secure than get.
 */
/**
 * @class index.js
 * @description
 * The routes for the application
 */
/**
 * @function calendar
 * @description
 * Gets the calendar page and populates it with room choices
 */
router.get('/calendar', function(req, res){
  dbactions.getClassroom(false, function(data){
    res.render('calendar', {rooms: data,title: "Calendar"});
  });
});
/**
 * @function getCalendarInfo
 * @description
 * Get the calendar info for the all class-groups in the specified room
 */
router.get('/getCalendarInfo', function(req, res){
  var class_list = [];
  dbactions.getScheduleByRoom(true, req.query.room_number, function(class_ids){
    for (var x = 0; x < class_ids.length; x++) {
        class_list.push(classInfo);
        if (class_ids.length == class_list.length) {
          res.send(class_list);
        }
      }

  });
});

/**
 * @function home
 * @description
 * Get the application Home page.  This is where we envision UNO user logins to happen to control who has access to the scheduler menu.
 */
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

/**
 * @function editSchedule
 * @description
 * Gets the edit Schedule page
 */
/* GET edit schedule page. */
router.get('/editSchedule', function(req, res, next) {
  res.render('editSchedule', { title: 'Groups' });
});
/**
 * @function downloadOldSchedule
 * @description
 * Downloads the schedule that was uploaded for 3rd party comparison.
 */
router.get('/downloadOldSchedule', function(req,res,next){
  res.download('./uploads/ScheduleOld.xlsx');
});


/**
 * @function upload
 * @description
 * Routes to the upload Schedule page.
 */
/* GET Upload Page. */
router.get('/upload', function(req, res, next) {
  res.render('upload', { title: 'Upload' });
});

/* Classes CRUD Operations */
/**
 * @function classes
 * @description
 * Get the actions for classes page. Add/Edit/Remove
 */
  /* GET Classes Page with choices for add/edit/remove */
router.get('/classes', function(req, res, next) {
  res.render('classes', { title: 'Classes' });
});
/**
 * @function getaddclass
 * @description
 * Gets the form for adding a new class.
 */
    /* Class add page */
router.get('/getaddclass', function(req, res, next) {
  res.render('addclass', { title: 'Classes' });
});
/**
 * @function addClass
 * @description
 * Adds the new class data to the database
 */
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
/**
 * @function editclass
 * @description
 * Loads the edit class page where the user is prompted to pick a class ID # to edit.
 */
/* Class edit page */
router.get('/editclass',function(req,res){
  dbactions.getClass(false,function(data){
    res.render('editClass',{rooms: data, title:"rooms"});
  });
});
/**
 * @function getClassInfo
 * @description
 * Gets the classinformation for the selected class
 */
      /* Get specified class information for edit page */
router.get('/getClassInfo', function(req, res){//set values for class room data
  dbactions.getClass(req.query.id, function(data){
    res.send(data);
  });
});
/**
 * @function editClassData
 * @description
 * Sends the new data for the specified class to update the old entry.
 */
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
/**
 * @function getremoveclassy
 * @description
 * Gets the remove classes page. used classy as the name as class is not safe for a variable.
 */
    /* Remove class page */
router.get('/getremoveclassy', function(req, res){
  dbactions.getClass(false, function(data){
    res.render('removeclassy', {rooms: data,title: "Classes"});
  });
});
/**
 * @function removeclassydata
 * @description
 * Remove Specified class from database.
 */
      /* Remove specified class from database */
router.post('/removeclassydata', function(req,res){
  res.redirect('/classes');//should go to scheduler page when added
  dbactions.removeClassroom(req.body.class_id,function(){
    //empty function for callback
  });
});
/* End of Classes CRUD operations */

/* Groups Crud Operations */
/**
 * @function editgroup
 * @description
 * Renders the edit group page with the group data for selecting a group from a dropdown to populate the group fields.
 */
  /* GET edit group page. */
router.get('/editgroup', function(req, res, next) {
  dbactions.getClassGroup(false, function(data){
    res.render('editgroup', { title: 'Groups' , groups: data});
  });
});
/**
 * @function getGroupInfo
 * @description
 * Get the specified group information.
 */
    /*get edit group info for edit page */
router.get('/getGroupInfo', function(req,res,next){
  dbactions.getClassGroup(req.query.id, function(data){
    res.send(data);
  });
});
/**
 * @function editGroupData
 * @description
 * Send data to database for changed group
 */
    /*Send data to database for changed group*/
router.post('/editGroupData', function(req,res){
  var id = req.body._id;
  delete req.body._id;//remove id to make push to database easier
  dbactions.updateClassGroups(id,req.body, function(){
    //blank for callback
  });
  res.redirect('/editGroup');
});
/* End of Groups CRUD operations */
/**
 * @function createSchedule
 * @description
 * Automate the Schedule.
 */
/* Schedule Crud Operations */
  /* GET Create Schedule. */
router.get('/createSchedule', function(req, res, next) {
  res.render('createSchedule', { title: 'Scheduler' });
});
/**
 * @function getScheduleInfo
 * @description
 * Populate the Manual Schedule Edit page with the data matching the record to be edited.
 */
      /*get edit schedule info for edit page */
router.get('/getScheduleInfo', function(req,res,next){
  dbactions.getSchedule(req.query.id, function(data){
    res.send(data);
  });
});
/**
 * @function editScheduleData
 * @description
 * Send the updated schedule information to the database
 */
     /*Send data to database for changed schedule*/
router.post('/editScheduleData', function(req,res){
  var id = req.body._id;
  delete req.body._id;//remove id to make push to database easier
  dbactions.updateSched(id,req.body, function(){
    //blank for callback
  });
  res.redirect('/createSchedule');
});
/* End of Schedule CRUD operations */


/* Rooms CRUD Operations */
/**
 * @function rooms
 * @description
 * Get the Add/Edit/Remove page for rooms
 */
  /* Classroom Page with choices for add/edit/remove */
router.get('/rooms', function(req, res, next) {
  res.render('rooms', { title: 'Rooms' });
});
/**
 * @function getaddroom
 * @description
 * Gets the form for adding a new room
 */
    /* Classroom add page*/
router.get('/getaddroom', function(req, res, next) {
  res.render('addroom', { title: 'Rooms' });
});
/**
 * @function addRoom
 * @description
 * Adds new room to database
 */
      /* Send newly added classroom information to database */
router.post('/addRoom', function(req,res){
  dbactions.insertClassroom(req.body,function(){
    //empty function for callback
  });
  res.redirect('/rooms');
});
/**
 * @function editroom
 * @description
 * Gets the edit room form.
 */
    /* Classroom edit page */
router.get('/editroom',function(req,res){
  dbactions.getClassroom(false,function(data){
    res.render('editroom',{rooms: data, title:"Rooms"});
  });
});
/**
 * @function getRoomInfo
 * @description
 * Gets the specified room information for edit page
 */
      /* Get specified room information for edit page */
router.get('/getRoomInfo', function(req, res){//set values for class room data
  dbactions.getClassroom(req.query.room_number, function(class_ids){
    res.send(class_ids);
  });
});
/**
 * @function editRoomdata
 * @description
 * Sends the updated room data to the database.
 */
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
/**
 * @function getremoveroom
 * @description
 * Gets the remove classroom page with dropdown list of classrooms.
 */
    /* Remove classroom page */
router.get('/getremoveroom', function(req, res){
  dbactions.getClassroom(false, function(data){
    res.render('removeroom', {rooms: data, title: "Rooms"});
  });
});
/**
 * @function removeroomdata
 * @description
 * Remove the specified room from the database
 */
      /* Remove classroom from database */
router.post('/removeroomdata', function(req,res){
  res.redirect('/rooms');//should go to scheduler page when added
  dbactions.removeClassroom(req.body.room_id,function(){
    //empty function for callback
  });
});
/* End of rooms CRUD operations */





/* Clear the Schedule */
router.get('/clearSchedule', function(req, res){
  dbactions.clearSchedule(function(){
    res.redirect('/createSchedule');
  });
});

/* Purge database */
router.get('/clearScheduler', function(req, res){
  dbactions.clearScheduler(function(){
    res.redirect('/');
  });
});
module.exports = router;

