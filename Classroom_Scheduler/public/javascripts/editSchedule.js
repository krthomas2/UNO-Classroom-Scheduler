/*
*Created by All
* Gets Schedule information and puts it on edit page, in theory
*
 */
/**
 * Gets Schedule information and puts it on edit page
 * @class editSchedule
 * @param info
 *  Schedule _id for expected schedule data
 */
function editSchedule(info) {
    $.get('/getScheduleInfo', {id: info}, function (data) {  //This will make a call to the framework to get all the classrooms that are assigned to the selected room
        $("#_id").val(data[0]._id);
        $("#Room_Number").val(data[0].Room_Number);
    });
};

