var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');


function accessDB(){
	//URL of database. Change if location of DB changes
	var url = 'mongodb://admin:Password2015@ds029640.mongolab.com:29640/classroom_scheduler';
	var db = 1;
	//Make the connection to the database
	 db = MongoClient.connect(url, function(err, db){
		assert.equal(null, err);
	});

	//Return the database connection for use with the necessary function down below.
	return db;
}


module.exports = {

	insertClass: function (put){
		var db = accessDB();
		var object_id = 0;
		db.insertOne(put);
		db.close();
		return object_id;
	}

}