const Flight = require('../model/flights.model.js');
const findOneWayFight = require('../helper/findOneWayFight');
const bookingFlight = require("../helper/bookingFlight");

// [POST] /flights/one-way
module.exports.oneWayFight = async (req, res) => {
   try {
      const { from, to, dateFrom,dateTo, filter } = req.body;

      const result = await findOneWayFight(from, to, dateFrom, dateTo);



      if(filter){
         const {stops,time,airline} = filter;
         console.log(time);
         if(stops != null) result =  result.map(item => item.totalStops <= parseInt(stops));
         if(time != null) result =  result.map(item => item.totalTime <= parseInt(time));
         // if(!airline) result =  result.map(item => item.totalTime == );
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

module.exports.booking = async (req, res) => {
    try {
        const result = await bookingFlight(req.body);
        res.json({
            status: true,          
            message: "Đặt vé thành công!",
            data: result
        });
    } catch (err) {
        console.error(err);
        res.json({
            status: false,          
            message: err.message
        });
    }
};

