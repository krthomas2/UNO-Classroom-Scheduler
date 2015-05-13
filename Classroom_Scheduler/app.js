var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var xlsx = require('xlsx');
var routes = require('./routes/index');
var users = require('./routes/users');
var multer  = require('multer');
var dbactions = require('./public/javascripts/DB_Transactions.js');
var fs = require('fs');
//var j2xls = require('json2xls');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use(multer({ dest: './uploads/'}));

//Get Methods below
app.get('/calendar', function(req, res){
  dbactions.getClassroom(false, function(data){
    res.render('calendar', {rooms: data,title: "Calendar"});
  });
});
app.get('/addgroup',function(req,res){
  dbactions.getClass(false,function(data){
    var courses;
    for(x in data){
      courses : data[x];
      console.log(courses);

    }
    res.render('addgroup',{classys: data.unique, classys2: data,title:"Groups"});
  });
});
app.get('/editroom',function(req,res){
  dbactions.getClassroom(false,function(data){
    res.render('editroom',{rooms: data, title:"Rooms"});
  });
});
app.get('/editclass',function(req,res){
  dbactions.getClass(false,function(data){
    res.render('editClass',{rooms: data, title:"rooms"});
  });
});
app.get('/getRoomInfo', function(req, res){//set values for class room data
  dbactions.getClassroom(req.query.room_number, function(class_ids){
     res.send(class_ids);
  });
});
app.get('/getClassInfo', function(req, res){//set values for class room data
  dbactions.getClass(req.query.id, function(data){
    res.send(data);
  });
});

