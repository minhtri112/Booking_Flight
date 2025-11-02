const Airplane = require("../model/airplanes.model");
// [GET] /airplanes/airlines
module.exports.getAirlines = async (req, res) => {
    try{
        const records = await Airplane.distinct("airline_name");
        res.json({
            status : 200,
            data : records
        });
    }
    catch(err){
        console.error("DB ERROR", err);
        res.json({
            status : 500,
            message : "Internal server error"
        });
    }
};