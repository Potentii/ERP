


// *Browsing the schedule-create page:
spa.onNavigate('schedule-create', (page, params) => {

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

            // *Retrieving the values of the all fields:
            let text_reason = $('#schedule-create-reason').val();
            let date_startdate = $('#schedule-create-start-date').val();
            let time_starttime = $('#schedule-create-start-time').val();
            let date_enddate = $('#schedule-create-end-date').val();
            let time_endtime = $('#schedule-create-end-time').val();

            // *Joining date and time:
            let start_date_time = date_startdate + ' ' + time_starttime;
            let end_date_time = date_enddate + ' ' + time_endtime;

            // *Setting variables user_id and vehicle_id:
            let user_id = selected_user;
            let vehicle_id = id;

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
                  // *Sending user to index page:
                  spa.navigateTo('');
               })
               .fail((xhr, textStatus, err) => {
                  console.log(textStatus);
               });
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
