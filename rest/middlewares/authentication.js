const pooler = require('../database/pooler');


/**
 * Authenticates a request (Middleware)
 * @author Guilherme Reginaldo Ruella
 */
module.exports = (req, res, next) => {
   // *Reading the authentication headers:
   let token_header = req.get('Access-Token');
   let key_header = req.get('Access-Key');


   // *Checking if the request had both authentication headers:
   if(!token_header || !key_header){
      // *If it hasn't:
      // *Sending unauthorize response:
      res.status(401)
         .json({err_code: 'ERR_INVALID_CREDENTIALS', err_message: 'Invalid access credentials'})
         .end();
      return;
   }


   // *Querying for authentication credentials:
   pooler.query('select count(*) as ok from ?? where ?? = ? and ?? = ?', ['auth', 'token', token_header, 'key', key_header])
      .then(result => {
         // *If there's no error:
         // *Checking if found some user:
         if(result.rows[0].ok){
            // *If found:
            // *Send to next request handler:
            next();
         } else{
            // *If not:
            // *Sending unauthorize response:
            res.status(401)
               .json({err_code: 'ERR_INVALID_CREDENTIALS', err_message: 'Invalid access credentials'})
               .end();

         }
      })
      .catch(err => {
         // *If some error occured:
         // *Sending internal error response:
         res.status(500)
            .json({err_code: 'ERR_INTERNAL', err_message: 'Something went wrong'})
            .end();
      });
};
