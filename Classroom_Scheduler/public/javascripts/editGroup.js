function editGroup(info) {
        $.get('/getGroupInfo', {id: info}, function (list) {  //This will make a call to the framework to get all the classrooms that are assigned to the selected room
            $('#_id').val(list[0]._id);
            $('#Course_Title').val(list[0].Course_Title);
            $('#Instructor').val(list[0].Instructor);
            $('#Start').val(list[0].Start);
            $('#End').val(list[0].End);
            $('#Days').val(list[0].Days);
            $('#Class_Capacity').val(list[0].Class_Capacity);
        });
    };