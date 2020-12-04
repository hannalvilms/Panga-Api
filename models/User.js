const mongoose = require('mongoose');

module.exports = mongoose.model('User', mongoose.Schema({
    name: {
        type: String, required: true, min: 3, max: 200
    },
    username: {
        type: String, required: true, min: 3, max: 200, unique: true
    },
    password: {
        type: String, required: true, minlength: 8, maxlength: 200
    },
    accounts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    }]
}, {
    toJSON: {
        transform: (docIn, docOut) => {
            docOut.id = docOut._id;
            delete docOut._id;
            delete docOut.__v;
        }
    }
}));