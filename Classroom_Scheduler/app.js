/*Node Modules
*These are the external modules brought in for this application.
* The main modules used are xlsx, fs, j2xls, and underscore
* xlsx is an excel parser
* fs is used with j2xls to write the output
* underscore is used for sorting and managing lists/objects
 */
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
var j2xls = require('json2xls');
var u = require('underscore');
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

//Get Methods below -- These methods populate the jade pages with proper data.

app.get('/generateSchedule', function(req,res){
    dbactions.getClassGroup(false, function(classbytime){
        dbactions.getClassroom(false, function(rooms){
            var sorted =    u._.sortBy(classbytime,function(data) {

                if (data.Start != null) {

                    var time = data.Start.split(" ");//split class start time by time and AM or PM
                    var timesep = time[0].split(":");//split time based on : markers
                    var actualtime = (timesep[0] * 3600);
                    if (time[1] === 'PM' && timesep[0] != 12) {//check if AM or PM..if PM add 12 hours to the time
                        actualtime = actualtime + (12 * 3600);
                    }
                    if (timesep[1] != 00) {//check the minutes for start time
                        actualtime = actualtime + (timesep[1] * 60);
                    }
                    if (timesep[2] != 00) {//Check the seconds for comparison
                        actualtime = actualtime + (timesep[2]);
                    }

                }
                else
                    var actualtime = 0;//in case of no class time(totally online sections, typos, etc)

                return actualtime;//this value will be compared against by the sortBy funtion of underscore js
            });

            var roomy = u._.sortBy(rooms, 'Max_Capacity');//Get rooms sorted from smallest to largest
            var roomdata = roomy.reverse();//get max capacity down to smallest
            var schedule = [];//schedule to be added to database
            var notadded =[];//groups that did not get added because of conflicts...they will need to be edited to work
            var CurrentTime = sorted[0].Start;//Set Current time of scheduling classes(i.e. start at 7 a.m. and get all classes at 7 a.m. to be worked in the schedule)

            var room_M = [];//Monday room list
            var room_T = [];//Tuesday room list
            var room_W = [];//Wednesday room list
            var room_R = [];//Thursday room list
            var room_F = [];//Friday room list
            var room_S = [];//Saturday room list
            for (x in roomdata) {//setup the 6 arrays for classrooms with the default being no start/end time
                room_M[x] = {"Room_Number": roomdata[x]["Room_Number"], "start": "", "end": ""};
                room_T[x] = {"Room_Number": roomdata[x]["Room_Number"], "start": "", "end": ""};
                room_W[x] = {"Room_Number": roomdata[x]["Room_Number"], "start": "", "end": ""};
                room_R[x] = {"Room_Number": roomdata[x]["Room_Number"], "start": "", "end": ""};
                room_F[x] = {"Room_Number": roomdata[x]["Room_Number"], "start": "", "end": ""};
                room_S[x] = {"Room_Number": roomdata[x]["Room_Number"], "start": "", "end": ""};
            }

            /* iterate through class listing to assign rooms*/
            for(var x = 0; x < sorted.length; x++){
                if(sorted[x].Start == CurrentTime){
                    findroom(sorted[x]);
                }
                else{
                    CurrentTime = sorted[x].Start;//this can be used to insert other priorities for a group...right now it is first come first serve
                    //at this point you know all the rooms for the current time slot and can reorder them for whatever priority you want(say biggest capacity, name, teacher, etc.)
                    findroom(sorted[x]);
                }

            }
            function assign( roomnum, classinfo){
                var index, object;
                var days = classinfo.Days.split("");//split to get days
                for ( var x =0; x < days.length; x++) {
                    switch (days[x]) {
                        case 'M'://Case Monday
                            object = u._.findWhere(room_M,{"Room_Number":roomnum});//get copy of element
                            index = u._.indexOf(room_M,object);//get index of element
                            room_M[index]={"Room_Number": roomnum, "start": classinfo.Start, "end": classinfo.End};//add class to index location of that day
                            break;
                        case 'T':
                            object = u._.findWhere(room_T,{"Room_Number":roomnum});
                            index = u._.indexOf(room_T,object);
                            room_T[index]= {"Room_Number": roomnum, "start": classinfo.Start, "end": classinfo.End};
                            break;
                        case 'W':
                            object = u._.findWhere(room_W,{"Room_Number":roomnum});
                            index = u._.indexOf(room_W,object);
                            room_W[index] = {"Room_Number": roomnum, "start": classinfo.Start, "end": classinfo.End};
                            break;
                        case 'R':
                            object = u._.findWhere(room_R,{"Room_Number":roomnum});
                            index = u._.indexOf(room_R,object);
                            room_R[index] = {"Room_Number": roomnum, "start": classinfo.Start, "end": classinfo.End};
                            break;
                        case 'F':
                            object = u._.findWhere(room_F,{"Room_Number":roomnum});
                            index = u._.indexOf(room_F,object);
                            room_F[index] = {"Room_Number": roomnum, "start": classinfo.Start, "end": classinfo.End};
                            break;
                        case 'S':
                            object = u._.findWhere(room_S,{"Room_Number":roomnum});
                            index = u._.indexOf(room_S,object);
                            room_S[index] = {"Room_Number": roomnum, "start": classinfo.Start, "end": classinfo.End};
                            break;
                        default:
                            console.log("should not reach this");

                    }
                }
            }

            function findroom(classinfo) {
                var inserted = false;
                var possiblerooms = u._.filter(roomy, function(room){//allowed rooms for this class group are only allowed to be larger than or equal to max_capacity of the group
                    return room.Max_Capacity >= classinfo.Class_Capacity;
                });

                var output = u._.sortBy(possiblerooms, 'Max_Capacity');//get the rooms from smallest to largest capacity that work for this specific class

                for(var x = 0; x < output.length; x++){//go through each group and try all available rooms until either you run out of rooms or find the room of best fit
                    if(checkAvailable(output[x].Room_Number,classinfo)){
                        assign(output[x].Room_Number,classinfo);
                        schedule[schedule.length+1] = {"Room_Number" : output[x].Room_Number,"Classes" : classinfo}
                        inserted = true;//group was inserted
                        break;//no need to continue looking
                    }
                }
                if(!inserted){//if group was not inserted push to list to be printed at end of schedule
                    notadded[notadded.length+1] = classinfo;
                }

            }

            function checkAvailable(roomnumber,classinfo){
                var check;//value of the room in question, used with all the room arrays
                var days = classinfo.Days.split("");//split to get days
                var y = true;//start off with everything before was true
                for ( var x =0; x < days.length; x++){
                    if(!y) {
                        return false;//if one day fails then the room at this timeframe does not work, don't continue to look
                    }
                    switch( days[x]){//Switch statment to check every day the course is in session
                        case 'M':
                            check = u._.find(room_M,function(data){ return data.Room_Number == roomnumber;});
                            y = checkTime(classinfo.Start, check);
                            break;
                        case 'T':
                            check = u._.find(room_T,function(data){ return data.Room_Number == roomnumber;});
                            y = checkTime(classinfo.Start, check);
                            break;
                        case 'W':
                            check = u._.find(room_W,function(data){ return data.Room_Number == roomnumber;});
                            y = checkTime(classinfo.Start, check);
                            break;
                        case 'R':
                            check = u._.find(room_R,function(data){ return data.Room_Number == roomnumber;});
                            y = checkTime(classinfo.Start, check);
                            break;
                        case 'F':
                            check = u._.find(room_F,function(data){ return data.Room_Number == roomnumber;});
                            y = checkTime(classinfo.Start, check);
                            break;
                        case 'S':
                            check = u._.find(room_S,function(data){ return data.Room_Number == roomnumber;});
                            y =  checkTime(classinfo.Start, check);
                            break;
                        default:
                            console.log("should not reach this");

                    }
                }
                return true;//No problems with mismatched classes
            }

            function checkTime(starttime, roominfo ){// check if the class is starting after the last class for this room
                var start = getvalue(starttime);//temp variable for comparisons--it represents the time in a single integer format
                var end = getvalue(roominfo.end);//temp variable for comparisons
                if( start >= end){
                    return true;//classroom is open take it
                }
                else{
                    return false;//classroom is taken go to next best fit.
                }


            }
            function getvalue(oldtime){//Old time is time in the format HH:MM:SS AM/PM for Hours minutes and seconds... no values are changed with this function
                if(oldtime != "") {
                    var time = oldtime.split(" ");//split class start time by time and AM or PM
                    var timesep = time[0].split(":");//split time based on : markers
                    var actualtime = (timesep[0] * 3600);
                    if (time[1] === 'PM' && timesep[0] != 12) {//check if AM or PM..if PM add 12 hours to the single integer time
                        actualtime = actualtime + (12 * 3600);
                    }
                    if (timesep[1] != 00) {//check the minutes for start time...have to be careful with javascript as concatenate and add are the same symbol
                        actualtime = actualtime + (timesep[1] * 60);
                    }
                    if (timesep[2] != 00) {//If you really want to you can even look at the start times and check the seconds
                        actualtime = actualtime + (timesep[2]);
                    }
                }
                else
                    actualtime = 0;

                // console.log(actualtime);
                return actualtime;//this is time as a single int for comparisons
            }

            var xls;
            xls = j2xls(u._.compact(notadded));//list of groups not able to be inserted at the current time

            fs.writeFileSync('NotAdded.xlsx', xls, 'binary');//create the excel file

            dbactions.insertSched(u._.compact(schedule));//add non-null entries to the database
            res.download('NotAdded.xlsx');//download the excel file not sure why it doesn't stay on top of the window, but it does download
            res.redirect('/calendar');//to view the schedule hour to hour

        });




    });
});





