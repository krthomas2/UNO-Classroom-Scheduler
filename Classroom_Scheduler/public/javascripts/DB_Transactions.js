var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
//URL of database. Change if location of DB changes
var url = 'mongodb://admin:Password2015@ds029317.mongolab.com:29317/testing';
//var url = 'mongodb://admin:Password2015@ds029640.mongolab.com:29640/classroom_scheduler';
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

    getClassStart: function (class_id, callback){
        class_id = class_id || false;
        MongoClient.connect(url, function(err, db){
            if (err) {
                console.log(err);
            }
            else {
                if (class_id == false) {
                    db.collection("Classes").find().sort({ "Class_Time.Start": 1 }).toArray(function(err, data){
                        callback(data);
                    });
                }
                else {
                    db.collection("Classes").find({_id: new ObjectId(class_id)}).sort({ "Class_Time.Start": 1 }).toArray(function(err, data){
                        callback(data);
                    });
                }
            }
        });
    },
    autoSched: function (class_id, req, callback){
        class_id = class_id || false;
        MongoClient.connect(url, function(err, db){
            if (err) {
                console.log(err);
            }
            else {
                if (class_id == false) {
                    collection.update({mykey:1}, {$set:{fieldtoupdate:2}}, {w:1}, function(err, result) {
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
    getAllClass: function (class_id, callback){
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
                db.collection("Classrooms").updateOne({_id: new ObjectId(id)}, {$set: room_information}, function (err) {
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
    updateClassroomAssigns: function (id, room_information, callback){
        room_information.M
        {
            room_information.M.sevenAM = "blank";
            room_information.M.sevenfifteenAM = "";
            room_information.M.seventhirtyAM = "";
            room_information.M.sevenfortyfiveAM = "";
            room_information.M.eightAM = "";
            room_information.M.eightfifteenAM = "";
        }
        MongoClient.connect(url, function(err, db) {
            if (err){
                console.log(err);
            }
            else {
                db.collection("Classrooms").updateOne({_id: new ObjectId(id)}, {$set: room_information}, function (err) {
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
                db.collection("Classes").updateOne({_id: new ObjectId(id)}, {$set: {Room_Assigned: sched_information.Room_Assigned}},{upsert:true}, function (err) {
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

    clearScheduler: function(callback){
        MongoClient.connect(url, function(err, db) {
            if (err) {
                console.log(err);
            }
            else {
                db.collection("Classes").remove({});
                db.collection("Class_Groups").remove({});
                db.collection("Class_Schedule").remove({});
                callback();
            }
        });
    },

    /*Excel Import*/

	importExcelToDb: importExcelToDb
}

function importExcelToDb(put) {
    var dbAdditions = [];

    for (var x = 0; x < put.length; x++) {//iterating through courses
        //This is the array of data needing an insert into the classes table.
        dbAdditions[x] = {
            "Subject": put[x]["Subject"],
            "Course_ID": put[x]["Catalog"],
            "Section_ID": put[x]["Section"],
            "Class_ID": put[x]["Class Nbr"],
            "Course_Title": put[x]["Title"],
            "Lecture_Type": put[x]["Component"],
            "Class_Time": {
                "Start": put[x]["Mtg Start"] || "",
                "End": put[x]["Mtg End"],
                "Days": put[x]["Pat"] || ""
            },
            "Instructor": {
                First_Name: put[x]["First Name"] ||"",
                Last_Name: put[x]["Last"]||""
            },
            "Class_Capacity": put[x]["Cap Enrl"],
            "Description": put[x]["Descr"],
            "Acad_Group": put[x]["Acad Group"],
            "Tot_Enrl": put[x]["Tot Enrl"],
            "Start_Date": put[x]["Start Date"],
            "End_Date": put[x]["End Date"],
            "Session": put[x]["Session"],
            "Location": put[x]["Location"],
            "Mode": put[x]["Mode"],
            "CrsAtr_Val": put[x]["CrsAtr_Val"]
        };
    }
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log(err);
        }
        else {
            db.collection("Classes").insertMany(dbAdditions, function (err) {
                if (err) {
                    console.log(err);
                }
                else { /*Ok, we now have all the classes into the database, so we need to do the same thing with the class groups,
                 because apparently the idea of making the groups decided through human interaction, like was suggested,
                 isn't good enough for this project, even though there isn't any intuitive way to solve this problem.*/
                    var groups = [];
                    var group_ids = [];
                    for (var x = 0; x < dbAdditions.length; x++) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                                var found = false;
                                for (var y = 0; y < groups.length; y++) {
                                    if (groups[y]["First_Name"].valueOf() == dbAdditions[x]["Instructor"]["First_Name"].valueOf() &&
                                        groups[y]["Last_Name"].valueOf() == dbAdditions[x]["Instructor"]["Last_Name"].valueOf() &&
                                        groups[y]["Pat"].valueOf() == dbAdditions[x]["Class_Time"]["Days"].valueOf() &&
                                        groups[y]["Start"].valueOf() == dbAdditions[x]["Class_Time"]["Start"].valueOf()) {
                                        try {
                                            group_ids[y]["id" + Object.keys(group_ids[y]).length] = dbAdditions[x]["_id"];
                                        }
                                        catch(err){
                                            console.log(err);
                                        }
                                        found = true;
                                    }
                                }
                                if (!found) {
                                    groups[groups.length] = {
                                        "First_Name": dbAdditions[x]["Instructor"]["First_Name"],
                                        "Last_Name": dbAdditions[x]["Instructor"]["Last_Name"],
                                        "Pat": dbAdditions[x]["Class_Time"]["Days"],
                                        "Start": dbAdditions[x]["Class_Time"]["Start"]
                                    };
                                    try {
                                        group_ids[groups.length] = new Object();
                                        group_ids[groups.length]["id0"] = dbAdditions[x]["_id"];
                                    }
                                    catch(err){
                                        console.log(err);
                                    }
                                }
                        }
                    }
                    MongoClient.connect(url, function (err, db) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log(group_ids);
                            db.collection("Class_Groups").insertOne(group_ids[1], function (err) {
                                if (err) {
                                    console.log(err);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}