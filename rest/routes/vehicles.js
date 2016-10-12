const pooler = require('../database/pooler');



/**
 * Retrieves all resources
 * @author Guilherme Reginaldo Ruella
 */
function retrieveAll(req, res, next){
   // *Querying the database for all resources:
   pooler.query('select * from ??', ['vehicle'])
      .then(result => {
         // *Sending the resources as response:
         res.status(200)
            .json(result.rows)
            .end();
      })
      .catch(err => {
         // *If something went wrong:
         // *Sending a 500 error response:
         res.status(500)
            .send('Something went wrong')
            .end();
      });
}



/**
 * Retrieves a single resource, given its id
 * @author Guilherme Reginaldo Ruella
 */
function retrieve(req, res, next){
   // *Getting the id from request params:
   let id = req.params.id;

   // *Querying the database for the resource:
   pooler.query('select * from ?? where ?? = ?', ['vehicle', 'id', id])
      .then(result => {
         // *Checking if there is something on result:
         if(result.rows.length){
            // *If there is:
            // *Sending the first resource as response:
            res.status(200)
               .json(result.rows[0])
               .end();
         } else{
            // *If not:
            // *Sending a 404 response:
            res.status(404)
               .send('Resource not found')
               .end();
         }
      })
      .catch(err => {
         // *If something went wrong:
         // *Sending a 500 error response:
         res.status(500)
            .send('Something went wrong')
            .end();
      });
}



/**
 * Creates a new resource in the database
 * @author Guilherme Reginaldo Ruella
 */
function create(req, res, next){
   // *Requesting the media system:
   const media = require('../media/media');

   // *Getting the body of the request:
   let values = req.body;
   // *Getting the Base64 encoded photo:
   let base64_file = values.photo || undefined;

   // *Inserting the photo inside the media system:
   media.createBase64VehiclePhoto(base64_file)
      .then(file_name => {

         // *Starting the photo removing promise:
         new Promise((resolve, reject) => {
            // *Changing the photo to the created file name:
            values.photo = file_name;

            // *Inserting the resource in the database:
            pooler.query('insert into ?? set ?', ['vehicle', values])
               .then(result => {
                  // *Responding with the inserted element's id:
                  res.status(201)
                     .json({id: result.rows.insertId})
                     .end();

                  // *Resolving the promise:
                  resolve();
               })
               .catch(err => {
                  // *If something went wrong:
                  // *Checking the error code:
                  switch(err.code){
                  case 'ER_NO_DEFAULT_FOR_FIELD':
                     // *Sending a 400 error response:
                     res.status(400)
                        .send('Missing required field')
                        .end();
                     break;
                  case 'ER_DUP_ENTRY':
                     // *Sending a 400 error response:
                     res.status(400)
                        .send('The resource already exists')
                        .end();
                     break;
                  default:
                     // *Sending a 500 error response:
                     res.status(500)
                        .send('Something went wrong')
                        .end();
                  }

                  // *Rejecting the promise:
                  reject();
               });
         })
         .catch(() => {
            // *Reverting the file insertion:
            media.removeVehiclePhoto(file_name);
         });
      })
      .catch(err => {
         // *Sending a 500 error response:
         res.status(500)
            .send('Something went wrong')
            .end();
      });
}



/**
 * Updates a resource in the database
 * @author Guilherme Reginaldo Ruella
 */
