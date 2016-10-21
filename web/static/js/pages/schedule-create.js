


// *Browsing the schedule-create page:
spa.onNavigate('schedule-create', (page, params) => {

   // *Playing the inflation animation on the FAB:
   anim.inflate($('#schedule-create-done-fab'));

   // *Checking if the params is diferent undefined ou null:
   if(params && (params.id !== null && params.id !== undefined)){
      let id = params.id;
      let selected_user;

      // *Setting user id the cache in the variable:
      let idUser = request.retrieveAccessCredentials().id;

      // *Checking if the user was authenticated:
      if(authenticated == true) {
         // *If true:
         // *Showing the vehicle in app bar:
         request.getVehicle(id)
            .done((data, textStatus, xhr) => {
               // *Setting the vehicle's photo:
               $('#schedule-create-vehicle-photo').css('background-image', 'url(' + rest_url + '/media/v/p/' + data.photo + ')');

               // *Setting the vehicle's title and plate:
               $('#schedule-create-vehicle-title').text(data.title + " - " + data.plate);

               // *Setting the vehicle's type, year and manufacturer:
               $('#schedule-create-vehicle-description').text(data.type + " - " + data.year + " - " + data.manufacturer);

            })
            .fail((xhr, textStatus, err) => {
               console.log(textStatus);
            });

         // *Showing the user in app bar:
         request.getUser(idUser)
            .done((data, textStatus, xhr) => {
               // *Setting the User name:
               $('#schedule-create-user-name').text(data.name);
            })
            .fail((xhr, textStatus, err) => {
               console.log(textStatus);
            });



         // *Clicking on a user header:
         $('#schedule-create-user-app-bar').on('click', function(){

            // *Opening the user-picker page:
            dialogger.open('user-picker', {previous_selected_user: idUser.id}, (dialog, status, params) => {

               // *Checking if the case was positive:
               switch(status){
               case dialogger.DIALOG_STATUS_POSITIVE:
                  selected_user = params.id;

                  // *Replacing the user in app bar:
                  request.getUser(selected_user)
                     .done((data, textStatus, xhr) => {
                        selected_user = data.id;

                        // *Setting the User name:
                        $('#schedule-create-user-name').text(data.name);
                     })
                     .fail((xhr, textStatus, err) => {
                        console.log(textStatus);
                     });
                  break;
               }
            });
         });



         // *When the user submit the form:
         $('#schedule-create-form').submit((e) => {
            // *The default action of the event will not be triggered:
            e.preventDefault();
            // *
            postSchedule(selected_user, id);
         });
      }
   } else {
      // *Is not diferent of null ou undefined:
      // *Redirecting the user to schedules page:
      spa.navigateTo('schedules');
   }
});



// *When the user left the page:
spa.onUnload('schedule-create', (page)=> {
   // *Removing the submit listeners from the form:
   $('#schedule-create-form').off('submit');

   // *Removing the event onClick:
   $('#schedule-create-user-app-bar').off('click');
});

// *Cleaning listernes from this page:
spa.onUnload('schedule-create', (page) => {
   // *Cleaning the event submit:
   $('#schedule-create-form').off('submit');
   // *Cleaning inputs when the page is left:
   $('#schedule-create-reason').val('');
   $('#schedule-create-start-date').val('');
   $('#schedule-create-start-time').val('');
   $('#schedule-create-end-date').val('');
   $('#schedule-create-end-time').val('');
});

// * Post a new schedule in database
function postSchedule(user_id, vehicle_id){

   // *Retrieving the values of the all fields:
   let text_reason = $('#schedule-create-reason').val();
   let date_startdate = $('#schedule-create-start-date').val();
   let time_starttime = $('#schedule-create-start-time').val();
   let date_enddate = $('#schedule-create-end-date').val();
   let time_endtime = $('#schedule-create-end-time').val();

   // *Joining date and time:
   let start_date_time = date_startdate + ' ' + time_starttime;
   let end_date_time = date_enddate + ' ' + time_endtime;

   // *Saving all values in a object_data:
   let object_data = {
      id_vehicle_fk: vehicle_id,
      id_user_fk: user_id,
      reason: text_reason,
      start_date: start_date_time,
      end_date: end_date_time
   };

   request.postSchedule(object_data)
      .done((data, textStatus, xhr) => {
         // *Showing the snack with the message:
         snack.open('Schedule Created', 4000);
         // *Sending user to index page:
         spa.navigateTo('');
      })
      .fail((xhr, textStatus, err) => {
         console.log(xhr.responseJSON);
         let text = {title: '', message: ''};

         // *Switch to receive error code
         switch(xhr.responseJSON.err_code){

         // *Case when the user or the vehicle referenced doesn't exist
         case 'ERR_REF_NOT_FOUND':
            text.title = srm.get('schedule-create-dialog-error-ref-title');
            text.message = srm.get('schedule-create-dialog-error-ref-message');
            break;

         // *Case there is some required field not filled
         case 'ERR_MISSING_FIELD':
            text.title = srm.get('schedule-create-dialog-error-missingfield-title');
            text.message = srm.get('schedule-create-dialog-error-missingelfield-message');
            break;

         // *Case the informed schedule period isn't avaible
         case 'ERR_INVALID_TIMESPAN':
            text.title = srm.get('schedule-create-dialog-error-timespan-title');
            text.message = srm.get('schedule-create-dialog-error-timespan-message');
            break;

         // *Case the vehicle isn't avaible in the specified period
         case 'ERR_RES_UNAVAILABLE':
            text.title = srm.get('schedule-create-dialog-error-unavaible-title');
            text.message = srm.get('schedule-create-dialog-error-unavaible-message');
            break;

         // *Case the vehicle isn't active
         case 'ERR_VEHICLE_NOT_ACTIVE':
            text.title = srm.get('schedule-create-dialog-error-vnotactive-title');
            text.message = srm.get('schedule-create-dialog-error-notactive-message');
            break;

         // *Case the user isn't active
         case 'ERR_USER_NOT_ACTIVE':
            text.title = srm.get('schedule-create-dialog-error-unotactive-title');
            text.message = srm.get('schedule-create-dialog-error-unotactive-message');
            break;

         // *Case the user isn't authorized
         case 'ERR_NOT_AUTHORIZED':
            text.title = srm.get('schedule-create-dialog-error-authorized-title');
            text.message = srm.get('schedule-create-dialog-error-authorized-message');
            break;

         // *Action default of switch:
         default:
            text.title = srm.get('schedule-create-dialog-error-default-title');
            text.message = srm.get('schedule-create-dialog-error-default-message');
            break;
         }

         // *Open a dialog consent for the user:
         dialogger.open('default-notice', text);
});
}
