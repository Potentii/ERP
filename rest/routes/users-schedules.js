const pooler = require('../database/pooler');



/**
 * Retrieves all resources
 * @author Guilherme Reginaldo Ruella
 */
function retrieveAll(req, res, next){
   // *Getting the master resource id:
   let id = req.params.id;

   // *Querying the database for all resources:
   pooler.query('select * from ?? where ?? = ?', ['schedule', 'id_user_fk', id])
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



// *Exporting the module:
module.exports = {
   retrieveAll: retrieveAll
};
