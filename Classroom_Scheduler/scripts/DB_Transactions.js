function accessDB (){
	var MongoClient = require('mongodb').MongoClient, assert = require('assert');
	//URL of database. Change if lcoation of DB changes
	var url = 'mongodb://admin:Password2015@ds029640.mongolab.com:29640/classroom_scheduler';

	//Make the connection to the database
	var db = MongoClient.connect(url function(err, db){
		assert.equal(null, err);
	});
	
	//Return the database connection for use with the necessary function down below.
	return db;
}

//All following functions should return arrays corresponding to the queried information, except where specified.
function getInstructor(instructor_id){
	instructor_id = instructor_id || false; //see if we received an id.
	db = accessDB();
	returnvalue = false;
	if (instructor_id == false){
		returnvalue = db.Instructors.find(); //If no id, just give back everything.
	}
	else{
		returnvalue = db.Instructors.find({_id: instructor_id}); //Give back the specific id asked for.
	}	
	db.close(); //Close the database connection.
	return returnvalue; //Return the array, or false if it doesn't exist.
}
function getClass(class_id){
	class_id = class_id || false;
	db = accessDB();
	returnvalue = false;
	if (class_id == false){
		returnvalue = db.Classes.find();
	}
	else{
		returnvalue = db.Classes.find({_id: class_id});
	}	
	db.close();
	return returnvalue;
}
function getClassroom(classroom_id){
	classroom_id = classroom_id || false;
	db = accessDB();
	returnvalue = false;
	if (classroom_id == false){
		returnvalue = db.Classrooms.find();
	}
	else{
		returnvalue = db.Classrooms.find({_id: classroom_id});
	}	
	db.close();
	return returnvalue;
}
function getClassGroup(group_id){
	group_id = group_id || false;
	db = accessDB();
	returnvalue = false;
	if (group_id == false){
		returnvalue = db.Class_Groups.find();
	}
	else{
		returnvalue = db.IClass_Groups.find({_id: group_id});
	}	
	db.close();
	return returnvalue;
}
function getSchedule(sched_id){
	sched_id = sched_id || false;
	db = accessDB();
	returnvalue = false;
	if (sched_id == false){
		returnvalue = db.Class_Schedule.find();
	}
	else{
		returnvalue = db.Class_Schedule.find({_id: sched_id});
	}	
	db.close();
	return returnvalue;
}

//Insert statements:
function insertInstructor(instructor_information){
	db = accessDB();
	var object_id = db.Instructors.insert(instructor_information);
	db.close();
	return object_id;
}
function insertClass(class_information){
	db = accessDB();
	var object_id = db.Classes.insert(class_information);
	db.close();
	return object_id;
}
function insertClassroom(room_information){
	db = accessDB();
	var object_id = db.Classrooms.insert(room_information);
	db.close();
	return object_id;
}
function insertClassGroup(group_information){
	db = accessDB();
	var object_id = db.Class_Groups.insert(group_information);
	db.close();
	return object_id;
}
function insertSched(schedule_information){
	db = accessDB();
	var object_id = db.Class_Schedule.insert(schedule_information);
	db.close();
	return object_id;
}

function updateInstructor(id, instructor_information){
	db = accessDB();
	var object_id = db.Instructors.update({_id: id} , {$set: instructor_information});
	db.close();
}
function updateClasses(id, class_information){
	db = accessDB();
	var object_id = db.Classes.update({_id: id} , {$set: class_information});
	db.close();
}
function updateClassrooms(id, room_information){
	db = accessDB();
	var object_id = db.Classrooms.update({_id: id} , {$set: room_information});
	db.close();
}
function updateClassGroups(id, group_information){
	db = accessDB();
	var object_id = db.Class_Groups.update({_id: id} , {$set: group_information});
	db.close();
}
function updateSched(id, sched_information){
	db = accessDB();
	var object_id = db.Class_Schedule.update({_id: id} , {$set: sched_information});
	db.close();
}

