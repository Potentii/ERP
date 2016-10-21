

// *Browsing the schedule-update page:
spa.onNavigate('schedule-update', (page, params) => {

   // *Playing the inflation animation on the FAB:
   anim.inflate($('#schedule-update-done-fab'));

   // *Checking if the user was authenticated:
   if(authenticated == true) {
      // *If true:
      // *Checking if the params is diferent undefined ou null:
      if(params && (params.id !== null && params.id !== undefined)){

         let schedule_id = params.id;
         let selected_vehicle;
         let selected_user;

         // *Listing the preview schedule info:
         request.getSchedule(schedule_id)
            .done(data => {
               // *Setting the vehicle id and user id:
               selected_vehicle = data.id_vehicle_fk;
               selected_user = data.id_user_fk;

               // *Passing the variables by reference:
               setup(schedule_id, selected_vehicle, selected_user);

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
            .fail(xhr => {
               console.log(xhr.responseJSON);
            });
      }else {
         // *Is not diferent of null ou undefined:
         // *Redirecting the user to index page:
         spa.navigateTo('');
      }
   }



   function setup(schedule_id, selected_vehicle, selected_user){

      // *Showing the vehicle in app bar:
      scheduleUpdateUtil().updateVehicleInfo(selected_vehicle);
      // *Showing the user in app bar:
      scheduleUpdateUtil().updateUserInfo(selected_user);



      // *Clicking on a vehicle header:
      $('#schedule-update-vehicle-app-bar').on('click' , e => {

         // *Opening the vehicle-picker page:
         dialogger.open('vehicle-picker', {previous_selected_vehicle: selected_vehicle}, (dialog, status, params) => {

            // *Checking if the case was positive:
            switch(status){
            case dialogger.DIALOG_STATUS_POSITIVE:
               // *Setting the id the vehicle selected by parameter:
               selected_vehicle = params.id;
               // *Updating the vehicle info selected:
               scheduleUpdateUtil().updateVehicleInfo(selected_vehicle);
               break;
            }
         });
      });



      // *Clicking on a user header:
      $('#schedule-update-user-app-bar').on('click', e => {

         // *Opening the user-picker page:
         dialogger.open('user-picker', {previous_selected_user: selected_user}, (dialog, status, params) => {

            // *Checking if the case was positive:
            switch(status){
            case dialogger.DIALOG_STATUS_POSITIVE:
               // *Setting the id the user selected by parameter:
               selected_user = params.id;
               // *Updating the user info selected:
               scheduleUpdateUtil().updateUserInfo(selected_user);
               break;
            }
         });
      });



      //* Listening for button to send a update to REST:
      $('#schedule-update-form').submit((e) => {
         e.preventDefault();
         // *:
         scheduleUpdateUtil().updateSchedule(schedule_id, selected_vehicle, selected_user);
      });
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

  // *Removing the event onClick:
  $('#schedule-update-vehicle-app-bar').off('click');
  $('#schedule-update-user-app-bar').off('click');
});



/**
 * Module that updates vehicle-info, user-info and all schedule
 * @author Ralf Pablo Braga Soares
 */
function scheduleUpdateUtil(){



   /**
   * Sends the schedule update request to REST
   * @param  {number} schedule_id   Id of schedule
   * @author Willian Conti Rezende
   */
   function updateSchedule(schedule_id, selected_vehicle, selected_user){

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
     let data_update_schedule = {
        reason: schedule_reason,
        start_date: start_date_schedule,
        end_date: end_date_schedule,
        id_vehicle_fk: selected_vehicle,
        id_user_fk: selected_user
     }



     // *Sending a Update Vehicle to the table vehicle on database:
     request.putSchedule(schedule_id, data_update_schedule)
        .done(data => {
           // *Showing the snack with the message:
           snack.open('Schedule updated', snack.TIME_SHORT);
           // *Going to index page:
           spa.navigateTo('');
        })
        .fail(xhr => {
           console.log(xhr.responseJSON);
        });
   }



   /**
    * Update the vehicle info
    * @param  {number} selected_vehicle id the vehicle
    * @author Ralf Pablo Braga Soares
    */
   function updateVehicleInfo(selected_vehicle){

      // *Replacing the vehicle in app bar:
      request.getVehicle(selected_vehicle)
         .done(data => {

            // *Setting the vehicle's photo:
            $('#schedule-update-vehicle-photo').css('background-image', data.photo?'url(' + rest_url + '/media/v/p/' + data.photo + ')':'');

            // *Setting the vehicle's title and plate:
            $('#schedule-update-vehicle-title').text(data.title + " - " + data.plate);

            // *Setting the vehicle's type, year and manufacturer:
            $('#schedule-update-vehicle-description').text(data.type + " - " + data.year + " - " + data.manufacturer);
         })
         .fail(xhr => {
            console.log(xhr.responseJSON);
         });
   }



   /**
    * Update the user info
    * @param  {number} selected_user id the user
    * @author Ralf Pablo Braga Soares
    */
   function updateUserInfo(selected_user){

      // *Replacing the user in app bar:
      request.getUser(selected_user)
         .done(data => {

            // *Setting the User name:
            $('#schedule-update-user-name').text(data.name);
         })
         .fail(xhr => {
            console.log(xhr.responseJSON);
         });
   }


   // *Exporting this module:
   return {
      updateSchedule: updateSchedule,
      updateVehicleInfo: updateVehicleInfo,
      updateUserInfo: updateUserInfo
   };
}
