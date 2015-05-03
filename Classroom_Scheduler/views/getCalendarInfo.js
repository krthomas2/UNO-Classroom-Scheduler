function getCalendarInfo(info) {
    $.get('/getCalendarInfo', {room_number: info.value}, function (classes){  //This will make a call to the framework to get all the classrooms that are assigned to the selected room.
        alert(classes);
    });
}
