var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
//URL of database. Change if location of DB changes
//var url = 'mongodb://admin:Password2015@ds029317.mongolab.com:29317/testing';
var url = 'mongodb://admin:Password2015@ds029640.mongolab.com:29640/classroom_scheduler';
var functions = module.exports = {

    addUser: function(name,password,level){
        var uname = name || false;
        var pw = password || false;
        var per = level || false;
        MongoClient.connect(url, function(err, db) {
            if (err) {
                console.log(err);
            }
            else {
				db.collection("Users").find({"Name" : uname}, function(err, returnValue){
					returnValue.count(function(err, count){
						if (count == 1){
							callback("User already in database. Please choose a different username.");
						}
						else {
							db.collection("Users").insert({"Name" : uname, "Password" : pw, "Permissions" : per}, function(err, callback){
								callback(key.ops[0]._id);
							});
						}
					});
				});
                db.close();
            }
        });
    },

    /*Classes*/
    reinsertClass: function (id,class_information, callback){
        MongoClient.connect(url, function(err, db) {
            if (err) {
                console.log(err);
            }
            else {
                db.collection("Classes").insertOne({_id: new ObjectId(id)},class_information, function (err, key) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        callback(key.ops[0]._id, {Instructor: class_information.Instructor, Class_Time: class_information.Class_Time});
                    }
                });
            }
        });
    },
	insertClass: function (class_information, callback){
		MongoClient.connect(url, function(err, db) {
			if (err) {
				console.log(err);
			}
			else {
                db.collection("Classes").insertOne(class_information, function (err, key) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        callback(key.ops[0]._id, {Instructor: class_information.Instructor, Class_Time: class_information.Class_Time});
                    }
                });
            }
		});
	},
	getClass: function (class_id, callback){
		class_id = class_id || false;
		MongoClient.connect(url, function(err, db){
			if (err) {
				console.log(err);
			}
			else {
				if (class_id == false) {
                    db.collection("Classes").find().toArray(function(err, data){
                        callback(data);
                    });
				}
				else {
                    db.collection("Classes").find({_id: new ObjectId(class_id)}).toArray(function(err, data){
                       callback(data);
                    });
                }
			}
		});
	},
    updateClass: function (id, class_information, callback){
        MongoClient.connect(url, function(err, db) {
            if (err){
                console.log(err);
            }
            else {
                db.collection("Classes").updateOne({_id: new ObjectId(id)}, {$set: class_information}, function (err) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        callback();
                    }
                });
            }
        });
    },
	removeClass: function (id, callback){
		MongoClient.connect(url, function(err, db) {
			if (err) {
				console.log(err);
			}
			else {
				db.collection("Classes", function (err, collection) {
					collection.removeOne({_id: new ObjectId(id)}, function(){
                        callback();
                    });
				});
			}
		});
	},

    /*Classrooms*/

    insertClassroom: function (room_information, callback){
        MongoClient.connect(url, function(err, db) {
            if (err) {
                console.log(err);
            }
            else {
                db.collection("Classrooms").insertOne(room_information, function (err, key) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        callback(key.ops[0]._id);
                    }
                });
            }
        });
    },
    getClassroom: function (classroom_id, callback){  //Corresponds to classroom information for scehduler when id not provided.
        classroom_id = classroom_id || false;
        MongoClient.connect(url, function(err, db){
            if (err) {
                console.log(err);
            }
            else {
                if (classroom_id == false) {
                    db.collection("Classrooms").find().toArray(function(err, data){
                        callback(data);
                    });
                }
                else {
                    db.collection("Classrooms").find({_id: new ObjectId(classroom_id)}).toArray(function(err, data){
                        callback(data);
                    });
                }
            }
        });
	},
    getClassroomByNumber: function (room_number, callback){  //Corresponds to classroom information for scehduler when id not provided.
        MongoClient.connect(url, function(err, db){
            if (err) {
                console.log(err);
            }
            else {
                db.collection("Class_Schedule").find({Room_Number: room_number}).toArray(function(err, data){
                    callback(data);
                });
            }
        });
    },
    updateClassroom: function (id, room_information, callback){
        MongoClient.connect(url, function(err, db) {
            if (err){
                console.log(err);
            }
            else {
                db.collection("Classrooms").updateOne({_id: new ObjectId(id)}, {$set: {ClassTime: room_information}}, function (err) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        callback();
                    }
                });
            }
        });
    },
    removeClassroom: function (id, callback){
        MongoClient.connect(url, function(err, db) {
            if (err) {
                console.log(err);
            }
            else {
                db.collection("Classrooms", function (err, collection) {
                    collection.removeOne({_id: new ObjectId(id)}, function () {
                        callback();
                    });
                });
            }
        });
    },

    /*Class Groups*/

    insertClassGroup: function (group_information, callback){
        MongoClient.connect(url, function(err, db) {
            if (err) {
                console.log(err);
            }
            else {
                db.collection("Class_Groups").insertOne(group_information, function (err, key) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        callback(key.ops[0]._id);
                    }
                });
            }
        });
    },
	getClassGroup: function (group_id, callback){
        group_id = group_id || false;
        MongoClient.connect(url, function(err, db){
            if (err) {
                console.log(err);
            }
            else {
                if (group_id == false) {
                    db.collection("Class_Groups").find().toArray(function(err, data){
                        callback(data);
                    });
                }
                else {
                    db.collection("Class_Groups").find({_id: new ObjectId(group_id)}).toArray(function(err, data){
                        callback(data);
                    });
                }
            }
        });
	},
    updateClassGroups: function (id, group_information, callback){
        MongoClient.connect(url, function(err, db) {
            if (err){
                console.log(err);
            }
            else {
                db.collection("Class_Groups").updateOne({_id: new ObjectId(id)}, {$set: {ClassTime: group_information}}, function (err) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        callback();
                    }
                });
            }
        });
    },
    removeClassGroup: function (id, callback){
        MongoClient.connect(url, function(err, db) {
            if (err) {
                console.log(err);
            }
            else {
                db.collection("Class_Groups", function (err, collection) {
                    collection.removeOne({_id: new ObjectId(id)}, function () {
                        callback();
                    });
                });
            }
        });
    },

    /*Schedule*/

    insertSched: function (schedule_information, callback){
        MongoClient.connect(url, function(err, db) {
            if (err) {
                console.log(err);
            }
            else {
                db.collection("Class_Schedule").insertOne(schedule_information, function (err, key) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        callback(key.ops[0]._id);
                    }
                });
            }
        });
    },
	getSchedule: function (sched_id, callback){
        sched_id = sched_id || false;
        MongoClient.connect(url, function(err, db){
            if (err) {
                console.log(err);
            }
            else {
                if (sched_id == false) {
                    db.collection("Class_Schedule").find().toArray(function(err, data){
                        callback(data);
                    });
                }
                else {
                    db.collection("Class_Schedule").find({_id: new ObjectId(sched_id)}).toArray(function(err, data){
                        callback(data);
                    });
                }
            }
        });
	},
	updateSched: function (id, sched_information, callback){
        MongoClient.connect(url, function(err, db) {
            if (err){
                console.log(err);
            }
            else {
                db.collection("Classes").updateOne({_id: new ObjectId(id)}, {$set: {ClassTime: sched_information}}, function (err) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        callback();
                    }
                });
            }
        });
	},
	removeSched: function (id, callback){
		MongoClient.connect(url, function(err, db) {
				if (err) {
					console.log(err);
				}
				else {
                    db.collection("Class_Schedule", function (err, collection) {
                        collection.removeOne({_id: new ObjectId(id)}, function () {
                            callback();
                        });
                    });
                }
		});
	},

    /*Excel Import*/

	importExcelToDb: importExcelToDb
}

