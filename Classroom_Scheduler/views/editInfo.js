function editInfo(info) {
        $.get('/getRoomInfo', {room_number: info.value}, function (class_list) {  //This will make a call to the framework to get all the classrooms that are assigned to the selected room
            $('#Room_ID').val(class_list[0]._id);
            $('#Room_Number').val(class_list[0].Room_Number);
            $('#Max_Cap').val(class_list[0].Max_Capacity);
        });

    };