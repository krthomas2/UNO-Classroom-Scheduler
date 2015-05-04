function getCalendarInfo(info) {
    $.get('/getCalendarInfo', {room_number: info.value}, function (classes){  //This will make a call to the framework to get all the classrooms that are assigned to the selected room.
        var days = classes.Class_Time.Days.split('');
        var start = classes.Class_Time.Start.split(':'); //Match either a space or a colon. Will result in a 4 piece string.
        var startHour = parseInt(start[0]); //gets the number for the hour
        var startMinute = parseInt(start[1]); //gets the number for the minute
        var startAP = (start[2].split(' ')[1] == 'AM') ? 'A' : 'P';
        var end = classes.Class_Time.End.split(':'); //Match either a space or a colon. Will result in a 4 piece string.
        var endHour = parseInt(end[0]); //gets the number for the hour
        var endMinute = parseInt(end[1]); //gets the number for the minute
        while (startHour != endHour || startMinute != endMinute){
            for (var day in days){
                var tdName = 'td.' + days[day] + startHour + startMinute + startAP;
                if (startMinute == 0){ //need to add an extra 0 if the minute is 0
                    var tdName = 'td.' + days[day] + startHour + startMinute + '0' + startAP;
                }
                $(tdName).html(classes.Subject + classes.Course_ID + '-' + classes.Section_ID + '</br>' + classes.Course_Title); //Add the information to the appropriate cell.
                $(tdName).addClass("danger");
            }
            //Do all the math to get the next 15 minute thing.
            startMinute += 15;
            if (startMinute == 60){
                startMinute = 0;
                startHour++;
                if (startHour == 12){
                    startAP = 'P';
                }
                if (startHour == 13){
                    startHour = 1;
                }
            }
        }
    });
}