function removeInstructor(id){
	db = accessDB();
	db.Instructors.remove({_id: id});
	db.close();
}
function removeClasses(id){
	db = accessDB();
	db.Classes.remove({_id: id});
	db.close();
}
function removeClassroom(id){
	db = accessDB();
	db.Classrooms.remove({_id: id});
	db.close();
}
function removeClassGroup(id){
	db = accessDB();
	db.Class_Groups.remove({_id: id});
	db.close();
}
function removeSched(id){
	db = accessDB();
	db.Class_Schedule.remove({_id: id});
	db.close();
}

function getInstructorByName(lname, fname){
	db = accessDB();
	returnvalue = db.Instructors.find({Last_Name: lname, First_Name: fname}, {_id: 1});
	db.close();
	return returnvalue;

function importExcelToDb(put){
	var jsonObj = {"Courses": put }//creating the json object

	var lastCombined = false;
	var lastTitle = false;
	var groupID = 0;
	for(x = 0; x < jsonObj.Courses.length; x++) {//iterating through courses
		//Calcuate the credits for this class.
		var twelveHourOffset = 0;
		if (jsonObj.Courses[x].["Mtg Start"].split(' ')[1] == "PM") {
			twelveHourOffset = 12;
		}
		var startTime = new Date (2015, 4, 14, jsonObj.Courses[x].["Mtg Start"].split(':')[0] + twelveHourOffset, jsonObj.Courses[x].["Mtg Start"].split(':')[1]); //Create a date for the start time.
		
		var twelveHourOffset = 0;
		if (jsonObj.Courses[x].["Mtg End"].split(' ')[1] == "PM") {
			twelveHourOffset = 12;
		}
		var endTime = new Date (2015, 4, 14, jsonObj.Courses[x].["Mtg End"].split(':')[0] + twelveHourOffset, jsonObj.Courses[x].["Mtg End"].split(':')[1]); //Create a date for the end time.
		
		var msec = endTime - startTime;
		
		var credits = (jsonObj.Courses[x].Pat.length * (msec / 1000 / 60)); //Result is the number of minutes required per week for the class to be scheduled in.
	
		//This is the array of data needing an insert into the classes table.
		var class_data = {"Subject": jsonObj.Courses[x].Subject,
		"Course_ID": jsonObj.Courses[x].Catalog,
		"Section_ID": jsonObj.Courses[x].Section,
		"Class_ID": jsonObj.Courses[x].["Class Nbr"],
		"Course_Title": jsonObj.Courses[x].Title,
		"Lecture_Type": jsonObj.Courses[x].Component,
		"Credits": credits,
		"Instructor_ID": getInstructorByName(jsonObj.Courses[x].Last, jsonObj.Courses[x].["First Name"]),
		"Class_Capacity": jsonObj.Courses[x].["Cap Enrl"],
		"Description": jsonObj.Courses[x].Descr,
		"Acad_Group": jsonObj.Courses[x].["Acad Group"],
		"Tot_Enrl": jsonObj.Courses[x].["Tot Enrl"],
		"Start_Date": jsonObj.Courses[x].["Start Date"],
		"End_Date": jsonObj.Courses[x].["End Date"],
		"Session": jsonObj.Courses[x].Session,
		"Location": jsonObj.Courses[x].Location,
		"Mode": jsonObj.Courses[x].Mode,
		"CrsAtr_Val": jsonObj.Courses[x].["CrsAtr_Val"]};
		
		var class_id = insertClass(class_data);
		
		//We also need to create the class groups from the input data so that combined secitons are scheduled together.
		if (jsonObj.Courses[x].["Comb Sect"] == 'C'){
			if (jsonObj.Courses[x].Title != lastTitle){
				groupID++;
			}
			var groupInfo = {"Group_ID": groupID, "Class_ID": class_id};
			insertClassGroup(groupInfo);
		}
		
		lastTitle = jsonObj.Courses[x].Title; //This allows for the combining of sections.
	} 
}