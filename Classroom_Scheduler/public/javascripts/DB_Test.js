//This is designed to test the different functions of DB_Transactions.js

var DB = require("C:/Users/Nicholas/Documents/GitHub/UNO-Classroom-Scheduler/Classroom_Scheduler/public/javascripts/DB_Transactions.js");

//Tests
var classInfo = {
    Subject: "a",
    Course_ID: 12345,
    Section_ID: 32,
    Class_ID: 53012,
    Course_Title: "Title",
    Lecture_Type: "Lab",
    ClassTime: {
        Days: "MW",
        Start: "10:30 AM",
        End: "11:45 AM"
    },
    Instructor: {
        First_Name: "Stanley",
        Last_Name: "Jones"
    },
    Class_Capacity: 200000,
    Description: "Hi",
    Acad_Group: "This One",
    Tot_Enrl: 1,
    Start_Date: "1/14/15",
    End_Date: "5/8/15",
    Session: 1,
    Location: "Pacific",
    Mode: 1,
    CrsAtr_Val: ""
};
console.log("InsertTheClass");
DB.insertClass(classInfo, function(ID){ //Test the insertion.
    console.log(ID);
    console.log("RetrieveTheClass");
    DB.getClass(ID, function(info){
        console.log(info);
        classInfo.ClassTime = { //Switch the class time information.
            Days: "TR",
            Start: "12:00 PM",
            End: "1:15 PM"
        };
        console.log("UpdateTheClass");
        DB.updateClass(ID, classInfo.ClassTime, function(){
            console.log("RetrieveTheClassAgain");
            DB.getClass(ID, function(info) {
                console.log(info);
                console.log("RemoveTheClass");
                DB.removeClass(ID, function(){
                    console.log("TryRetrievingAgain");
                    console.log(DB.getClass(ID), function(info){
                        console.log(info);
                    });
                });
            });
        });
    });
});