//Not Needed delete after auto-insert is done
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


app.get('/automateSchedule', function(req, res){
    var g;
    var classy;
    var array;
    var validstart;
    var validend;

    dbactions.getClassroom(false, function(rooms) {   //obtains a list of all the classes
        dbactions.getClassStart(false, function (data) {   //Obtains an order of all the classes based on start time
            for (var x in data) {
                console.log(data[x].Class_Time.Start);
            }
                for (x in data) {
              if (data[x].Class_Time != "" && data[x].Class_Time.Start != "") {  //Does not assign rooms to classes without any time assigned
                  var days = data[x].Class_Time.Days.split('');
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
                  var endMinute = parseInt(start[1]); //gets the total minutes
                  if (endMinute % 15 != 0) {
                      endMinute -= (endMinute % 15);
                  }
                  var endAP = (end[2].split(' ')[1] == 'AM') ? 'A' : 'P';
                  classy = "";
                  for (var y in rooms) {   //Loop through all possible rooms
                      for (var day in days) {  //Loop through each day to check for a valid solution
                          validstart = dbactions.RoomAvailability(rooms[y]._id, rooms[y], startHour, startMinute, startAP, days[day])  //check that starting position is valid
                          console.log(validstart);
                          validend = dbactions.RoomAvailability(rooms[y]._id, rooms[y], endHour, endMinute, endAP, days[day])  //check that the ending position is valid
                          console.log(validend);
                          if (validstart != -1 && validend != -1)  //If a day doesn't work, go on to the next room and try again
                              break;
                      }
                      if (validstart != -1 && validend != -1) {  //If a solution was found in the previous loop
                          data[x].Room_Assigned = rooms[y].Room_Number;
                          for (var day in days) {
                              if (day == 0) {
                                  dbactions.AssignClass(rooms[y]._id, rooms[y], data[x].Course_ID, validstart, validend, days[day], function () {
                                  });
                              }
                          }
                          dbactions.updateClass(data[x]._id, data[x], function() {   //Give room Assignment to class and update it
                          });
                          dbactions.updateClassroom(rooms[y]._id, rooms[y], function() {  //Pass the class assigned to the room to the timeslots
                          });
                          break;
                      }
                      else {
                          continue;  //Check next room if possible
                      }
                  }
                }
              }
          res.render('automateSchedule', {classes: data, rooms: rooms, title: "class"});
        });
    });
});

/*unassignSchedule
 * Created by: Kenneth Thomas
 * Parameters:
 *   1) the request parameter given by the jade file
 *   2) the res which is the paramater used to kill.
 * Returns: Nothing
 * Description:
 *   Yhis function 0's out the Room Assigned and the availability of all rooms to make the scheduler start over from scratch.*/
app.get('/unassignSchedule', function(req, res){
    dbactions.getClassStart(false, function (data) {
        for (x in data) {
            data[x].Room_Assigned = "";  //blanks Room assigned
            dbactions.updateClass(data[x]._id, data[x], function () {   //changes class to reflect changes
                //empty for return
            });
        }
      res.redirect('/');
    });
    dbactions.getClassroom(false, function(rooms) {  //brings back list of all classrooms
        for (y in rooms) {
            dbactions.updateClassroomAssigns(rooms[y]._id,rooms[y],function(){
                //empty for return
            });
        };

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


//Post Methods Below -- These are the actions to modify the database



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
  dbactions.getClassroomByNumber(class_data.Room_Assigned, function(rooms) {
     console.log(rooms.Room_Number);
  })
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
