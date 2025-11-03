const Customer = require('../accounts.model');
const generateToken = require('../helper/generateToken');


// [POST] /account/register
module.exports.register = async (req,res)=>{
    try{
        const {name, email, password} = req.body;

        const checkEmail = await Customer.find({email : email});
        if(checkEmail){
            return res.json({
                status : "400",
                message : "Email already exists"
            });
        }

        const newCustomer = new Customer({name : name, email : email, password : password, token : generateToken()});
        const result = await newCustomer.save();

        res.json({  
            status : "200",
            data : result,          
        })

    }
    catch(err){
        res.json({
            status : "500",
            message : err.message
        })
    }
}


module.exports.login = async (req,res) => {
    try{
        const {emailOrUserName, password} = req.body;

        const user = await Customer.findOne(
            $or [
                {email : emailOrUserName},
                {name : emailOrUserName}
            ],
            {
                password : password
            }
        );

        if(user){
            return res.json({
                status : "200",
                message : "Login successful",
                data : user
            });
        }
        else{
            return res.json({
                status : "400",
                message : "Login failed",
            })
        }

    }
    catch(err){
        res.json({
            status : "400",
            message : err.message
        })
    }
}