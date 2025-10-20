const mongoose = require('mongoose');


const accountSchema = new mongoose.Schema(
    {
        email : String,
        user : String,
        password : String,
    },
    { timestamps: true }
);

const Account = mongoose.model('Account', accountSchema, 'accounts');

module.exports = Account;
