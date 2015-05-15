"Course_Title": "DATA STRUCTURES",
    "Instructor": "Brian Dorn",
    "Start": "4:00:00 PM",
    "End": "5:15:00 PM",
    "Days": "TR",
    "Class_Capacity": "25"

function editGroup(info) {
        $.get('/getRoomInfo', {room_number: info}, function (class_list) {  //This will make a call to the framework to get all the classrooms that are assigned to the selected room
            $('#Room_ID').val(class_list[0]._id);
            $('#Room_Number').val(class_list[0].Room_Number);
            $('#Max_Cap').val(class_list[0].Max_Capacity);
        });
    };