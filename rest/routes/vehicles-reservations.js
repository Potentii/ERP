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
   pooler.query(options, ['user', 'schedule', 'user', 'schedule', 'id_user_fk', 'user', 'id', 'id_vehicle_fk', id])
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

   // *Getting the sort headers:
   let sort_field = req.get('Sort-Field');
   let sort_type = req.get('Sort-Type');

   // *Preparing the query:
   let sql = 'select ??.*, ??.* from ?? inner join ?? on ?? = ??.?? where ?? = ? and ? between DATE(??) and DATE(??)';
   let values = ['user', 'schedule', 'user', 'schedule', 'id_user_fk', 'user', 'id', 'id_vehicle_fk', id, date, 'start_date', 'end_date'];

   // *Checking if the sorting is set:
   if(sort_field){
      // *If it is:
      // *Adding it to the query:
      sort_type = (sort_type==='desc') ? 'desc' : 'asc';
      sql += ' order by ??.?? ' + sort_type;
      values.push('schedule', sort_field);
   }

   // *Querying the database for all resources:
   pooler.query({sql: sql, nestTables: true}, values)
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
