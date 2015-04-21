var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

module.exports = {
	//All following functions should return arrays corresponding to the queried information, except where specified.
	getInstructor: function (instructor_id){
		instructor_id = instructor_id || false; //see if we received an id.
		var db = accessDB();
		var returnvalue = false;
		if (instructor_id == false){
			returnvalue = db.collection("Instructors").find(); //If no id, just give back everything.
		}
		else{
			returnvalue = db.collection("Instructors").find({_id: instructor_id}); //Give back the specific id asked for.
		}
		db.close(); //Close the database connection.
		return returnvalue; //Return the array, or false if it doesn't exist.
	},
	getClass: function (class_id){
		class_id = class_id || false;
		var db = accessDB();
		var returnvalue = false;
		if (class_id == false){
			returnvalue = db.collection("Classes").find();
		}
		else{
			returnvalue = db.collection("Classes").find({_id: class_id});
		}
		db.close();
		return returnvalue;
	},
	getClassroom: function (classroom_id){  //Corresponds to classroom information for scehduler when id not provided.
		classroom_id = classroom_id || false;
		var db = accessDB();
		var returnvalue = false;
		if (classroom_id == false){
			returnvalue = db.collection("Classrooms").find();
		}
		else{
			returnvalue = db.collection("Classrooms").find({_id: classroom_id});
		}
		db.close();
		return returnvalue;
	},
	getClassGroup: function (group_id){
		group_id = group_id || false;
		var db = accessDB();
		var returnvalue = false;
		if (group_id == false){
			returnvalue = db.collection("Class_Groups").find();
		}
		else{
			returnvalue = db.collection("Class_Groups").find({_id: group_id});
		}
		db.close();
		return returnvalue;
	},
	getSchedule: function (sched_id){
		sched_id = sched_id || false;
		var db = accessDB();
		var returnvalue = false;
		if (sched_id == false){
			returnvalue = db.collection("Class_Schedule").find();
		}
		else{
			returnvalue = db.collection("Class_Schedule").find({_id: sched_id});
		}
		db.close();
		return returnvalue;
	},

	//Insert statements:
	insertInstructors: function (instructor_information){
		var db = accessDB();
		var object_id = 0;
		db.collection("Instructors").insertOne(instructor_information);
		db.close();
		return object_id;
	},
	insertClass: function (class_information){
		var db = accessDB();
		var object_id = 0;
		db.collection("Classes").insertOne(class_information);
		db.close();
		return object_id;
	},
	insertClassroom: function (room_information){
		var db = accessDB();
		var object_id = 0;
		db.collection("Classrooms").insertOne(room_information);
		db.close();
		return object_id;
	},
	insertClassGroup: function (group_information){
		var db = accessDB();
		var object_id = 0;
		db.collection("Class_Groups").insertOne(group_information);
		db.close();
		return object_id;
	},
	insertSched: function (schedule_information){
		var db = accessDB();
		var object_id = 0;
		db.collection("Class_Schedule").insertOne(schedule_information);
		db.close();
		return object_id;
	},

	updateInstructor: function (id, instructor_information){
		var db = accessDB();
		db.collection("Instructors").updateOne({_id: id},{$set: instructor_information});
		db.close();
	},
	updateClasses: function (id, class_information){
		var db = accessDB();
		db.collection("Classes").updateOne({_id: id} , {$set: class_information});
		db.close();
	},
	updateClassrooms: function (id, room_information){
		var db = accessDB();
		db.collection("Classrooms").updateOne({_id: id} , {$set: room_information});
		db.close();
	},
	updateClassGroups: function (id, group_information){
		var db = accessDB();
		db.collection("Class_Groups").updateOne({_id: id} , {$set: group_information});
		db.close();
	},
	updateSched: function (id, sched_information){
		var db = accessDB();
		db.collection("Class_Schedule").updateOne({_id: id} , {$set: sched_information});
		db.close();
	},

	removeInstructor: function (id){
		var db = accessDB();
		db.collection("Instructors").removeOne({_id: id});
		db.close();
	},
	removeClasses: function (id){
		var db = accessDB();
		db.collection("Classes").removeOne({_id: id});
		db.close();
	},
	removeClassroom: function (id){
		var db = accessDB();
		db.collection("Classrooms").removeOne({_id: id});
		db.close();
	},
	removeClassGroup: function (id){
		var db = accessDB();
		db.collection("Class_Groups").removeOne({_id: id});
		db.close();
	},
		removeSched: function (id){
		var db = accessDB();
		db.collection("Class_Schedule").removeOne({_id: id});
		db.close();
	},

	getInstructorByName: function (lname, fname) {
		var db = accessDB();
		var returnvalue = db.collection("Instructors").find({Last_Name: lname}, {First_Name: fname}, {_id: 1});
		db.close();
		return returnvalue;
	},

	importExcelToDb: function (put){
		var jsonObj = {"Courses": put }//creating the json object

		var lastCombined = false;
		var lastTitle = false;
		var groupID = 0;
		for(x = 0; x < jsonObj.Courses.length; x++) {//iterating through courses
			//Calculate the credits for this class.
			var twelveHourOffset = 0;
			if (jsonObj["Courses"][x]["Mtg Start"].split(' ')[1] == "PM") {
				twelveHourOffset = 12;
			}
			var startTime = new Date (2015, 4, 14, jsonObj["Courses"][x]["Mtg Start"].split(':')[0] + twelveHourOffset, jsonObj["Courses"][x]["Mtg Start"].split(':')[1]); //Create a date for the start time.

			var twelveHourOffset = 0;
			if (jsonObj["Courses"][x]["Mtg End"].split(' ')[1] == "PM") {
				twelveHourOffset = 12;
			}
			var endTime = new Date (2015, 4, 14, jsonObj["Courses"][x]["Mtg End"].split(':')[0] + twelveHourOffset, jsonObj["Courses"][x]["Mtg End"].split(':')[1]); //Create a date for the end time.

			var msec = endTime - startTime;

			var credits = (jsonObj["Courses"][x]["Pat"].length * ( msec / 1000 / 60)); //Result is the number of minutes required per week for the class to be scheduled in.

			//This is the array of data needing an insert into the classes table.
			var class_data = {"Subject": jsonObj["Courses"][x]["Subject"],
			"Course_ID": jsonObj["Courses"][x]["Catalog"],
			"Section_ID": jsonObj["Courses"][x]["Section"],
			"Class_ID": jsonObj["Courses"][x]["Class Nbr"],
			"Course_Title": jsonObj["Courses"][x]["Title"],
			"Lecture_Type": jsonObj["Courses"][x]["Component"],
			"Credits": credits,
			//"Instructor_ID": this.getInstructorByName(jsonObj["Courses"][x]["Last"], jsonObj["Courses"][x]["First Name"]),
			"Class_Capacity": jsonObj["Courses"][x]["Cap Enrl"],
			"Description": jsonObj["Courses"][x]["Descr"],
			"Acad_Group": jsonObj["Courses"][x]["Acad Group"],
			"Tot_Enrl": jsonObj["Courses"][x]["Tot Enrl"],
			"Start_Date": jsonObj["Courses"][x]["Start Date"],
			"End_Date": jsonObj["Courses"][x]["End Date"],
			"Session": jsonObj["Courses"][x]["Session"],
			"Location": jsonObj["Courses"][x]["Location"],
			"Mode": jsonObj["Courses"][x]["Mode"],
			"CrsAtr_Val": jsonObj["Courses"][x]["CrsAtr_Val"]};

			var class_id = this.insertClass(class_data);

			//We also need to create the class groups from the input data so that combined sections are scheduled together.
			if (jsonObj["Courses"][x]["Comb Sect"] == 'C'){
				if (jsonObj["Courses"][x]["Title"] != lastTitle){
					groupID++;
				}
				var groupInfo = {"Group_ID": groupID, "Class_ID": class_id};
				this.insertClassGroup(groupInfo);
			}

			lastTitle = jsonObj["Courses"][x]["Title"]; //This allows for the combining of sections.
		}
	}
}

function accessDB(){
	//URL of database. Change if location of DB changes
	var url = 'mongodb://admin:Password2015@ds029640.mongolab.com:29640/classroom_scheduler';

	//Make the connection to the database
	var db = MongoClient.connect(url, function(err, db){
		assert.equal(null, err);
	});

	//Return the database connection for use with the necessary function down below.
	return db;
}