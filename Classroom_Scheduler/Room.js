var LinkedList = require('jsclass/src/linked_list').LinkedList;

function Room(room_number, max_cap){
    var room_number = room_number;
    var max_cap = max_cap;
    var Classes = new Array();
    var Times = new Array();
    for (var x = 0; x < 6; x++){
        Classes[x] = new LinkedList();  //Initializes all the lists of classes.
        Times[x] = new Date(0, 0, 0, 7, 30); //Initializes the start of every day at 7:30 AM (earliest time for classes)
    }

    /*addClass
    * Created by: Nick Boeckman
    * Parameters:
    *   class_id (id of class to store in the database)
    *   end_time (the time when the class ends, provided from classes table)
    *   days (string of all the days provided from classes table)
    * Returns: none
    * Description:
    *   This function adds a class, for which an available slot has already been found for this room,
    *   and adds it to the list of classes in this room, while also setting the time the room is next available to the
    *   time this class ends. */
    function addClass(class_id, end_time, days){
        //First we need to convert the end time and days to easier formats to use.
        var dayList = days.split(''); //Get the days as letters
        var time = convertTime(end_time);
        for(var day in dayList){ //Convert the days to numbers so that we can use them as indexes for the classes and times arrays...
            switch(day){
                case "M":
                    day = 0;
                    break;
                case "T":
                    day = 1;
                    break;
                case "W":
                    day = 2;
                    break;
                case "R":
                    day = 3;
                    break;
                case "F":
                    day = 4;
                    break;
                case "S":
                    day = 5;
                    break;
            }

        }

        //Now that we have that information, we can add the class_id to the correct lists, and set the new end times for those days.
        for(var day in dayList){
            Classes[day].push(class_id);
            Times[day] = time;
        }
    }
    /*convertTime
     * Created by: Nick Boeckman
     * Parameters:
     *   time (the time when the class ends, provided from classes table)
     * Returns: Date object set to the time passed.
     * Description:
     *   This function takes the time object as defined in the classes table, and converts it to a date object.
     *   so that it can be easily compared to other times required by the scheduler. This function shouldn't need
     *   to be called by external functions, but it is provided here, just in case it would need to be at some
     *   point in the future.*/
    function convertTime(time){
        var t = time.split(':'); //Match either a space or a colon. Will result in a 4 piece string.
        var hour = parseInt(t[0]); //gets the number for the hour
        var minute = parseInt(t[1]); //gets the number for the minute
        if (t[2].split(' ')[1] == 'P' && hour != 12){ //Convert the AM/PM to military time.
            hour += 12;
        }
        return new Date(0, 0, 0, hour, minute);
    }
    /*compareTimes
     * Created by: Nick Boeckman
     * Parameters:
     *   timeA (the time when the class begins, provided from classes table)
     *   timeB (the time of the latest class, stored in the time array of the room object)
     * Returns: Integer indicator of which time is larger. - if timeA < timeB, 0 if timeA = timeB, and + if timeA > timeB
     * Description:
     *   This function takes two times and returns an integer indicator of the difference between the two times.
     *   Look at the returns line for the information returned.*/
    function compareTimes(timeA, timeB){
        return convertTime(timeA).valueOf() - timeB.valueOf();
    }
}