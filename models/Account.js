const mongoose = require('mongoose');
require('dotenv').config();

module.exports = mongoose.model('Account', mongoose.Schema({
    number: {
        type: String,
        required: true,
        default: function(){
            return process.env.BANK_PREFIX + require('md5')(new Date().toISOString())
        }
    },
    name: {
        type: String, required: true, min: 3, max: 255, default: 'Main'
    },
    balance: {
        type: Number, required: true, min: 0, default: 100000
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    currency: {
        type: String, required: true, default: 'EUR'
    }
},{
    toJSON: {
        transform: (docIn, docOut) => {
            delete docOut.userId;
            delete docOut._id;
            delete docOut.__v;
        }
    }
}));