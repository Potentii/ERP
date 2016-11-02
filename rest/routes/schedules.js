const pooler = require('../database/pooler');



/**
 * Retrieves all resources
 * @author Guilherme Reginaldo Ruella
 */
function retrieveAll(req, res, next){
   // *Querying the database for all resources:
   pooler.query('select * from ??', ['schedule'])
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
            .json({err_code: 'ERR_INTERNAL', err_message: 'Something went wrong'})
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
   pooler.query('select * from ?? where ?? = ?', ['schedule', 'id', id])
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
               .json({err_code: 'ERR_NOT_FOUND', err_message: 'Resource not found'})
               .end();
         }
      })
      .catch(err => {
         // *If something went wrong:
         // *Sending a 500 error response:
         res.status(500)
            .json({err_code: 'ERR_INTERNAL', err_message: 'Something went wrong'})
            .end();
      });
}



/**
 * Creates a new resource in the database
 * @author Guilherme Reginaldo Ruella
 */
function create(req, res, next){
   // *Getting the body of the request:
   let values = req.body;
   // *Getting the request owner's id:
   let owner_id = req.headers['Access-Id'];
   // *Adding the owner reference into the insert parameters:
   values.id_user_owner_fk = owner_id;

   // *Inserting the resource in the database:
   pooler.query('insert into ?? set ?', ['schedule', values])
      .then(result => {
         // *Responding with the inserted element's id:
         res.status(201)
            .json({id: result.rows.insertId})
            .end();
      })
      .catch(err => {
         // *If something went wrong:
         // *Checking the error code:
         switch(err.code){
         case 'EIGER_INVALID_DATE':
            // *Sending a 400 error response:
            res.status(400)
               .json({err_code: 'ERR_INVALID_TIMESPAN', err_message: 'Invalid date'})
               .end();
            break;
         case 'EIGER_NOT_AUTHORIZED':
            // *Sending a 403 error response:
            res.status(403)
               .json({err_code: 'ERR_NOT_AUTHORIZED', err_message: 'Not authorized'})
               .end();
            break;
         case 'EIGER_VEHICLE_UNAVAILABLE':
            // *Sending a 409 error response:
            res.status(409)
               .json({err_code: 'ERR_RES_UNAVAILABLE', err_message: 'Vehicle unavailable'})
               .end();
            break;
         case 'EIGER_USER_NOT_ACTIVE':
            // *Sending a 403 error response:
            res.status(403)
               .json({err_code: 'ERR_USER_NOT_ACTIVE', err_message: 'Inactive user'})
               .end();
            break;
         case 'EIGER_VEHICLE_NOT_ACTIVE':
            // *Sending a 409 error response:
            res.status(409)
               .json({err_code: 'ERR_VEHICLE_NOT_ACTIVE', err_message: 'Inactive vehicle'})
               .end();
            break;
         case 'ER_NO_DEFAULT_FOR_FIELD':
            // *Sending a 400 error response:
            res.status(400)
               .json({err_code: 'ERR_MISSING_FIELD', err_message: 'Missing required field'})
               .end();
            break;
         case 'ER_DUP_ENTRY':
            // *Sending a 400 error response:
            res.status(400)
               .json({err_code: 'ERR_DUPLICATE_FIELD', err_message: 'The resource already exists'})
               .end();
            break;
         case 'ER_NO_REFERENCED_ROW_2':
            // *Sending a 404 error response:
            res.status(404)
               .json({err_code: 'ERR_REF_NOT_FOUND', err_message: 'Reference not found'})
               .end();
            break;
         default:
            // *Sending a 500 error response:
            res.status(500)
               .json({err_code: 'ERR_INTERNAL', err_message: 'Something went wrong'})
               .end();
         }
      });
}



/**
 * Updates a resource in the database
 * @author Guilherme Reginaldo Ruella
 */
