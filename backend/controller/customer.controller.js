
const Account = require('../model/accounts.model');
const generateToken = require('../helper/generateToken');


// [POST] /account/register
module.exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existing = await Account.findOne({ email });
        if (existing) {
            return res.status(400).json({
                status: '400',
                message: 'Email already exists',
            });
        }

        const newCustomer = new Account({
            name,
            email,
            password,
            token: generateToken(),
        });
        const result = await newCustomer.save();

        return res.status(200).json({
            status: '200',
            data: result,
        });
    } catch (err) {
        return res.status(500).json({
            status: '500',
            message: err.message,
        });
    }
};


// [POST] /account/login
module.exports.login = async (req, res) => {
    try {
        const { emailOrUserName, password } = req.body;

        const user = await Account.findOne({
            $or: [{ email: emailOrUserName }, { name: emailOrUserName }],
            password: password,
        });

        if (user) {
            return res.status(200).json({
                status: '200',
                message: 'Login successful',
                data: user,
            });
        }

        return res.status(400).json({
            status: '400',
            message: 'Login failed',
        });
    } catch (err) {
        return res.status(400).json({
            status: '400',
            message: err.message,
        });
    }
};