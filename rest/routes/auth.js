// *Requiring the token generator:
const uuid = require('node-uuid');
// *Requiring the database pooler:
const pooler = require('../database/pooler');



/**
 * Sends back the user's information (It should only be used on 'GET /auth' route)
 * @author Guilherme Reginaldo Ruella
 */
function onAuthenticated(req, res, next){
   // *Getting the key header:
   let key_header = req.get('Access-Key');

   // *Querying for the user with the given key header as login:
   pooler.query('select * from ?? where ?? = ? limit 1', ['user_insensitive_view', 'login', key_header])
      .then(result => {
         // *If there's no error:
         // *Checking if there is any entry:
         if(result.rows.length){
            // *If there is:
            // *Send a 200 response:
            res.status(200)
               .json({user: result.rows[0]})
               .end();
         } else{
            // *If not:
            // *Sending 404 response:
            res.status(500)
               .json({err_code: 'ERR_INTERNAL', err_message: 'Something went wrong'})
               .end();
         }
      })
      .catch(err => {
         // *If some error occured:
         // *Sending 500 response:
         res.status(500)
            .json({err_code: 'ERR_INTERNAL', err_message: 'Something went wrong'})
            .end();
      });
}



/**
 * Retrives the request owner's Id, and stores it inside request's 'Access-Id' header
 * @author Guilherme Reginaldo Ruella
 */
function exposeAccessId(req, res, next){
   // *Getting the key header:
   let key_header = req.get('Access-Key');

   // *Querying for the user with the given key header as login:
   pooler.query('select ?? from ?? where ?? = ? limit 1', ['id', 'user_insensitive_view', 'login', key_header])
      .then(result => {
         // *If there's no error:
         // *Checking if there is any entry:
         if(result.rows.length){
            // *If there is:
            // *Saving the request owner's id inside 'Access-Id' header:
            req.headers['Access-Id'] = result.rows[0].id;
            // *Calling the next middleware:
            next();
         } else{
            // *If not:
            // *Sending 500 response:
            res.status(500)
               .json({err_code: 'ERR_INTERNAL', err_message: 'Something went wrong'})
               .end();
         }
      })
      .catch(err => {
         console.log(err);
         // *If some error occured:
         // *Sending 500 response:
         res.status(500)
            .json({err_code: 'ERR_INTERNAL', err_message: 'Something went wrong'})
            .end();
      });
}



/**
 * Authenticates a client, given the user's credentials
 * @author Guilherme Reginaldo Ruella
 */
function login(req, res, next){
   // *Getting the user's credentials from the request body:
   let login = req.body.login;
   let pass = req.body.pass;

   // *Querying the database to find the user that matches the given login and password:
   pooler.query('select * from ?? where ?? = ? and ?? = ? limit 1', ['user', 'login', login, 'pass', pass])
      .then(result_user => {

         // *Checking if found some user:
         if(result_user.rows.length){
            // *If found:
            // *Checking if the user is currently active:
            if(result_user.rows[0].active){
               // *If they are:
               // *Removing the sensitive data from user object (password):
               result_user.rows[0].pass = undefined;

               // *Querying the database to check if the user has an active access token:
               pooler.query('select * from ?? where ?? = ? limit 1', ['auth', 'key', login])
                  .then(result_auth => {

                     // *Checking if found any token:
                     if(result_auth.rows.length){
                        // *If found:
                        // *Sending the found token and the user object (without password):
                        res.status(200)
                           .json({token: result_auth.rows[0].token, user: result_user.rows[0]})
                           .end();
                     } else{
                        // *If not found any:
                        // *Generating new uuid-v4 token:
                        let token = uuid.v4();

                        // *Inserting the new token in the database:
                        pooler.query('insert into ?? set ?', ['auth', {token: token, key: login}])
                           .then(result_insert_auth => {
                              // *Checking if the token was inserted:
                              if(result_insert_auth.rows.affectedRows){
                                 // *If it was:
                                 // *Sending the inserted token and the user object (without password):
                                 res.status(201)
                                    .json({token: token, user: result_user.rows[0]})
                                    .end();
                              } else{
                                 // *If it wasn't:
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
               // *Sending a 401 error response:
               res.status(401)
                  .json({err_code: 'ERR_USER_NOT_ACTIVE', err_message: 'Inactive user'})
                  .end();
            }
         } else{
            // *If not found:
            // *Sending a 401 error response:
            res.status(401)
               .json({err_code: 'ERR_INVALID_CREDENTIALS', err_message: 'Invalid credentials'})
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
 * Unauthenticates a connected client
 * @author Guilherme Reginaldo Ruella
 */
function logoff(req, res, next){
   // *Reading the authentication headers:
   let token_header = req.get('Access-Token');
   let key_header = req.get('Access-Key');

   // *Removing the authentication credentials:
   pooler.query('delete from ?? where ?? = ? and ?? = ?', ['auth', 'token', token_header, 'key', key_header])
      .then(result => {
         // *Responding with 200 status:
         res.status(200)
            .end();
      })
      .catch(err => {
         // *If some error occured:
         // *Sending internal error response:
         res.status(500)
            .json({err_code: 'ERR_INTERNAL', err_message: 'Something went wrong'})
            .end();
      });
}



// *Exporting the module:
module.exports = {
   onAuthenticated: onAuthenticated,
   exposeAccessId: exposeAccessId,
   login: login,
   logoff: logoff
};
