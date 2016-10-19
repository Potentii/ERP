const pooler = require('../database/pooler');



/**
 * Retrieves all resources
 * @author Guilherme Reginaldo Ruella
 */
function retrieveAll(req, res, next){
   // *Getting the master resource id:
   let id = req.params.id;

   // *Querying the database for all resources:
   let options = {
      sql: 'select ??.*, ??.* from ?? inner join ?? on ?? = ??.?? where ?? = ?',
      nestTables: true
   };
   pooler.query(options, ['vehicle', 'schedule', 'vehicle', 'schedule', 'id_vehicle_fk', 'vehicle', 'id', 'id_user_fk', id])
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
 * Retrieves all resources on a given date
 * @author Guilherme Reginaldo Ruella
 */
function retrieveAllOnDate(req, res, next){
   // *Getting the master resource id:
   let id = req.params.id;
   let date = req.params.date;

   // *Querying the database for all resources:
   let options = {
      sql: 'select ??.*, ??.* from ?? inner join ?? on ?? = ??.?? where ?? = ? and ? between DATE(??) and DATE(??)',
      nestTables: true
   };
   pooler.query(options, ['vehicle', 'schedule', 'vehicle', 'schedule', 'id_vehicle_fk', 'vehicle', 'id', 'id_user_fk', id, date, 'start_date', 'end_date'])
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
   retrieveAll: retrieveAll,
   retrieveAllOnDate: retrieveAllOnDate
};
