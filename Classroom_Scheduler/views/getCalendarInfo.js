function getCalendarInfo(info) {
    $('td').removeClass("hidden").removeClass("danger").html('');
    $.get('/getCalendarInfo', {room_number: info.value}, function (class_list) {  //This will make a call to the framework to get all the classrooms that are assigned to the selected room
        for (var classes in class_list) { //Iterate through all the classes.
            var days = class_list[classes][0].Class_Time.Days.split('');
            var start = class_list[classes][0].Class_Time.Start.split(':'); //Match either a space or a colon. Will result in a 4 piece string.
            var startHour = parseInt(start[0]); //gets the number for the hour
            var startMinute = parseInt(start[1]); //gets the number for the minute
            if (startMinute % 15 != 0){
                startMinute -= (startMinute % 15);
            }
            var startAP = (start[2].split(' ')[1] == 'AM') ? 'A' : 'P';
            var end = class_list[classes][0].Class_Time.End.split(':'); //Match either a space or a colon. Will result in a 4 piece string.
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
                        $(tdName).html(class_list[classes][0].Subject + class_list[classes][0].Course_ID + '-' +
                            class_list[classes][0].Section_ID + '<br\/><br\/>' + class_list[classes][0].Course_Title + '<br\/><br\/>Start: &nbsp; ' +
                            class_list[classes][0].Class_Time.Start + '<br\/>End: &nbsp; &nbsp;' + class_list[classes][0].Class_Time.End); //Add the information to the appropriate cell.
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
