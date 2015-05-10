function editClass(info) {
        $.get('/getClassInfo', {id: info}, function (data) {  //This will make a call to the framework to get all the classrooms that are assigned to the selected room
            $("#Class").val(data[0].Class_ID);
            $("#Catalog").val(data[0].Course_ID);
            $("#Subject").val(data[0].Subject);
            $("#Title").val(data[0].Course_Title);
            $("#Section").val(data[0].Section_ID);
            $("#Component").val(data[0].Lecture_Type);
            $("#MtgS").val(data[0].Class_Time.Start);
            $("#MtgE").val(data[0].Class_Time.End);
            $("#Pat").val(data[0].Class_Time.Days);
            $("#First").val(data[0].Instructor.First_Name);
            $("#Last").val(data[0].Instructor.Last_Name);
            $("#Cap").val(data[0].Class_Capacity);
            $("#Tot").val(data[0].Tot_Enrl);
            $("#Start").val(data[0].Start_Date);
            $("#End").val(data[0].End_Date);
            $("#Session").val(data[0].Session);
            $("#Location").val(data[0].Location);
            $("#Mode").val(data[0].Mode);
            $("#CrsAtr_Val").val(data[0].CrsAtr_Val);
            $("#ID").val(data[0]._id);
        });
    };