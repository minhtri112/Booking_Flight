const Airport = require("../model/airports.model");

// [GET] /airports/search
module.exports.getAirportsByName = async (req, res) => {
    console.log("Query params:", req.query);
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
        console.error("DB ERROR", err);
        res.status(500).json({
            message : "Internal server error"
        })
    }
};


