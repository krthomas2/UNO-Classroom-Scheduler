var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
//URL of database. Change if location of DB changes
var url = 'mongodb://admin:Password2015@ds029640.mongolab.com:29640/classroom_scheduler';

module.exports = {
	//All following functions should return arrays corresponding to the queried information, except where specified.
	getInstructor: function (instructor_id){
		instructor_id = instructor_id || false; //see if we received an id.
		var returnvalue = false;
		MongoClient.connect(url, function(err, db){
			db.open(function(err, db) {
				if (err) {
					console.log(err);
				}
				else {
					if (instructor_id == false) {
						returnvalue = db.collection("Instructors").find(); //If no id, just give back everything.
					}
					else {
						returnvalue = db.collection("Instructors").find({_id: instructor_id}); //Give back the specific id asked for.
					}
				}
				db.close(); //Close the database connection.
			});
		});
		return returnvalue; //Return the array, or false if it doesn't exist.
	},
	getClass: function (class_id){
		class_id = class_id || false;
		var returnvalue = false;
		MongoClient.connect(url, function(err, db){
			db.open(function(err, db) {
					if (err) {
						console.log(err);
					}
					else {
						if (class_id == false) {
							returnvalue = db.collection("Classes").find();
						}
						else {
							returnvalue = db.collection("Classes").find({_id: class_id});
						}
					}
				db.close();
			});
		});
		return returnvalue;
	},
	getClassroom: function (classroom_id){  //Corresponds to classroom information for scehduler when id not provided.
		classroom_id = classroom_id || false;
		var returnvalue = false;
		MongoClient.connect(url, function(err, db) {
			db.open(function (err, db) {
				if (err) {
					console.log(err);
				}
				else {
					if (classroom_id == false) {
						returnvalue = db.collection("Classrooms").find();
					}
					else {
						returnvalue = db.collection("Classrooms").find({_id: classroom_id});
					}
				}
				db.close();
			});
		});
		return returnvalue;
	},
	getClassGroup: function (group_id){
		group_id = group_id || false;
		var returnvalue = false;
		MongoClient.connect(url, function(err, db) {
			db.open(function (err, db) {
				if (err) {
					console.log(err);
				}
				else {
					if (group_id == false) {
						returnvalue = db.collection("Class_Groups").find();
					}
					else {
						returnvalue = db.collection("Class_Groups").find({_id: group_id});
					}
				}
				db.close();
			});
		});
		return returnvalue;
	},
	getSchedule: function (sched_id){
		sched_id = sched_id || false;
		var returnvalue = false;
		MongoClient.connect(url, function(err, db) {
			db.open(function (err, db) {
				if (err) {
					console.log(err);
				}
				else {
					if (sched_id == false) {
						returnvalue = db.collection("Class_Schedule").find();
					}
					else {
						returnvalue = db.collection("Class_Schedule").find({_id: sched_id});
					}
				}
				db.close();
			});
		});
		return returnvalue;
	},

	//Insert statements:
	insertInstructors: function (instructor_information){
		var key = false;
		MongoClient.connect(url, function(err, db){
			db.open(function(err, db) {
				if (err) {
					console.log(err);
				}
				else {
					db.collection("Instructors", function (err, collection) {
						key = collection.insertOne(instructor_information);
					});
				}
				db.close();
			});
		});
		return key;
	},
	insertClass: function (class_information){
		var key = false;
		MongoClient.connect(url, function(err, db) {
			db.open(function (err, db) {
				if (err) {
					console.log(err);
				}
				else {
					db.collection("Classes", function (err, collection) {
						key = collection.insert(class_information);
					});
				}
				db.close();
			});
		});
		return key;
	},
	insertClassroom: function (room_information){
		var key = false;
		MongoClient.connect(url, function(err, db){
			db.open(function(err, db) {
				if (err) {
					console.log(err);
				}
				else {
					db.collection("Classrooms", function (err, collection) {
						key = collection.insertOne(room_information);
					});
				}
				db.close();
			});
		});
		return key;
	},
	insertClassGroup: function (group_information){
		var key = false;
		MongoClient.connect(url, function(err, db) {
			db.open(function (err, db) {
				if (err) {
					console.log(err);
				}
				else {
					db.collection("Class_Groups", function (err, collection) {
						key = collection.insertOne(group_information);
					});
				}
				db.close();
			});
		});
		return key;
	},
	insertSched: function (schedule_information){
		var key = false;
		MongoClient.connect(url, function(err, db) {
			db.open(function (err, db) {
				if (err) {
					console.log(err);
				}
				else {
					db.collection("Class_Schedule", function (err, collection) {
						key = collection.insertOne(schedule_information);
					});
				}
				db.close();
			});
		});
		return key;
	},

	updateInstructor: function (id, instructor_information){
		MongoClient.connect(url, function(err, db) {
			db.open(function (err, db) {
				if (err) {
					console.log(err);
				}
				else {
					db.collection("Instructors", function (err, collection) {
						collection.updateOne({_id: id}, {$set: instructor_information});
					});
				}
				db.close();
			});
		});
	},
	updateClasses: function (id, class_information){
		MongoClient.connect(url, function(err, db) {
			db.open(function (err, db) {
				if (err) {
					console.log(err);
				}
				else {
					db.collection("Classes", function (err, collection) {
						collection.updateOne({_id: id}, {$set: class_information});
					});
				}
				db.close();
			});
		});
	},
	updateClassrooms: function (id, room_information){
		MongoClient.connect(url, function(err, db) {
			db.open(function (err, db) {
				if (err) {
					console.log(err);
				}
				else {
					db.collection("Classrooms", function (err, collection) {
						collection.updateOne({_id: id}, {$set: room_information});
					});
				}
				db.close();
			});
		});
	},
	updateClassGroups: function (id, group_information){
		MongoClient.connect(url, function(err, db) {
			db.open(function (err, db) {
				if (err) {
					console.log(err);
				}
				else {
					db.collection("Class_Groups", function (err, collection) {
						collection.updateOne({_id: id}, {$set: group_information});
					});
				}
				db.close();
			});
		});
	},
	updateSched: function (id, sched_information){
		MongoClient.connect(url, function(err, db) {
			db.open(function (err, db) {
				if (err) {
					console.log(err);
				}
				else {
					db.collection("Class_Schedule", function (err, collection) {
						collection.updateOne({_id: id}, {$set: sched_information})
					});
				}
				db.close();
			});
		});
	},

	removeInstructor: function (id){
		MongoClient.connect(url, function(err, db) {
			db.open(function (err, db) {
				if (err) {
					console.log(err);
				}
				else {
					db.collection("Instructors", function (err, collection) {
						collection.removeOne({_id: id});
					});
				}
				db.close();
			});
		});
	},
	removeClasses: function (id){
		MongoClient.connect(url, function(err, db) {
			db.open(function (err, db) {
				if (err) {
					console.log(err);
				}
				else {
					db.collection("Classes", function (err, collection) {
						collection.removeOne({_id: id});
					});
				}
				db.close();
			});
		});
	},
	removeClassroom: function (id){
		MongoClient.connect(url, function(err, db) {
			db.open(function (err, db) {
				if (err) {
					console.log(err);
				}
				else {
					db.collection("Classrooms", function (err, collection) {
						collection.removeOne({_id: id});
					});
				}
				db.close();
			});
		});
	},
	removeClassGroup: function (id){
		MongoClient.connect(url, function(err, db) {
			db.open(function (err, db) {
				if (err) {
					console.log(err);
				}
				else {
					db.collection("Class_Groups", function (err, collection) {
						collection.removeOne({_id: id});
					});
				}
				db.close();
			});
		});
	},
	removeSched: function (id){
		MongoClient.connect(url, function(err, db) {
			db.open(function (err, db) {
				if (err) {
					console.log(err);
				}
				else {
					db.collection("Class_Schedule", function (err, collection) {
						collection.removeOne({_id: id});
					});
				}
				db.close();
			});
		});
	},

	getInstructorByName: function (lname, fname) {
		var returnvalue = false;
		MongoClient.connect(url, function(err, db){
			db.open(function(err, db) {
				if (err) {
					console.log(err);
				}
				else {
					returnvalue = db.collection("Instructors").find({Last_Name: lname}, {First_Name: fname}, {_id: 1}, function(err, db){
						if (err){
							returnvalue = this.insertInstructors({First_Name: fname, Last_Name: lname}); //Insert the instructor if they don't exist.
						}
					});
				}
				db.close();
			});
		});
		return returnvalue;
	},

	calculateCredits: function(start, end, days){
		var twelveHourOffset = 0;
		if (start.split(" ")[1] == "PM") {
			twelveHourOffset = 12;
		}
		var startTime = new Date (2015, 4, 14, start.split(":")[0] + twelveHourOffset, start.split(":")[1]); //Create a date for the start time.

		twelveHourOffset = 0;
		if (end.split(" ")[1] == "PM") {
			twelveHourOffset = 12;
		}
		var endTime = new Date (2015, 4, 14, end.split(":")[0] + twelveHourOffset, end.split(":")[1]); //Create a date for the end time.

		var msec = endTime - startTime;

		return (days.length * ( msec / 1000 / 60));
	},

	importExcelToDb: function (put){
		var jsonObj = {"Courses": put }//creating the json object

		var lastCombined = false;
		var lastTitle = false;
		var groupID = 0;
		for(var x = 0; x < jsonObj.Courses.length; x++) {//iterating through courses

			//This is the array of data needing an insert into the classes table.
			var class_data = {
				"Subject": jsonObj["Courses"][x]["Subject"],
				"Course_ID": jsonObj["Courses"][x]["Catalog"],
				"Section_ID": jsonObj["Courses"][x]["Section"],
				"Class_ID": jsonObj["Courses"][x]["Class Nbr"],
				"Course_Title": jsonObj["Courses"][x]["Title"],
				"Lecture_Type": jsonObj["Courses"][x]["Component"],
				"Credits": this.calculateCredits(jsonObj["Courses"][x]["Mtg Start"], jsonObj["Courses"][x]["Mtg End"], jsonObj["Courses"][x]["Pat"]),
				"Instructor_ID": this.getInstructorByName(jsonObj["Courses"][x]["Last"], jsonObj["Courses"][x]["First Name"]),
				"Class_Capacity": jsonObj["Courses"][x]["Cap Enrl"],
				"Description": jsonObj["Courses"][x]["Descr"],
				"Acad_Group": jsonObj["Courses"][x]["Acad Group"],
				"Tot_Enrl": jsonObj["Courses"][x]["Tot Enrl"],
				"Start_Date": jsonObj["Courses"][x]["Start Date"],
				"End_Date": jsonObj["Courses"][x]["End Date"],
				"Session": jsonObj["Courses"][x]["Session"],
				"Location": jsonObj["Courses"][x]["Location"],
				"Mode": jsonObj["Courses"][x]["Mode"],
				"CrsAtr_Val": jsonObj["Courses"][x]["CrsAtr_Val"]
			};

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