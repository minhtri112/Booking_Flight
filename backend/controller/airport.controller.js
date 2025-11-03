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

module.exports.getAirportsByCode = async (req,res)=>{
    try{
        const code = req.params.code;
        const record = await Airport.findOne({airport_code: code});
        res.json({
            status : 200,
            data : record
        })
    }
    catch(err){
        console.error("DB ERROR", err);
        res.json({
            status : 500,
            message : "Internal server error"
        })
    }
}
