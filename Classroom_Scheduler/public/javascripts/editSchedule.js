function editSchedule(info) {
    $.get('/getSchedule', {id: info}, function (data) {  //This will make a call to the framework to get all the classrooms that are assigned to the selected room
        $("#Room_Assigned").val(data[0].Room_Assigned);
        $("#MtgS").val(data[0].Class_Time.Start);
        $("#MtgE").val(data[0].Class_Time.End);
        $("#Pat").val(data[0].Class_Time.Days);
    });
};