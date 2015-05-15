
/**Node Modules
*These are the external modules brought in for this application.
* The main modules used are xlsx, fs, j2xls, and underscore
* xlsx is an excel parser
* fs is used with j2xls to write the output
* underscore is used for sorting and managing lists/objects
 */
/**
 * Express is used for the routing, and generating of the starter application
 * @module express
 **/
/**
 * Path is used to get the location of other modules
 * @module path
 **/

/**
 * Morgan is used to create temporary files for upload/download
 * @module morgan
 **/

/**
 * Cookie-Parser is used by Express as part of the generation of the starter app
 * @module cookie-parser
 **/

/**
 * Body-Parser is used by Express as part of the generation of the starter app
 * @module body-parser
 *
 **/

/**
 * Xlsx is the Excel parsing module.  It has many outputs,
 * for this project the WS and _toJson are used.
 * @module xlsx
 **/

/**
 * Index JS is the main route handling module
 * @module index.js
 **/

/**
 * Is needed for file transfers
 * @module multer
 **/

 /**
 * This is the database transactions script,
 * it holds all the communication functions for the
 * app.
 * @module DB_Transactions.js
 **/

 /**
 * Is used to write the application
 * @module fs
 **/

/**
 *  Is used to turn the array of class information into
 * the final schedule.xlsx file
 * @module json2xls
 **/

/**
 * Is a very handy module that has many functions built in
 * to handle sorting, filtering of lists/objects
 * @module underscore
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



/*Schedule Algorithm follows */
/**
 * Generates the schedule based on
 * the groups and rooms.
 * Returns document of non added groups
 * @class generateSchedule
 */
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
            /**
             * @function assign
             * @param roomnum
             *
             *  The room to have the group-class added to it
             * @param classinfo
             *
             *  The class to be added to the room
             * @description
             * Takes an approved room number and group-class
             * and puts them in the schedule for the proper days.
             * This is used for adding other group-classes as data
             * to see if the room is open at this time.
             *
             */
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

            /**
             * @function findroom
             * @param classinfo
             *
             *  The class to find the room for
             * @description
             * findroom takes all the rooms available and sorts them by capacity
             * then it finds the smallest room available for the class in question.
             * There is no return, but it does generate a list of acceptable classrooms: that is classrooms that can hold this class.
             */
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

            /**
             * @function checkAvailable
             * @param roomnumber
             *
             *  The room to be checked
             * @param classinfo
             *
             *  The class to be checked
             * @returns {boolean}
             * True or False
             * @description
             * Checks if the room is available for all days and times that the class has a session.
             * Returns true for available and false for not available.
             */
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

            /**
             * @function checkTime
             * @param starttime
             *
             *  start time of the class to check the room for availability
             * @param roominfo
             *
             *  day array of the room in question
             * @returns {boolean}
             * True for open or False for closed/taken
             * @description
             * Checks the specific time of the day array to see if it is open.
             */
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

            /**
             * @function getvalue
             * @param oldtime
             *
             *  Time in the format of 10:00:00 AM
             * @returns {number}
             *  Time in the format 123456
             * @description
             * Takes time stamp and converts it to a single number for comparisons.
             */
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
                return actualtime;//this is time as a single int for comparisons
            }

            var xls;
            xls = j2xls(u._.compact(notadded));//list of groups not able to be inserted at the current time

            fs.writeFileSync('NotAdded.xlsx', xls, 'binary');//create the excel file

            dbactions.insertSched(u._.compact(schedule));//add non-null entries to the database
            res.download('NotAdded.xlsx');//download the excel file of groups that couldn't be added

        });




    });
});


/**
 * @class downloadSchedule
 * @description
 * Downloads data from the database in an excel file.
 */
app.get('/downloadSchedule', function(req, res) {
  var classy;
  var jsonObjs;
  var y = 0;
  var groupy ="";
  var roomy ="";
    var temp ="";
    var inst ="";
  dbactions.getClass(false, function (data) {
    dbactions.getSchedule(false,function(sched) {
      dbactions.getClassGroup(false,function(group){
        for (x in data) {
          group = "";
          roomy = "";
          groupy ="";//Everything is a group
           instr = data[x].Instructor.First_Name + " " + data[x].Instructor.Last_Name;
            for(y in group){
                if(group[y].Instructor ===  instr && group[y].Start === data[x].Class_Time.Start)//equality is not met for some reason
                    temp = group[y]._id;//keep track of group value
                    groupy ='C';//set group to yes
                    break;
            }
            var chek = u._.filter(sched,{"_id":temp._id});
            roomy = chek.Room_Number;//dependent on group id which is not getting caught at the moment
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
/* file upload */
/**
 * @class upload
 * @description
 * uploads the selected document from the client side to the server.  Makes sure only one document is stored at a time in the application and that it is of type xls or xlsx.
 */
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