app.get('/getCalendarInfo', function(req, res){
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

app.get('/getremoveroom', function(req, res){
  dbactions.getClassroom(false, function(data){
    res.render('removeroom', {rooms: data, title: "Rooms"});
  });
});

app.get('/getremoveclassy', function(req, res){
  dbactions.getClass(false, function(data){
    res.render('removeclassy', {rooms: data,title: "Classes"});
  });
});
app.get('/automateSchedule', function(req, res){
    var g;
    var classy;

    dbactions.getClassroom(false, function(starter) {
        dbactions.getClassStart(false, function (data) {
            for (var y in starter) {
                dbactions.updateClassroomAssigns(starter[y]._id, starter[y], function (starter) {
                });
            }
            dbactions.updateClassroomAssigns(false, function(rooms) {
                for (x in data) {
              if (data[x].Class_Time != "" && data[x].Class_Time.Start != "") {
                  var placeholder = "Class_Time"
                  var days = data[x].Class_Time.Days;  //.split('');
                  var start = data[x].Class_Time.Start.split(':'); //Match either a space or a colon. Will result in a 4 piece string.
                  console.log(start);
                  var startHour = parseInt(start[0]); //gets the number for the hour
                  var startMinute = parseInt(start[1]); //gets the number for the minute
                  if (startMinute % 15 != 0) {
                      startMinute -= (startMinute % 15);
                  }
                  var startAP = (start[2].split(' ')[1] == 'AM') ? 'A' : 'P';
                  var end = data[x].Class_Time.End.split(':'); //Match either a space or a colon. Will result in a 4 piece string.
                  var endHour = parseInt(end[0]); //gets the number for the hour
                  classy = "";
                  // if (data[x].Class_Time.Start != null) {
                  console.log(data[x].placeholder = 12);
                  data[x].Room_Assigned = 102;
                  dbactions.updateClass(data[x]._id, data[x], function () {
                      //empty for return
                  });
                  //  }
                  for (y in room) {
                      console.log(room[y].Room_Number);
                  }
                }
              }
          });
          res.render('automateSchedule', {classes: data, rooms: room, title: "class"});
        });
    });
});

app.get('/unassignSchedule', function(req, res){
    dbactions.getClassStart(false, function (data) {
        for (x in data) {
            data[x].Room_Assigned = "";
            dbactions.updateClass(data[x]._id, data[x], function () {
                //empty for return
            });
        }
      res.redirect('/');
    });
});

app.get('/clearScheduler', function(req, res){
  dbactions.clearScheduler(function(){
    res.redirect('/');
  });
});

 // dbactions.getClass(false, function(data){
 //   res.render('editSchedule', {rooms: data,title: "Classes"});
//})
//);

app.get('/downloadSchedule', function(req, res) {
  var classy;
  var jsonObjs;
  var y = 0;
  var groupy ="";
  var roomy ="";

  dbactions.getClass(false, function (data) {
    dbactions.getSchedule(false,function(room) {
      dbactions.getClassGroup(false,function(group){
        for (x in data) {
          group = "";
          /*   dbactions.getClassGroup(false,function(group){
           for(x in group)
           if(group[x]._id == data[x]._id) {
           group = 'C';
           }
           })*/
          roomy = "";
          groupy ="";
          for (y in room) {//wish I could just get index of
            if (room[y].class_id.equals(data[x]._id)) {
              roomy = room[y].Room_Number;
              break;
            }
            else {
              //move along this is not the data you are looking for
            }
          }
          for( z in group) {//wish I could just get index of
            if(group[x].Class_ID.equals(data[x]._id)){
              groupy = 'C';
              break;
            }
          }


          data[x] = ({
            "ClassNbr": data[x].Class_ID,
            Subject: data[x].Subject,
            Catalog: data[x].Course_ID,
            "Section": data[x].Section_ID,
            "Combined Section": groupy,
            "Title": data[x].Course_Title,
            "Descr": data[x].Description,
            "Acad Group": data[x].Acad_Group,
            "Cap Enrl": data[x].Class_Capacity,
            "Tot Enrl": data[x].Tot_Enrl,
            "Pat": data[x].Class_Time.Days,
            "MtgStart": data[x].Class_Time.Start,
            "MtgEnd": data[x].Class_Time.End,
            "Last": data[x].Instructor.Last_Name,
            "First Name": data[x].Instructor.First_Name,
            "Start Date": data[x].Start_Date,
            "End Date": data[x].End_Date,
            Session: data[x].Session,
            Location: data[x].Location,
            Mode: data[x].Mode,
            "CrsAtr Val": data[x].CrsAtr_Val,
            "Component": data[x].Lecture_Type,
            "Room Number": roomy
          });
        }
        var xls = j2xls(data);

        fs.writeFileSync('Scheduler.xlsx', xls, 'binary');
        res.download('Scheduler.xlsx');
      });
      });

//stays on page with link, but downloads excel file
  });
});
//Post Methods Below


app.post('/addRoom', function(req,res){
  dbactions.insertClassroom(req.body,function(){
  //empty function for callback
  });
  res.redirect('/rooms');
});
app.post('/addClass', function(req,res){
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

app.post('/editClassData', function(req,res){
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

app.post('/runScheduler', function(req,res){
  console.log(req.body);
  console.log("cheeseburger!")

  var class_data = {
    "_id": req.body._id,
    "Course_ID": req.body.Catalog,
    "Lecture_Type": req.body.Component,
    "Class_Time": {
      "Start": req.body.MtgS,
      "End": req.body.MtgE,
      "Days": req.body.Pat
    },
    "Class_Capacity": req.body.Cap,
    "Mode": req.body.Mode,
    "CrsAtr_Val": req.body.CrsAtr_Val,
    "Room_Assigned": req.body.Room_Assigned
  };
    dbactions.getAllClass(false, function (data) {
        console.log(req.body._id);
    });
    console.log("cheeseburger in paradise!")
    res.redirect('/createSchedule');
});


app.post('/editRoomdata',function(req,res){
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
app.post('/editScheduledata', function(req,res){
  res.redirect('/');//should go to scheduler page when added
  dbactions.updateSched(req.body.room_id,req.body,function(){
    //empty function for callback
  });
});

app.post('/automateScheduleData', function(req,res){
    res.redirect('/createSchedule');//should go to scheduler page when added
    dbactions.getClass(req.body.class_id,function(){
        //empty function for callback
    });
});
app.post('/removeroomdata', function(req,res){
  res.redirect('/rooms');//should go to scheduler page when added
  dbactions.removeClassroom(req.body.room_id,function(){
    //empty function for callback
  });
});
app.post('/removeclassydata', function(req,res){
  res.redirect('/classes');//should go to scheduler page when added
  dbactions.removeClassroom(req.body.class_id,function(){
    //empty function for callback
  });
});

app.post('/', function(req, res, next) {
  var temp_path = req.files.filer.path;
  var wb,wsname,ws,put;//local variables for parsing the document
  if(req.files.filer.extension == 'xlsx') {//type xlsx
    if('uploads/ScheduleOld.xlsx'!=null)
    {
      fs.unlink('uploads/ScheduleOld.xlsx',function(err){//remove old schedule if it exists
        //if(err) throw err;
      });
    }
    if('uploads/ScheduleOld.xls'!=null)
    {
      fs.unlink('uploads/ScheduleOld.xls',function(err){//remove old schedule if it exists
        //if(err) throw err;
      });
    }
    wb = xlsx.readFile(req.files.filer.path);//create the workbook
    wsname = wb.SheetNames[0];//get the first sheet name
    ws = wb.Sheets[wsname];//get the first sheet data
    put = xlsx.utils.sheet_to_json(ws);//convert data to json
    fs.rename(temp_path,'uploads/ScheduleOld.xlsx',function(err){
      if(err) throw err;
    });
    dbactions.importExcelToDb(put);
  }
  else if(req.files.filer.extension =='xls'){//same as above just creates a .xls file in uploads vs .xlsx
    if('uploads/ScheduleOld.xls'!=null)
    {
      fs.unlink('uploads/ScheduleOld.xls',function(err){//remove old schedule if it exists
        //if(err) throw err;
      });
    }
    if('uploads/ScheduleOld.xlsx' != null)//remove any other schedule format
    {
      fs.unlink('uploads/ScheduleOld.xlsx',function(err){
        //if(err) throw err;
      });
    }
    wb = xlsx.readFile(req.files.filer.path);
    wsname = wb.SheetNames[0];
    ws = wb.Sheets[wsname];
    put = xlsx.utils.sheet_to_json(ws);
    fs.rename(temp_path,'uploads/ScheduleOld.xls',function(err){
      if(err) throw err;
    });
    dbactions.importExcelToDb(put);
  }
  else{//if file is not xlsx or xls then don't delete the old schedule, but delete the temp file of what was just uploaded
    fs.unlink(temp_path,function(err){
      if(err) throw err;
    });
  }
  res.redirect('/createSchedule');

});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
