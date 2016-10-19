
// *Browsing the schedule-update page:
spa.onNavigate('schedule-update', (page, params) => {

   // *Checking if the params is diferent undefined ou null:
   if(params && (params.id !== null && params.id !== undefined)){
      let id = params.id;

      // *Checking if the user was authenticated:
      if(authenticated == true) {
         // *If true:
         // *Listing the preview schedule info:
         request.getSchedule(id)
            .done((data, textStatus, xhr) => {

               // *Setting the schedule reason:
               $('#schedule-update-reason').val(data.reason);

               // *Setting the schedule start date:
               let start_date = new Date(data.start_date);
               $('#schedule-update-start-date').val(df.asMysqlDate(start_date));

               // *Setting the schedule start time:
               let start_time = new Date(data.start_date);
               $('#schedule-update-start-time').val(df.asShortTime(start_time));

               // *Setting the schedule end time:
               let end_time = new Date(data.end_date);
               $('#schedule-update-end-time').val(df.asShortTime(end_time));

               // *Setting the schedule end date:
               let end_date = new Date(data.end_date);
               $('#schedule-update-end-date').val(df.asMysqlDate(end_date));


               // *Getting all MDL textfields:
               let mdl_textfields = document.querySelectorAll('#schedule-update-section .mdl-js-textfield');
               // *Updating the states of each MDL textfield:
               for(mdl_textfield of mdl_textfields){
                  // *Updating the status:
                  mdl_textfield.MaterialTextfield.updateClasses_();
               }
            })
            .fail((xhr, textStatus, err) => {
               console.log(textStatus);
            });
            //* Listening for button to send a update to REST:
            $('#schedule-update-form').on('submit', (e) => {
               e.preventDefault();
               updateSchedule(id);

            });
      }
   }else {
      // *Is not diferent of null ou undefined:
      // *Redirecting the user to index page:
      spa.navigateTo('');
   }
});


// *Cleaning listernes from this page:
spa.onUnload('schedule-update', (page) => {
  // *Cleaning the event submit:
  $('#schedule-update-form').off('submit');
  // *Cleaning inputs when the page is left:
  $('#schedule-update-reason').val('');
  $('#schedule-update-start-date').val('');
  $('#schedule-update-start-time').val('');
  $('#schedule-update-end-time').val('');
  $('#schedule-update-end-date').val('');
});

/**
* Sends the schedule update request to REST
* @param  {number} id   Id of schedule
* @author Willian Conti Rezende
*/
function updateSchedule(id){

  // *Getting data of inputs:
  let schedule_reason = $('#schedule-update-reason').val();
  let schedule_start_date = $('#schedule-update-start-date').val();
  let schedule_start_time = $('#schedule-update-start-time').val();
  let schedule_end_time = $('#schedule-update-end-time').val();
  let schedule_end_date = $('#schedule-update-end-date').val();

  // *Joining date and time:
  let start_date_schedule = schedule_start_date + ' ' + schedule_start_time;
  let end_date_schedule = schedule_end_date + ' ' + schedule_end_time;

  // *Create a objetct to receiva values to update a schedule:
  // *TODO Add the vehicle and user's id:
  let data_update_schedule = {
     reason: schedule_reason,
     start_date: start_date_schedule,
     end_date: end_date_schedule

  }



  // *Sending a Update Vehicle to the table vehicle on database:
  request.putSchedule(id, data_update_schedule)
     .done((data, textStatus, xhr) => {
        // *Showing the snack with the message:
        snack.open('Schedule updated', snack.TIME_SHORT);
        // *Going to index page:
        spa.navigateTo('');
     })
     .fail((xhr, textStatus, err) => {
        console.log(textStatus);
     });
}
