const pooler = require('../database/pooler');



/**
 * Prepares an authorization middleware
 * @param  {string} permission The permission name to test
 * @return {function}          Returns a middleware function that will test the authorization
 * @author Guilherme Reginaldo Ruella
 */
module.exports = (permission) => {

   // *Returning the authorization middleware:
   return (req, res, next) => {
      let key_header = req.get('Access-Key');

      // *Checking if the request had the key header:
      if(!key_header){
         // *If it hasn't:
         // *Sending 'unauthorize' response:
         res.status(403)
            .json({err_code: 'ERR_NOT_AUTHORIZED', err_message: 'Unaunthorized'})
            .end();
         return;
      }

      // *Querying for an entry with the given key(login) and permission:
      pooler.query('select count(*) as counting from ?? where ?? = ? and ?? = ?', ['user_permission_view', 'user_login', key_header, 'permission_title', permission])
         .then(result => {
            // *Checking if the user has the needed clearance:
            if(result.rows[0].counting){
               // *If it has:
               // *Authorizing the request:
               next();
            } else{
               // *If it hasn't:
               // *Sending a 403 response:
               res.status(403)
                  .json({err_code: 'ERR_NOT_AUTHORIZED', err_message: 'Unaunthorized'})
                  .end();
            }
         })
         .catch(err => {
            // *If something went wrong:
            // *Sending a 500 response:
            res.status(500)
               .json({err_code: 'ERR_INTERNAL', err_message: 'Something went wrong'})
               .end();
         });
   };
};