function update(req, res, next){
   // *Requesting the media system:
   const media = require('../media/media');

   // *Getting the id from request params:
   let id = req.params.id;
   // *Getting the body of the request:
   let values = req.body;
   // *Getting the Base64 encoded photo:
   let base64_file = values.photo || undefined;


   // *Inserting the photo inside the media system:
   media.createBase64VehiclePhoto(base64_file)
      .then(file_name => {
         // *Setting the last photo name as undefined:
         let last_photo_name = undefined;

         // *Starting the photo removing promise:
         new Promise((resolve, reject) => {

            // *Changing the photo to the created file name:
            values.photo = file_name;

            // *Querying for the last photo:
            pooler.query('select ?? from ?? where ?? = ?', ['photo', 'vehicle', 'id', id])
               .then(last_photo_result => {
                  // *Setting the last photo name:
                  last_photo_name = last_photo_result.rows.length?last_photo_result.rows[0].photo:undefined;

                  // *Updating the resource in the database:
                  pooler.query('update ?? set ? where ?? = ?', ['vehicle', values, 'id', id])
                     .then(result => {
                        // *Checking if the resource was updated:
                        if(result.rows.affectedRows){
                           // *If it was:
                           // *Responding with 200 status:
                           res.status(200)
                              .end();

                           // *Resolving the promise:
                           resolve();
                        } else{
                           // *If it wasn't:
                           // *Sending a 404 response:
                           res.status(404)
                              .send('Resource not found')
                              .end();

                           // *Rejecting the promise:
                           reject();
                        }
                     })
                     .catch(err => {
                        // *If something went wrong:
                        // *Checking the error code:
                        switch(err.code){
                        case 'ER_DUP_ENTRY':
                           // *Sending a 400 error response:
                           res.status(400)
                              .send('The resource already exists')
                              .end();
                           break;
                        default:
                           // *Sending a 500 error response:
                           res.status(500)
                              .send('Something went wrong')
                              .end();
                        }

                        // *Rejecting the promise:
                        reject();
                     });
               })
               .catch(err => {
                  // *Sending a 500 error response:
                  res.status(500)
                     .send('Something went wrong')
                     .end();

                  // *Rejecting the promise:
                  reject();
               });
         })
         .then(() => {
            // *Removing the last photo:
            media.removeVehiclePhoto(last_photo_name);
         })
         .catch(() => {
            // *Reverting the file insertion:
            media.removeVehiclePhoto(file_name);
         });
      })
      .catch(err => {
         // *Sending a 500 error response:
         res.status(500)
            .send('Something went wrong')
            .end();
      });
}



/**
 * Deletes a resource in the database
 * @author Guilherme Reginaldo Ruella
 */
function erase(req, res, next){
   // *Requesting the media system:
   const media = require('../media/media');

   // *Getting the id from request params:
   let id = req.params.id;

   // *Querying for the last photo:
   pooler.query('select ?? from ?? where ?? = ?', ['photo', 'vehicle', 'id', id])
      .then(last_photo_result => {
         // *Setting the last photo name:
         let last_photo_name = last_photo_result.rows.length?last_photo_result.rows[0].photo:undefined;

         // *Starting the old photo removing promise:
         new Promise((resolve, reject) => {
            // *Deleting the resource from database:
            pooler.query('delete from ?? where ?? = ?', ['vehicle', 'id', id])
               .then(result => {
                  // *Checking if the resource was deleted:
                  if(result.rows.affectedRows){
                     // *If it was:
                     // *Responding with 200 status:
                     res.status(200)
                        .end();

                     // *Resolving the promise:
                     resolve();
                  } else{
                     // *If it wasn't:
                     // *Sending a 404 response:
                     res.status(404)
                        .send('Resource not found')
                        .end();

                     // *Rejecting the promise:
                     reject();
                  }
               })
               .catch(err => {
                  // *If something went wrong:
                  // *Checking the error code:
                  switch(err.code){
                  case 'ER_ROW_IS_REFERENCED_2':
                     // *Sending a 409 error response:
                     res.status(409)
                        .send('The resource has dependencies left')
                        .end();
                     break;
                  default:
                     // *Sending a 500 error response:
                     res.status(500)
                        .send('Something went wrong')
                        .end();
                  }

                  // *Rejecting the promise:
                  reject();
               });
         })
         .then(() => {
            // *Removing the last photo:
            media.removeVehiclePhoto(last_photo_name);
         });
      })
      .catch(err => {
         // *Sending a 500 error response:
         res.status(500)
            .send('Something went wrong')
            .end();
      });
}



// *Exporting the module:
module.exports = {
   retrieveAll: retrieveAll,
   retrieve: retrieve,
   create: create,
   update: update,
   erase: erase
};