function importExcelToDb(put) {
    var jsonObj = {"Courses": put}//creating the json object

    var group = {};
    for (var x = 0; x < jsonObj.Courses.length - 1; x++) {//iterating through courses

        //This is the array of data needing an insert into the classes table.
        var class_data = {
            "Subject": jsonObj["Courses"][x]["Subject"],
            "Course_ID": jsonObj["Courses"][x]["Catalog"],
            "Section_ID": jsonObj["Courses"][x]["Section"],
            "Class_ID": jsonObj["Courses"][x]["Class Nbr"],
            "Course_Title": jsonObj["Courses"][x]["Title"],
            "Lecture_Type": jsonObj["Courses"][x]["Component"],
            "Class_Time": {
                "Start": jsonObj["Courses"][x]["Mtg Start"],
                "End": jsonObj["Courses"][x]["Mtg End"],
                "Days": jsonObj["Courses"][x]["Pat"]
            },
            "Instructor": {
                First_Name: jsonObj["Courses"][x]["First Name"],
                Last_Name: jsonObj["Courses"][x]["Last"]
            },
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

        functions.insertClass(class_data, function (ID, returnData) {
            var pushed = false;
            for(var y = 0; y < group.count; y++){
                if (group[y]["Instructor"]["First_Name"] == returnData["Instructor"]["First_Name"] && group[y]["Instructor"]["Last_Name"] == returnData["Instructor"]["Last_Name"] &&
                    group[y]["Class_Time"]["Pat"] == returnData["Class_Time"]["Pat"] && group[y]["Class_Time"]["Start"] == returnData["Class_Time"]["Start"]){
                    //Sorry for the long if statement, but basically it checks to see if all the traits for the class, being the instructor and the class time are the same, and the only way to do this
                    //is to make sure all the traits of these two things are equal (except for end time, as that information is dependent on start time)
                    group[y]["ids"].push(ID); //This adds the id to the relative group.
                    pushed = true;
                }
            }
            if (!pushed){
                group[group.count] = returnData;
                group[group.count]["ids"] = {0: ID};
            }

            //Fortunately this shouldn't be a concurrency issue here :)
            //Now that the group list is populated, we have the groups we need to add to the groups table, even groups with just one item should be added for consistency sake.
            if (x == jsonObj.Courses.length - 2) //We only execute this on the last iteration of the loop.
            for (var y = 0; y < group.count; y++){
                functions.insertClassGroup(group[y]["ids"], function(ID){}); //Callback function only here to keep program from crashing.
            }
        });
    }
}