function update(req, res, next){
   // *Getting the id from request params:
   let id = req.params.id;
   // *Getting the body of the request:
   let values = req.body;
   // *Getting the request owner's id:
   let owner_id = req.headers['Access-Id'];
   // *Adding the owner reference into the insert parameters:
   values.id_user_owner_fk = owner_id;


   // *Querying for the previous confirmation status of this scheduling:
   new Promise((resolve, reject) => {
      // *Checking if the user is trying to confirm this schedule:
      if(!values.confirmed){
         // *If not:
         // *Resolving the promise:
         resolve();
      } else{
         // *Querying for the previous confirmation status of this scheduling:
         pooler.query('select ?? from ?? where ?? = ?', ['confirmed', 'schedule', 'id', id])
            .then(result => {
               // *Checking if something was returned:
               if(result.rows.length){
                  // *If it was:
                  // *Resolving the promise eith the previous confirmation status:
                  resolve(result.rows[0].confirmed);
               } else{
                  // *If not:
                  // *Resolving the promise:
                  resolve();
               }
            })
            .catch(err => reject(err));
      }
   })
   .then(confirmed => {
      // *Updating the resource in the database:
      pooler.query('update ?? set ? where ?? = ?', ['schedule', values, 'id', id])
         .then(result => {
            // *Checking if the resource was updated:
            if(result.rows.affectedRows){
               // *If it was:
               // *Checking if it needs to send a confirmation e-mail:
               if(values.confirmed && !confirmed){
                  // *If it does:
                  // *Sending the e-mail:
                  sendConfirmationEmail(id)
                     .catch(err => console.log(err));
               }
               // *Responding with 200 status:
               res.status(200)
                  .end();
            } else{
               // *If it wasn't:
               // *Sending a 404 response:
               res.status(404)
                  .json({err_code: 'ERR_NOT_FOUND', err_message: 'Resource not found'})
                  .end();
            }
         })
         .catch(err => {
            // *If something went wrong:
            // *Checking the error code:
            switch(err.code){
            case 'EIGER_INVALID_DATE':
               // *Sending a 400 error response:
               res.status(400)
                  .json({err_code: 'ERR_INVALID_TIMESPAN', err_message: 'Invalid date'})
                  .end();
               break;
            case 'EIGER_NOT_AUTHORIZED':
               // *Sending a 403 error response:
               res.status(403)
                  .json({err_code: 'ERR_NOT_AUTHORIZED', err_message: 'Not authorized'})
                  .end();
               break;
            case 'EIGER_VEHICLE_UNAVAILABLE':
               // *Sending a 409 error response:
               res.status(409)
                  .json({err_code: 'ERR_RES_UNAVAILABLE', err_message: 'Vehicle unavailable'})
                  .end();
               break;
            case 'EIGER_USER_NOT_ACTIVE':
               // *Sending a 403 error response:
               res.status(403)
                  .json({err_code: 'ERR_USER_NOT_ACTIVE', err_message: 'Inactive user'})
                  .end();
               break;
            case 'EIGER_VEHICLE_NOT_ACTIVE':
               // *Sending a 409 error response:
               res.status(409)
                  .json({err_code: 'ERR_VEHICLE_NOT_ACTIVE', err_message: 'Inactive vehicle'})
                  .end();
               break;
            case 'ER_DUP_ENTRY':
               // *Sending a 400 error response:
               res.status(400)
                  .json({err_code: 'ERR_DUPLICATE_FIELD', err_message: 'The resource already exists'})
                  .end();
               break;
            case 'ER_NO_REFERENCED_ROW_2':
               // *Sending a 404 error response:
               res.status(404)
                  .json({err_code: 'ERR_REF_NOT_FOUND', err_message: 'Reference not found'})
                  .end();
               break;
            default:
               // *Sending a 500 error response:
               res.status(500)
                  .json({err_code: 'ERR_INTERNAL', err_message: 'Something went wrong'})
                  .end();
            }
         });
   })
   .catch(err => {
      // *Sending a 500 error response:
      res.status(500)
         .json({err_code: 'ERR_INTERNAL', err_message: 'Something went wrong'})
         .end();
   });
}



/**
 * Deletes a resource in the database
 * @author Guilherme Reginaldo Ruella
 */
