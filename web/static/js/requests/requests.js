
// *Global Variables:
let rest_url = 'http://localhost:3000';


/**
 * Module that makes requests to the rest server
 * @namespace REQUEST
 */
var request = (function(){



   /**
   * Recovers the authentication keys in cache
   * @return {object} JSON The token and the user key
   * @author Ralf Pablo Braga Soares
   */
   function retrieveAccessCredentials() {
      let token = JSON.parse(localStorage.getItem('token'));
      let key = JSON.parse(localStorage.getItem('key'));
      return {token: token, key: key};
   }


// *------------------------ GETS -------------------------------:


   /**
    * Returns the object of the authentication
    * @return {jqXHR}  The ajax request
    * @author Ralf Pablo Braga Soares
    */
   function getAuth(){

      // *Getting the key and the token:
      let auth = retrieveAccessCredentials();

      return $.ajax({
         url: rest_url + '/auth',
         method: 'GET',
         headers: {'Access-Token': auth.token, 'Access-Key': auth.key}
      });
   }



   /**
    * Returns the object of a vehicle
    * @param  {number} id Vehicle id
    * @return {jqXHR}     The ajax request
    * @author Ralf Pablo Braga Soares
    */
   function getVehicle(id){

      // *Getting the key and the token:
      let auth = retrieveAccessCredentials();

      return $.ajax({
         url: rest_url + '/api/v1/vehicles/' + id,
         method: 'GET',
         headers: {'Access-Token': auth.token, 'Access-Key': auth.key}
      });
   }



   /**
    * Returns the object of a schedule
    * @param  {number} id Schedule id
    * @return {jqXHR}     The ajax request
    * @author Ralf Pablo Braga Soares
    */
   function getSchedule(id){

      // *Getting the key and the token:
      let auth = retrieveAccessCredentials();

      return $.ajax({
         url: rest_url + '/api/v1/schedules/' + id,
         method: 'GET',
         headers: {'Access-Token': auth.token, 'Access-Key': auth.key}
      });
   }



   /**
   * Returns the object of a schedules
   * @return {jqXHR}  The ajax request
   * @author Ralf Pablo Braga Soares
   */
   function getSchedules(){

      // *Getting the key and the token:
      let auth = retrieveAccessCredentials();

      // *Requesting all schedules:
      return $.ajax({
         url: rest_url + '/api/v1/schedules/',
         method: 'GET',
         headers: {'Access-Token': auth.token, 'Access-Key': auth.key}
      });
   }



   /**
   * Returns the object of a vehicles
   * @return {jqXHR}  The ajax request
   * @author Ralf Pablo Braga Soares
   */
   function getVehicles(){

      // *Getting the key and the token:
      let auth = retrieveAccessCredentials();

      // *Requesting all vehicles:
      return $.ajax({
         url: rest_url + '/api/v1/vehicles/',
         method: 'GET',
         headers: {'Access-Token': auth.token, 'Access-Key': auth.key}
      });
   }



   /**
   * Returns the object of a users
   * @return {jqXHR}  The ajax request
   * @author Ralf Pablo Braga Soares
   */
   function getUsers(){

      // *Getting the key and the token:
      let auth = retrieveAccessCredentials();

      // *Requesting users:
      return $.ajax({
         url: rest_url + '/api/v1/users/',
         method: 'GET',
         headers: {'Access-Token': auth.token, 'Access-Key': auth.key}
      });
   }



   /**
    * Returns the object of a user
    * @param  {number} id User id
    * @return {jqXHR}     The ajax request
    * @author Ralf Pablo Braga Soares
    */
   function getUser(id){

      // *Getting the key and the token:
      let auth = retrieveAccessCredentials();

      // *Requesting user:
      return $.ajax({
         url: rest_url + '/api/v1/users/' + id,
         method: 'GET',
         headers: {'Access-Token': auth.token, 'Access-Key': auth.key}
      });
   }



   /**
   * Returns the object of all schedules the vehicle
   * @param  {number} id Vehicle id
   * @return {jqXHR}     The ajax request
   * @author Ralf Pablo Braga Soares
   */
   function getVehiclesSchedules(id){

      // *Getting the key and the token:
      let auth = retrieveAccessCredentials();

      return $.ajax({
         url: rest_url + '/api/v1/vehicles/' + id + '/schedules/',
         method: 'GET',
         headers: {'Access-Token': auth.token, 'Access-Key': auth.key}
      });
   }



   /**
   * Returns the object of all schedules the user
   * @param  {number} id User id
   * @return {jqXHR}     The ajax request
   * @author Ralf Pablo Braga Soares
   */
   function getUsersSchedules(id){

      // *Getting the key and the token:
      let auth = retrieveAccessCredentials();

      return $.ajax({
         url: rest_url + '/api/v1/users/' + id + '/schedules/',
         method: 'GET',
         headers: {'Access-Token': auth.token, 'Access-Key': auth.key}
      });
   }



   /**
   * Returns the object of all reservation the vehicle
   * @param  {number} id Vehicle id
   * @return {jqXHR}     The ajax request
   * @author Ralf Pablo Braga Soares
   */
   function getVehiclesReservations(id){

      // *Getting the key and the token:
      let auth = retrieveAccessCredentials();

      return $.ajax({
         url: rest_url + '/api/v1/vehicles/' + id + '/reservations/',
         method: 'GET',
         headers: {'Access-Token': auth.token, 'Access-Key': auth.key}
      });
   }



   /**
    * Returns the object the vehicle reservation for this date
    * @param  {number} id Vehicle id
    * @param  {date} date Schedule date
    * @return {jqXHR}     The ajax request
    * @author Ralf Pablo Braga Soares
    */
   function getVehiclesReservationsOnDate(id, date){

      // *Getting the key and the token:
      let auth = retrieveAccessCredentials();

      return $.ajax({
         url: rest_url + '/api/v1/vehicles/' + id + '/reservations/' + date,
         method: 'GET',
         headers: {'Access-Token': auth.token, 'Access-Key': auth.key}
      });
   }



   /**
   * Returns the object of all reservation the user
   * @param  {number} id User id
   * @return {jqXHR}     The ajax request
   * @author Ralf Pablo Braga Soares
   */
   function getUsersReservations(id){

      // *Getting the key and the token:
      let auth = retrieveAccessCredentials();

      return $.ajax({
         url: rest_url + '/api/v1/users/' + id + '/reservations/',
         method: 'GET',
         headers: {'Access-Token': auth.token, 'Access-Key': auth.key}
      });
   }



   /**
    * Returns the object the user reservation for this date
    * @param  {number} id User id
    * @param  {date} date Schedule date
    * @return {jqXHR}     The ajax request
    * @author Ralf Pablo Braga Soares
    */
   function getUsersReservationsOnDate(id, date){

      // *Getting the key and the token:
      let auth = retrieveAccessCredentials();

      return $.ajax({
         url: rest_url + '/api/v1/users/' + id + '/reservations/' + date,
         method: 'GET',
         headers: {'Access-Token': auth.token, 'Access-Key': auth.key}
      });
   }


// *------------------------ POSTS -------------------------------:


   /**
    * Returns the send of the Username and Password to the server
    * @return {jqXHR}  The ajax request
    * @author Ralf Pablo Braga Soares
    */
   function postAuth(object_data){

      // *Sending the insert request:
      return $.ajax({
         url: rest_url + '/auth',
         method: 'POST',
         contentType: 'application/json;charset=UTF-8',
         data: JSON.stringify(object_data)
      });
   }



   /**
    * Returns the send message and adds a new schedule
    * @return {jqXHR}  The ajax request
    * @author Ralf Pablo Braga Soares
    */
   function postSchedule(object_data){

      // *Getting the key and the token:
      let auth = retrieveAccessCredentials();

      // *Sending the insert request:
      return $.ajax({
         url: rest_url + '/api/v1/schedules',
         method: 'POST',
         contentType: 'application/json;charset=UTF-8',
         data: JSON.stringify(object_data),
         headers: {'Access-Token': auth.token, 'Access-Key': auth.key}
      });
   }


   /**
    * Returns the send message and adds a new user
    * @return {jqXHR}  The ajax request
    * @author Ralf Pablo Braga Soares
    */
   function postUser(object_data){

      // *Getting the key and the token:
      let auth = retrieveAccessCredentials();

      // *Sending the insert request:
      return $.ajax({
         url: rest_url + '/api/v1/users',
         method: 'POST',
         contentType: 'application/json;charset=UTF-8',
         data: JSON.stringify(object_data)
      });
   }


   /**
    * Returns the send message and adds a new vehicle
    * @return {jqXHR}  The ajax request
    * @author Ralf Pablo Braga Soares
    */
   function postVehicle(object_data){

      // *Getting the key and the token:
      let auth = retrieveAccessCredentials();

      // *Sending the insert request:
      return $.ajax({
         url: rest_url + '/api/v1/vehicles',
         method: 'POST',
         contentType: 'application/json;charset=UTF-8',
         data: JSON.stringify(object_data)
      });
   }


// *------------------------ PUTS -------------------------------:


   /**
    * Returns the send message and updates the user
    * @param  {number} id User id
    * @return {jqXHR}     The ajax request
    * @author Ralf Pablo Braga Soares
    */
   function putUser(id, object_data){

      // *Getting the key and the token:
      let auth = retrieveAccessCredentials();

      // *Sending the update request:
      return $.ajax({
         url: rest_url + '/api/v1/users/' + id,
         method: 'PUT',
         contentType: 'application/json;charset=UTF-8',
         data: JSON.stringify(object_data)
      });
   }



   /**
    * Returns the send message and updates the vehicle
    * @param  {number} id Vehicle id
    * @return {jqXHR}     The ajax request
    * @author Ralf Pablo Braga Soares
    */
   function putVehicle(id, object_data){

      // *Getting the key and the token:
      let auth = retrieveAccessCredentials();

      // *Sending the update request:
      return $.ajax({
         url: rest_url + '/api/v1/vehicles/' + id,
         method: 'PUT',
         contentType: 'application/json;charset=UTF-8',
         data: JSON.stringify(object_data)
      });
   }



   /**
    * Returns the send message and updates the schedule
    * @param  {number} id Schedule id
    * @return {jqXHR}     The ajax request
    * @author Ralf Pablo Braga Soares
    */
   function putSchedule(id, object_data){

      // *Getting the key and the token:
      let auth = retrieveAccessCredentials();

      // *Sending the update request:
      return $.ajax({
         url: rest_url + '/api/v1/schedules/' + id,
         method: 'PUT',
         contentType: 'application/json;charset=UTF-8',
         data: JSON.stringify(object_data)
      });
   }


   // *------------------------ DELETES -------------------------------:


   /**
   * Returns the send message and deletes the user
   * @param  {number} id User id
   * @return {jqXHR}     The ajax request
   * @author Ralf Pablo Braga Soares
   */
   function deleteUser(id){

      // *Getting the key and the token:
      let auth = retrieveAccessCredentials();

      // *Sending the update request:
      return $.ajax({
         url: rest_url + '/api/v1/users/' + id,
         method: 'DELETE',
         contentType: 'application/json;charset=UTF-8',
      });
   }



   /**
   * Returns the send message and deletes the vehicle
   * @param  {number} id Vehicle id
   * @return {jqXHR}     The ajax request
   * @author Ralf Pablo Braga Soares
   */
   function deleteVehicle(id){

      // *Getting the key and the token:
      let auth = retrieveAccessCredentials();

      // *Sending the update request:
      return $.ajax({
         url: rest_url + '/api/v1/vehicles/' + id,
         method: 'DELETE',
         contentType: 'application/json;charset=UTF-8',
      });
   }



   /**
   * Returns the send message and deletes the schedule
   * @param  {number} id Schedule id
   * @return {jqXHR}     The ajax request
   * @author Ralf Pablo Braga Soares
   */
   function deleteSchedule(id){

      // *Getting the key and the token:
      let auth = retrieveAccessCredentials();

      // *Sending the update request:
      return $.ajax({
         url: rest_url + '/api/v1/schedules/' + id,
         method: 'DELETE',
         contentType: 'application/json;charset=UTF-8',
      });
   }

   // *Exporting this module:
   return {
      getAuth: getAuth,
      getVehicle: getVehicle,
      getVehicles: getVehicles,
      getSchedule: getSchedule,
      getSchedules: getSchedules,
      getVehiclesSchedules: getVehiclesSchedules,
      getUsersSchedules: getUsersSchedules,
      getVehiclesReservations: getVehiclesReservations,
      getVehiclesReservationsOnDate: getVehiclesReservationsOnDate,
      getUsersReservations: getUsersReservations,
      getUsersReservationsOnDate: getUsersReservationsOnDate,
      getUser: getUser,
      getUsers: getUsers,

      postAuth: postAuth,
      postSchedule: postSchedule,
      postUser: postUser,
      postVehicle: postVehicle,

      putUser: putUser,
      putVehicle: putVehicle,
      putSchedule: putSchedule,

      deleteUser: deleteUser,
      deleteVehicle: deleteVehicle,
      deleteSchedule: deleteSchedule,

      retrieveAccessCredentials: retrieveAccessCredentials
   };
})();
