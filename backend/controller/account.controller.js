const Account = require('../model/accounts.model');
const Order = require('../model/orders.model');
const OrderDetails = require('../model/orderDetails.model');
const Flight = require('../model/flights.model');
const generateToken = require('../helper/generateToken');
const md5 = require('md5');


// [POST] /account/register
module.exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const checkEmail = await Account.findOne({ email: email });


        if (checkEmail) {
            res.json({
                status: "400",
                message: "Email already exists"
            });
            return;
        }

        const newCustomer = new Account(
            {
                user: name,
                email: email,
                password: md5(password),
                token: generateToken.generateToken()
            });


        const result = await newCustomer.save();

        res.json({
            status: "200",
            data: result,
        })

    }
    catch (err) {
        res.json({
            status: "500",
            message: err.message
        })
    }
}


// [POST] /account/login
module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Account.findOne(
            {
                email: email,
                password: md5(password)
            }
        );

        if (user) {
            return res.json({
                status: "200",
                message: "Login successful",
                data: user
            });
        }
        else {
            return res.json({
                status: "400",
                message: "Login failed",
            })
        }

    }
    catch (err) {
        res.json({
            status: "400",
            message: err.message
        })
    }
}

// [GET] /accounts/:token
exports.findByToken = async (req, res) => {
    try {
        const { token } = req.params;
        const account = await Account.findOne({ token: token });
        if (account) {
            res.json({
                status: "200",
                data: account
            })
        }
        else {
            res.json({
                status: "404",
                message: "Account not found"
            })
        }

    }
    catch (err) {
        res.json({
            status: "500",
            message: "An error occurred while retrieving account by token"
        })
    }
}

// [GET] /accounts/orders/:userID
exports.findOrdersByUserID = async (req, res) => {
    console.log("here");
    try {
        const { userID } = req.params;
        console.log(userID);
        const orders = await Order.find({ account_id: userID })
            .populate({
                path: 'order_details',
                populate: {
                    path: 'flight_id',
                    model: 'Flight',
                    select: '-seat_layout' // dấu trừ "-" để loại bỏ field
                }
            });
        console.log(orders);
        res.json({
            status: "200",
            data: orders
        })
    }
    catch (err) {
        console.log(err);
        res.json({
            status: "500",
            message: "An error occurred while retrieving orders by userID"
        })
    }
}