


// *Browsing the index page:
spa.onNavigate('', (page, params) => {

   // *Checking if the user was authenticated:
   if(authenticated == true) {
      // *If true:
      // *Listing the vehicles:
      request.getVehicles()
         .done(data => {

            // *Building the vehicle's ul:
            let card_ul = $('#vehicles-list');

            // *Checking if the list is empty, adding the empty class if it is:
            if(!data.length) card_ul.addClass('empty');

            // *Iterating and creating the vehicles list:
            data.forEach((vehicle, index) => {

               // *Building the vehicle's li:
               let card_li = $('<li>');
               card_li.attr('data-id', vehicle.id).addClass('card box raised').appendTo(card_ul);

               // *Checking if the vehicle is inactive, adding the inactive class if it is:
               if(!vehicle.active) card_li.addClass('inactive');

               // *Building the vehicle's div:
               let horizontal_layout_div = $('<div>').addClass('info flex-horizontal-layout').appendTo(card_li);

               // *Building and setting the vehicle's photo:
               let image_div = $('<div>').addClass('round-thumbnail size-4').css('background-image', vehicle.photo?'url('+ rest_url + '/media/v/p/' + vehicle.photo +')':'').appendTo(horizontal_layout_div);

               // *Building the vehicle's div:
               let vertical_layout_div = $('<div>').addClass('vertical-layout').appendTo(horizontal_layout_div);

               // *Building and setting the vehicle's title and plate:
               let vehicle_title = $('<span>').addClass('primary').text(vehicle.title + ' - ' + vehicle.plate).appendTo(vertical_layout_div);
               $('<br>').appendTo(vehicle_title);

               // *Building and setting the vehicle's year, type and manufacturer:
               let vehicle_description = $('<span>').addClass('secondary').text(vehicle.year + ' - ' + vehicle.type + ' - ' + vehicle.manufacturer).appendTo(vertical_layout_div);

               // *Building the vehicle's divs:
               let horizontal_line_div = $('<div>').addClass('horizontal-line').appendTo(card_li);
               let vertical_line_div = $('<div>').addClass('vertical-line').appendTo(card_li);

               // *Building the schedule's balls ul:
               let button_ul = $('<ul>').addClass('schedules flex-horizontal-layout').appendTo(card_li);

               // *Building the schedule's balls and add amount of the schedules number:
               requestSchedules(vehicle.id, button_ul);

               // *Hiding the vehicle photo:
               image_div.css('visibility', 'hidden');
               // *Setting an offset timer:
               setTimeout(() => {
                  // *Showing up the vehicle photo:
                  image_div.css('visibility', 'visible');
                  // *Playing the inflate animation:
                  anim.inflate(image_div);
               }, index * 125);
            });

            // *Clicking on a vehicle's li:
            card_ul.on('click', 'li > .info', function(){
               let id = $(this).parent().data('id');

               // *Sending the id the li by parameter:
               spa.navigateTo('vehicle-info', {id: id});
            });
         })
         .fail(xhr => {
            console.log(xhr.responseJSON);
         });
   }

   // *When a user to click in add button:
   $('#vehicles-add-fab').on('click', function(){
      // *Sending the user's to the vehicle-create page:
      spa.navigateTo('vehicle-create');
   });
});



// *When user left the page:
spa.onUnload('', (page) => {

   // *Removing the list's empty class and the click listener:
   $('#vehicles-list')
      .removeClass('empty')
      .off('click');

   // *Removing all list items:
   $('#vehicles-list > li').remove();

   // *Removing the event click:
   $('#vehicles-list .schedules').off('click');
   $('#vehicles-add-fab').off('click');
});



/**
 * Request all the schedules from vehicle
 * @param  {number} id        The vehicle's id
 * @param  {button} button_ul The schedules container
 * @author Willian Conti Rezende
 */
function requestSchedules(id, button_ul) {

   // *Getting next days:
   let dates = getNextDays(14);

   // *Listing schedules of a vehicle on each day:
   dates.forEach((date, index) => {

      // *Building the schedules dates:
      let button_li = $('<li>').addClass('vertical-layout').attr('data-date', df.asMysqlDate(date)).appendTo(button_ul);
      let date_span = $('<span>').addClass('secondary').text(df.asShortDate(date)).appendTo(button_li);
      let button_schedule = $('<button>').attr("type", 'button').addClass('round').appendTo(button_li);

      // *Retrieving the quantity of reservations on a date:
      request.getVehiclesReservationsOnDate(id, df.asMysqlDate(date))
         .done(data => {
            // *Printing the quantity of reservations:
            button_schedule.text(data.length);
         });
   });

   // *Clicking on a schedule's button:
   button_ul.on('click', 'li', function(){
      let id = $(this).parent().parent().data('id');
      let date = $(this).data('date');

      // *Sending the id and date of the li by parameter:
      spa.navigateTo('schedules', {id: id, date: date});
   });
}



/**
 * Retrieves an array of days, begining on the given date
 * @param  {number} days_quantity Number of days
 * @param  {Date} from_date       The start date
 * @author Guilherme Reginaldo Ruella
 */
function getNextDays(days_quantity, from_date){
   var vet = [];

   for(var i=0; i<days_quantity; i++) {
      var current_date = from_date || new Date();
      var next_date_ms = current_date.setDate(current_date.getDate() + i);
      var next_date = new Date(next_date_ms);
      vet.push(next_date);
   }
   return vet;
}



/**
 * Adds hours given a timestamp
 * @param {Date} date     The date object
 * @param {number} hours  The ammount of hours to add
 * @author Guilherme Reginaldo Ruella
 * @return {Date}  The new date with the added hours
 */
function addHours(date, hours){
   date = new Date(date);
   return new Date(date.setHours(date.getHours() + hours));
}
