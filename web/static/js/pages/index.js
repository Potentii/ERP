


// *Browsing the index page:
spa.onNavigate('', (page, params) => {

      // *Checking if the user was authenticated:
   if(authenticated == true) {
      // *If true:
      // *Listing the vehicles:
      requestVehicles();
   }
});



// *Defining ul like empty and disabling events after unload the page:
spa.onUnload('', (page, params) => {

   // *Setting the element ul to the variable:
   let card_ul = $('#vehicles-list');

   // *Wiping the element ul:
   card_ul.empty();

   // *Removing the event click:
   card_ul.off('click');

   // *Setting the the element to the variable :
   let button_ul = $('.schedules');

   // *Removing the event click:
   button_ul.off('click');
});



/**
* Requests the vehicles to the database and lists all
* @author Ralf Pablo Braga Soares
*/
function requestVehicles(){

   // *Getting the key and the token:
   let auth = getAuthentication();

   // *Requesting Vehicles to the vehicles data base:
   $.ajax({
      url: rest_url + '/api/v1/vehicles',
      method: 'GET',
      headers: {'Access-Token': auth.token, 'Access-Key': auth.key}
   }).done((data, textStatus, xhr) => {

      // *Building the vehicle's ul:
      let card_ul = $('#vehicles-list');

      // *Iterating and creating the vehicles list:
      data.forEach((element, index) => {

         // *Building the vehicle's li:
         let card_li = $('<li>');
         card_li.attr("data-id", element.id).addClass('card box raised').appendTo(card_ul);

         // *Building the vehicle's div:
         let horizontal_layout_div = $('<div>').addClass('info flex-horizontal-layout').appendTo(card_li);

         // *Building and setting the vehicle's photo:
         let image_div = $('<div>').addClass('round-thumbnail size-4').css('background-image', 'url('+ rest_url + '/media/v/p/' + element.photo +')').appendTo(horizontal_layout_div);

         // *Building the vehicle's div:
         let vertical_layout_div = $('<div>').addClass('vertical-layout').appendTo(horizontal_layout_div);

         // *Building and setting the vehicle's title and plate:
         let vehicle_title = $('<span>').addClass('primary').text(element.title+" - "+element.plate).appendTo(vertical_layout_div);
         $('<br>').appendTo(vehicle_title);

         // *Building and setting the vehicle's year, type and manufacturer:
         let vehicle_description = $('<span>').addClass('secondary').text(element.year+" - "+element.type+" - "+element.manufacturer).appendTo(vertical_layout_div);

         // *Building the vehicle's divs:
         let horizontal_line_div = $('<div>').addClass('horizontal-line').appendTo(card_li);
         let vertical_line_div = $('<div>').addClass('vertical-line').appendTo(card_li);

         //
         let button_ul = $('<ul>').addClass('schedules flex-horizontal-layout').appendTo(card_li);

         //
         requestSchedules(element.id, button_ul);
      });

      // *Clicking on a vehicle's li:
      card_ul.on('click', 'li > .info', function(){
         let id = $(this).parent().data('id');

         // *Sending the id the li by parameter:
         spa.navigateTo('vehicle-info', {id: id});
      });
   }).fail((xhr, textStatus, err) => {
      console.log(textStatus);
   });
}


//
function requestSchedules(id, button_ul) {

   // *Getting the key and the token:
   let auth = getAuthentication();

   //
   let dates = getNextDays(6);

   //
   dates.forEach((element, index) => {

      //
      let button_li = $('<li>').addClass('vertical-layout').attr('data-date', df.asMysqlDate(element)).appendTo(button_ul);
      let date_span = $('<span>').addClass('secondary').text(df.asShortDate(element)).appendTo(button_li);
      let button_schedule = $('<button>').attr("type", 'button').addClass('round').appendTo(button_li);

      //
      $.ajax({
         url: rest_url + '/api/v1/vehicles/' + id + '/reservations/' + df.asMysqlDate(element),
         method: 'GET',
         headers: {'Access-Token': auth.token, 'Access-Key': auth.key}
      }).done((data, textStatus, xhr) => {

         //
         button_schedule.text(data.length);

      }).fail((xhr, textStatus, err) => {
         console.log(textStatus);
      });
   });

      // *Clicking on a schedule's button:
      button_ul.on('click', 'li > button', function(){
         let id = $(this).parent().parent().parent().data('id');
         let date = $(this).parent().data('date');

         // *Sending the id and date of the li by parameter:
         spa.navigateTo('schedules', {id: id, date: date});
      });
}


//
function getNextDays(days_quantity){
   var vet = [];

   for(var i=0; i<days_quantity; i++) {
      var data_atual = new Date();
      var data_futura_ms = data_atual.setDate(data_atual.getDate() + i);
      var data_futura = new Date(data_futura_ms);
      vet.push(data_futura);
   }
   return vet;
}
