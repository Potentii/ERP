


// *Browsing the vehicle-info page:
spa.onNavigate('vehicle-info', (page, params) => {

   // *Checking if the params is diferent undefined ou null:
   if(params && (params.id !== null && params.id !== undefined)){
      let id = params.id;
      // *Checking if the user was authenticated:
      if(authenticated == true) {
         // *If true:
         // *Listing the vehicle:
         requestVehicleInfo(id);
      }
   } else {
      // *Is not diferent of null ou undefined:
      // *Redirecting the user to index page:
      spa.navigateTo('');
   }
});



/**
 * Requests the vehicle to the database
 * @param  {number} id number ID the vehicle
 * @author Ralf Pablo Braga Soares
 */
function requestVehicleInfo(id){

   // *Getting the key and the token:
   let auth = getAuthentication();

   // *Requesting Vehicle to the vehicles data base:
   $.ajax({
      url: rest_url + '/api/v1/vehicles/' + id,
      method: 'GET',
      headers: {'Access-Token': auth.token, 'Access-Key': auth.key}
      }).done((data, textStatus, xhr) => {

         // *Setting the vehicle's photo:
         $('#vehicle-info-photo').css('background-image', 'url(' + rest_url + '/media/v/p/'+ data.photo +')');

         // *Setting the vehicle's title and plate:
         $('#vehicle-info-title').text(data.title+" - "+data.plate);

         // *Setting the vehicle's type, year and manufacturer:
         $('#vehicle-info-description').text(data.type+" - "+data.year+" - "+data.manufacturer);

         // *Setting the vehicle's renavam and registred date:
         $('#vehicle-info-renavam').text(data.renavam);
         let date = new Date(data.date);
         $('#vehicle-info-date').text(df.asMysqlDate(date));

      }).fail((xhr, textStatus, err) => {
         console.log(textStatus);
      });
}
