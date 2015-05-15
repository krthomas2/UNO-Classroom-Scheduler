/* Created by Kenneth
*Early prototype to scheduler
 */
/**
 * @class editSchedule
 * @param info
 *  Schedule _id for expected schedule data
 * @description
 * Early prototype to scheduler
 */
function editSchedule(info) {
    $.get('/getSchedule', {id: info}, function (data) {  //This will make a call to the framework to get all the classrooms that are assigned to the selected room
        $("#Room_Assigned").val(data[0].Room_Assigned);
        $("#MtgS").val(data[0].Class_Time.Start);
        $("#MtgE").val(data[0].Class_Time.End);
        $("#Pat").val(data[0].Class_Time.Days);
    });
};

function editSchedule() {
    myname = "Joe";
    alert(myname);
}
db.open(function(err, db) {
    db.collection('Customers', function(err, collection) {
        collection.find(function(err, cursor) {
            cursor.each(function(err, customer) {
                if(customer != null){
                    console.log('First Name: ' + customer.firstName);
                    console.log('Last Name: ' + customer.lastName);
                }
                else{
                    db.close();
                }
            });
        });
    });
});