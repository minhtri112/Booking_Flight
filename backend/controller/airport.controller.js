const Airport = require("../model/airports.model");

// [GET] /airports/search
module.exports.getAirportsByName = async (req, res) => {
    try{
        const key = req.query.key;
        const records = await Airport.find(
            {$text : {$search : key}},
            {score : {$meta : "textScore"}}
        ).sort({score : {$meta : "textScore"}});
        res.status(200).json({
            data : records
        })
    }
    catch(err){
        res.status(500).json({
            message : "Internal server error"
        })
    }
};