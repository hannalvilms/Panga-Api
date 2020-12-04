const mongoose = require('mongoose');
const sessionModel = require('./models/Session');

exports.verifyToken = async (req, res, next) => {

    //auth Header
    let  authorizationHeader = req.header('Authorization');
    if(!authorizationHeader){
        return res.status(401).json({error: "Missing Authorization header"});
    }
    authorizationHeader = authorizationHeader.split(' ');

    if(!authorizationHeader[1]){
        return res.status(400).json({error: "Invalid Authorization header format"});
    }

    if(!mongoose.Types.ObjectId.isValid(authorizationHeader[1])) {
        return res.status(401).json({error: "Invalid token"})
    }

    const session = await sessionModel.findOne({_id: authorizationHeader[1]});
    if (!session) return res.status(401).json({error: "Invalid token"});

    // Write user's id into db
    req.userId = session.userId;

    return next();
};