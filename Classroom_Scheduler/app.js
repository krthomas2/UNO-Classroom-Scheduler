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

app.get('/getCalendarInfo', function(req, res){
  console.log(req.query.room_number);
  dbactions.getClassroomByNumber(req.query.room_number, function(class_ids){
    console.log(class_ids);
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

app.get('/editSchedule', function(req, res){
  dbactions.getClass(false, function(data){
    res.render('editSchedule', {rooms: data});
  });
});


//Post Methods Below

app.post('/addUser', function(req,res){
//res.send("You entered: " + req.body.Name + req.body.Password + req.body.Permissions);
res.redirect('/upload');//just because
dbactions.addUser(req.body.Name, req.body.Password, req.body.Permissions);
});

app.post('/addRoom', function(req,res){//doesnt work callback next tick failure
  console.log(req.body);
  res.redirect('/');//just because...should go to scheduler page when added
  dbactions.insertClassroom(req.body,function(){
  //empty function for callback
  });
});

app.post('/removeclassydata', function(req,res){//doesnt work callback next tick failure
  res.redirect('/');//just because...should go to scheduler page when added
 dbactions.removeClass(req.body.class_id,function(){
 //empty function for callback
 });
});

app.post('/removeroomdata', function(req,res){//doesnt work...callback next tick failure
  console.log(req.body.room_id);
  dbactions.removeClassroom(req.body.room_id, function(){
    res.redirect('/');//just because...should go to scheduler page when added
  });
});

app.post('/', function(req, res, next) {
var wb =  xlsx.readFile(req.files.filer.path);
var wsname = wb.SheetNames[0];
var ws = wb.Sheets[wsname];
var put = xlsx.utils.sheet_to_json(ws);
 // console.log(put);
  dbactions.importExcelToDb(put);
  res.render('index');
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