function erase(req, res, next){
   // *Getting the id from request params:
   let id = req.params.id;
   // *Getting the request owner's id:
   let owner_id = req.headers['Access-Id'];

   // *Querying this schedule's user:
   pooler.query('select ?? from ?? where ?? = ?', ['id_user_fk', 'schedule', 'id', id])
      .then(referenced_user_result => {
         // *Querying the request owner's manage schedule status:
         pooler.query('select ?? from ?? where ?? = ?', ['permission_schedules', 'user', 'id', owner_id])
            .then(permission_schedules_result => {
               // *Checking if the user could be found:
               if(permission_schedules_result.rows.length){
                  // *If they could be found:
                  // *Checking if the schedule could be found:
                  if(referenced_user_result.rows.length){
                     // *If it could:
                     // *Checking if the user has permission to manage schedules, but if not, checking if the user is the same as the one referenced by this schedule:
                     if(permission_schedules_result.rows[0].permission_schedules || referenced_user_result.rows[0].id_user_fk === owner_id){
                        // *If they're:
                        // *Deleting the resource from database:
                        pooler.query('delete from ?? where ?? = ?', ['schedule', 'id', id])
                           .then(result => {
                              // *Checking if the resource was deleted:
                              if(result.rows.affectedRows){
                                 // *If it was:
                                 // *Responding with 200 status:
                                 res.status(200)
                                    .end();
                              } else{
                                 // *If it wasn't:
                                 // *Sending a 404 response:
                                 res.status(404)
                                    .json({err_code: 'ERR_NOT_FOUND', err_message: 'Resource not found'})
                                    .end();
                              }
                           })
                           .catch(err => {
                              // *If something went wrong:
                              // *Sending a 500 error response:
                              res.status(500)
                                 .json({err_code: 'ERR_INTERNAL', err_message: 'Something went wrong'})
                                 .end();
                           });
                     } else{
                        // *If not:
                        // *Sending a 403 error response:
                        res.status(403)
                           .json({err_code: 'ERR_NOT_AUTHORIZED', err_message: 'Not authorized'})
                           .end();
                     }
                  } else{
                     // *If it couldn't:
                     // *Sending a 404 error response:
                     res.status(404)
                        .json({err_code: 'ERR_NOT_FOUND', err_message: 'Resource not found'})
                        .end();
                  }
               } else{
                  // *If they couldn't:
                  // *Sending a 500 error response:
                  res.status(500)
                     .json({err_code: 'ERR_INTERNAL', err_message: 'Something went wrong'})
                     .end();
               }
            })
            .catch(err => {
               // *If something went wrong:
               // *Sending a 500 error response:
               res.status(500)
                  .json({err_code: 'ERR_INTERNAL', err_message: 'Something went wrong'})
                  .end();
            });
      })
      .catch(err => {
         // *If something went wrong:
         // *Sending a 500 error response:
         res.status(500)
            .json({err_code: 'ERR_INTERNAL', err_message: 'Something went wrong'})
            .end();
      });
}



/**
 * Sends a scheduling confirmation e-mail
 * @param  {number} schedule_id The schedule's id
 * @return {Promise}            The e-mail sending promise
 * @author Guilherme Reginaldo Ruella
 */
function sendConfirmationEmail(schedule_id){
   // *Returning the promise:
   return new Promise((resolve, reject) => {
      // *Querying for all the needed information:
      pooler.query({sql: 'select ??.*, ??.*, ??.* from ?? inner join ?? on ??.?? = ?? inner join ?? on ??.?? = ?? where ??.?? = ?', nestTables: true},
         ['schedule', 'user', 'vehicle', 'schedule', 'user', 'user', 'id', 'id_user_fk', 'vehicle', 'vehicle', 'id', 'id_vehicle_fk', 'schedule', 'id', schedule_id])
         .then(result => {
            try{
               // *Requesting the dates module:
               const dates = require('../dates/dates');
               // *Getting the user and schedule information out of the query result:
               let user = result.rows[0].user;
               let schedule = result.rows[0].schedule;

               // *Sending the confirmation e-mail:
               require('../mailer/mailer').sendScheduleConfirmationMail(user.email, {
                     user_name: user.name,
                     start_date: dates.asFullDate(new Date(schedule.start_date)),
                     start_time: dates.asShorterTime(new Date(schedule.start_date)),
                     end_date: dates.asFullDate(new Date(schedule.end_date)),
                     end_time: dates.asShorterTime(new Date(schedule.end_date))
                  })
                  .then(() => resolve())
                  .catch(err => reject(err));
            } catch(err){
               // *If something goes wrong:
               // *Rejecting the promise:
               reject(err);
            }
         })
         .catch(err => reject(err));
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
