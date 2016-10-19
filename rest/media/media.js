// *Defining the media directories:
const MEDIA_DIR = '/media';
const VEHICLE_PHOTOS_DIR = '/v/p';
const USER_PHOTOS_DIR = '/u/p';

// *Defining the allowed mime types for media:
const VEHICLE_PHOTOS_ALLOWED_MIME_TYPES = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'image/bmp'];
const USER_PHOTOS_ALLOWED_MIME_TYPES = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'image/bmp'];

// *Requiring express, and its router:
const express = require('express');
const router = express.Router();
// *Requiring the directory module:
const directory = require('../dir/directory');


// *Creating the media directory:
directory.create([MEDIA_DIR, MEDIA_DIR + VEHICLE_PHOTOS_DIR, MEDIA_DIR + USER_PHOTOS_DIR]);


// *Defining the app directory path:
let app_path = directory.getAppDirectory() + '/' + directory.APP_NAME;
// *Defining the media directory path:
let media_path = app_path + MEDIA_DIR + '/';


// *Serving the media service:
router.use('/', express.static(media_path));



/**
 * Removes a media from its folder
 * @param  {string} file_name The file name (with extension)
 * @param  {string} directory The directory to remove the media file (under the media folder)
 * @return {Promise}          The removing promise
 * @author Guilherme Reginaldo Ruella
 */
function removeMedia(file_name, directory){
   // *Returning the promise:
   return new Promise((resolve, reject) => {
      // *Requiring the file system module:
      const fs = require('fs');

      // *Setting the file path:
      let file_path = app_path + MEDIA_DIR + directory + file_name;

      // *Checking if the file exists
      if(fs.existsSync(file_path)){
         // *If it exists:
         // *Removing it from media folder:
         fs.unlink(file_path, (err) => {
            // *Checking if there is some error:
            if(err){
               // *If there's:
               // *Rejecting the promise:
               reject(err);
            } else{
               // *If not:
               // *Resolving it:
               resolve();
            }
         });
      } else{
         // *If it doesn't exists:
         // *Resolving it:
         resolve();
      }
   });
}



/**
 * Inserts a new media resource inside the media folder
 * @param  {string} base64_media             A Base64 encoded file
 * @param  {string} directory                The directory to insert the media file (under the media folder)
 * @param  {string[]} [allowed_mime_types]   Optional. An array of allowed mime types, if not set all types will be allowed
 * @return {Promise}                         The creation promise, that returns the created file name, undefined, or an error
 * @author Guilherme Reginaldo Ruella
 */
function createBase64Media(base64_media, directory, allowed_mime_types){
   // *Returning the promise:
   return new Promise((resolve, reject) => {
      // *Requiring the modules:
      const fs = require('fs');
      const uuid = require('node-uuid');
      const mime_extension_translation = require('./mime-extension-translation');


      // *Checking if the base64 media is set:
      if(!base64_media){
         // *If it's not:
         // *Resolving the promise with an undefined file name:
         resolve(undefined);
         return;
      }


      // *Getting the file's mime type:
      let file_mime_type = /^data:(.*?);/i.exec(base64_media)[1];
      // *Getting the file's extension:
      let file_extension = mime_extension_translation.translateMime(file_mime_type);
      // *Getting the file's content:
      let base64_content = /^data:.*?;base64,(.*)/i.exec(base64_media)[1];


      // *Checking if the file data could be set:
      if(!file_mime_type || !file_extension || !base64_content){
         // *If not:
         // *Rejecting the promise:
         reject(new Error('Invalid encoded url'));
         return;
      }


      // *Checking if the file mime type is allowed:
      if(allowed_mime_types && !allowed_mime_types.some(m => m===file_mime_type)){
         // *If it's not:
         // *Rejecting the promise:
         reject(new Error('Invalid mime type'));
         return;
      }


      // *Initializing the file name variables:
      let file_path = '';
      let file_name = '';
      // *Initializing the file name creation flags:
      let tries = 0;
      let file_name_available = false;

      do{
         // *Generating the file name:
         file_name = uuid.v4() + '.' + file_extension;
         // *Building the file path:
         file_path = app_path + MEDIA_DIR + directory + file_name;
         // *Checking if the name is available:
         file_name_available = !fs.existsSync(file_path);
         // *Increasing the tries counter:
         tries++;

         // *Checking if it's in the fouth try, and the name wasn't available:
         if(tries==4 && !file_name_available){
            console.log(file_path);
            // *Rejecting the promise:
            reject(new Error('Unavailable file name'));
            return;
         }

         // *Running until the file name is available four times at max:
      } while(!file_name_available || tries<4);


      // *Writing the file:
      fs.writeFile(file_path, base64_content, 'base64', (err) => {
         // *Checking if there is some error:
         if(err){
            // *If there's:
            // *Rejecting the promise:
            reject(err);
         } else{
            // *If not:
            // *Resolving it:
            resolve(file_name);
         }
      });
   });
}



/**
 * Inserts the media inside the vehicles' photo path
 * @param  {string} base64_media    A Base64 encoded file
 * @return {Promise}                The creation promise, that returns the created file name, undefined, or an error
 * @author Guilherme Reginaldo Ruella
 */
function createBase64VehiclePhoto(base64_media){
   // *Redirecting to the following function:
   return createBase64Media(base64_media, VEHICLE_PHOTOS_DIR + '/', VEHICLE_PHOTOS_ALLOWED_MIME_TYPES);
}



/**
 * Inserts the media inside the users' photo path
 * @param  {string} base64_media    A Base64 encoded file
 * @return {Promise}                The creation promise, that returns the created file name, undefined, or an error
 * @author Guilherme Reginaldo Ruella
 */
function createBase64UserPhoto(base64_media){
   // *Redirecting to the following function:
   return createBase64Media(base64_media, USER_PHOTOS_DIR + '/', USER_PHOTOS_ALLOWED_MIME_TYPES);
}



/**
 * Removes a vehicle's photo
 * @param  {string} file_name The photo name (with extension)
 * @return {Promise}          The removing promise
 * @author Guilherme Reginaldo Ruella
 */
function removeVehiclePhoto(file_name){
   // *Redirecting to the following function:
   return removeMedia(file_name, VEHICLE_PHOTOS_DIR + '/');
}



/**
 * Removes an user's photo
 * @param  {string} file_name The photo name (with extension)
 * @return {Promise}          The removing promise
 * @author Guilherme Reginaldo Ruella
 */
function removeUserPhoto(file_name){
   // *Redirecting to the following function:
   return removeMedia(file_name, USER_PHOTOS_DIR + '/');
}



// *Exporting the module:
module.exports = {
   router: router,
   media_path: media_path,

   createBase64VehiclePhoto: createBase64VehiclePhoto,
   createBase64UserPhoto: createBase64UserPhoto,

   removeVehiclePhoto: removeVehiclePhoto,
   removeUserPhoto: removeUserPhoto
};
