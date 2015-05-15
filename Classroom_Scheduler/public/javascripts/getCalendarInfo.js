/*getCalendarInfo
 * Created by: Nick Boeckman
 * Parameters:
 *   the room number requested to get information for.
 * Returns: Technically nothing... Really though it updates the table in calendar.jade to have all the information from
 *  the database for the room number passed in.
 * Description:
 *   This function takes a given room number, and gets all the class information for all the classes scheduled in that room
 *   placing it into the table in calendar.jade where required to make a correct looking calendar view.*/
/**
 * @class getCalendarInfo
 * @param info
 *  Room _id number for expected data.
 * @description
 * Populates the calendar page with visual graphics of the groups and their times.
 */
function getCalendarInfo(info) {
    $('td').removeClass("hidden").removeClass("danger").html('').attr("rowspan", 1);
    $.get('/getCalendarInfo', {room_number: info.value}, function (class_list) {  //This will make a call to the framework to get all the classrooms that are assigned to the selected room
        for (var classes in class_list) { //Iterate through all the classes.
            var days = class_list[classes][0].Days.split('');
            var start = class_list[classes][0].Start.split(':'); //Match either a space or a colon. Will result in a 4 piece string.
            var startHour = parseInt(start[0]); //gets the number for the hour
            var startMinute = parseInt(start[1]); //gets the number for the minute
            if (startMinute % 15 != 0){
                startMinute -= (startMinute % 15);
            }
            var startAP = (start[2].split(' ')[1] == 'AM') ? 'A' : 'P';
            var end = class_list[classes][0].End.split(':'); //Match either a space or a colon. Will result in a 4 piece string.
            var endHour = parseInt(end[0]); //gets the number for the hour
            var endMinute = parseInt(end[1]); //gets the number for the minute
            if (endMinute % 15 != 0){
                endMinute += (15 - (endMinute % 15));
                if (endMinute == 60){
                    endMinute = 0;
                }
            }
            var cellCount = 0;
            var startName = [];
            while (startHour != endHour || startMinute != endMinute) {
                for (var day in days) {
                    var tdName = 'td.' + days[day] + startHour + startMinute + startAP;
                    if (startMinute == 0) { //need to add an extra 0 if the minute is 0
                        var tdName = 'td.' + days[day] + startHour + startMinute + '0' + startAP;
                    }
                    if (cellCount == 0) {
                        startName.push(tdName);
                        $(tdName).html(class_list[classes][0].Subject +
                            class_list[classes][0].Instructor + '<br\/><br\/>' + class_list[classes][0].Course_Title + '<br\/><br\/>Start: &nbsp; ' +
                            class_list[classes][0].Start + '<br\/>End: &nbsp; &nbsp;' + class_list[classes][0].End); //Add the information to the appropriate cell.
                        $(tdName).addClass("danger");
                    }
                    else{
                        $(tdName).addClass("hidden");
                    }
                }
                //Do all the math to get the next 15 minute thing.
                startMinute += 15;
                if (startMinute == 60) {
                    startMinute = 0;
                    startHour++;
                    if (startHour == 12) {
                        startAP = 'P';
                    }
                    if (startHour == 13) {
                        startHour = 1;
                    }
                }
                cellCount++;
            }
            for (x in startName) {
                $(startName[x]).attr("rowspan", cellCount);
            }
        }
    });
}
