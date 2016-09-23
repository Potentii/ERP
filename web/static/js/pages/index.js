
// *When navigate the page Index:
spa.onNavigate('', (page, params) => {

      // *Checking if the user was authenticated:
   if(authenticated == true) {
      // *If true:
      // *List the vehicles:
      requestVehicles();
   }
});

// *Define ul like empty after unload the page:
spa.onUnload('', (page, params) => {
   $('#vehicles-list').empty();
   var card_ul = $('<ul>');
   $(card_ul).attr("id", 'vehicles-list').addClass('list');
});

/**
* Requests the vehicles to the database
* @author Ralf Pablo Braga Soares
*/
function requestVehicles(){

   // *Getting the key and the token:
   let auth = getAuthentication();

   // *Requests Vehicles to the vehicles data base:
   $.ajax({
      url: 'http://localhost:3000/api/v1/vehicles',
      method: 'GET',
      headers: {'Access-Token': auth.token, 'Access-Key': auth.key}
   }).done((data, textStatus, xhr) => {
      // *Father ul:
      let card_ul = $('#vehicles-list');

      // *Iterate and create vehicles list:
      data.forEach(function(element, index){
         // *Father li:
         let card_li = $('<li>');
         $(card_li).attr("data-id", element.id).addClass('card box raised').appendTo(card_ul);

         // *Divs layout horizontal/vertical:
         let horizontal_layout_div = $('<div>').addClass('info flex-horizontal-layout').appendTo(card_li);
         let image_div = $('<div>').addClass('round-thumbnail size-4').css('background-image', 'url(http://localhost:3000/media/v/p/'+ element.photo +')').appendTo(horizontal_layout_div);
         let vertical_layout_div = $('<div>').addClass('vertical-layout').appendTo(horizontal_layout_div);

         // *Spans:
         let vehicle_title = $('<span>').addClass('primary').text(element.title+" - "+element.plate).appendTo(vertical_layout_div);
         $('<br>').appendTo(vehicle_title);
         let vehicle_description = $('<span>').addClass('secondary').text(element.year+" - "+element.type+" - "+element.manufacturer).appendTo(vertical_layout_div);

         // *Divs line horizontal/vertical:
         let horizontal_line_div = $('<div>').addClass('horizontal-line').appendTo(card_li);
         let vertical_line_div = $('<div>').addClass('vertical-line').appendTo(card_li);
         // *--------------------------HERE'S THE PART OF THE BALLS---------------------------------:
      });

      // *Event by clicking on a vehicle:
      $('li').on('click', '.info', function(){
         var id = $(this).parent('li').data("id");
         console.log(id);
         // *Sending the id the li by parameter:
         spa.navigateTo('vehicle-info', {id: id});
      });
   }).fail((xhr, textStatus, err) => {
      console.log(textStatus);
   });
}
