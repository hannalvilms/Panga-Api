const router = require('express').Router();
const User = require('../models/User');
const Account = require('../models/Account');
const bcrypt = require('bcrypt');
const userModel = require('../models/User');
const accountModel = require('../models/Account');
const {verifyToken} = require('../middlewares');

router.post('/', async (req, res, next) => {

    //Check if values are given and correct
    if(typeof req.body.password === 'undefined' || req.body.password.length < 8 || req.body.password.length > 200){
        res.status(400).send({ error: "Invalid password!"});
        return
    }

    if(typeof req.body.username === "undefined" || req.body.username.length < 3 || req.body.username.length > 200) {
        res.status(400).send({ error: "Invalid username!" });
        return
    }

    if(typeof req.body.name === "undefined" || req.body.name.length < 3 || req.body.name.length > 200) {
        res.status(400).send({ error: "Invalid name!" });
        return
    }

    //Hash password
    req.body.password = await bcrypt.hash(req.body.password, 10);

    try {

        // Create new user
        const user = await new User(req.body).save();

        // Create account for the user
        const account = await new Account({userId: user.id}).save();

        user.accounts = [account];

        // Return user information
        res.status(201).send({
            id: user.id,
            name: user.name,
            username: user.username,
            accounts: [account]
        });
    }
    catch (e) {

        // Chech if username exists
        if (/E11000.*username.* dup key.*/.test(e.message)) {
            res.status(400).send({ error: 'Username already exists.' });

            // Stop the execution
            return
        }

        // Handle other errors
        res.status(409).send({error: e.message})
    }
});

router.get('/current',verifyToken, async (req, res) => {

    //Get user object from DB
    const user = await User.findOne({_id: req.userId});

    //Get user`s accounts
    const accounts = await Account.find({userId: req.userId});

    res.status(200).send( {
        id: user.id,
        name: user.name,
        username: user.username,
        accounts: accounts
    })
});

module.exports = router;