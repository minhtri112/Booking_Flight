const Flight = require('../model/flights.model.js');
const Airphane = require('../model/airplanes.model.js');
const findOneWayFight = require('../helper/findOneWayFight');

// [POST] /flights/one-way
module.exports.oneWayFight = async (req, res) => {
   try {
      const { from, to, date,filter} = req.body;


      let result = await findOneWayFight(from, to,date);

      if(filter){
         const {stops,time,airlines} = filter;
         if(stops != null) result =  result.filter(item => item.totalStops <= parseInt(stops));
         if(time != null) result =  result.filter(item => item.totalTime <= parseInt(time));
         if(airlines != null){
            result =  result.filter(item => {
               return airlines.includes(item.airline);
            });
         }
      }

      res.json(
         {
            status : "200",
            data : result
         }
      )
      
   }
   catch (err) {

   }
}
