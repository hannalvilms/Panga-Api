const router = require('express').Router();
const userModel = require('../models/User');
const sessionModel = require('../models/Session');
const bcrypt = require('bcrypt');
const { verifyToken } = require('../middlewares');

//Log in
router.post('/', async (req, res) => {

    // Validate username and password
    try {

        // User by username from db
        const user = await userModel.findOne({ username: req.body.username });

        // If username and password are inserted
        if (req.body.username === '' || req.body.password === '') {
            return res.status(400).json({ error: "Missing username or password" });
        }
        // If provided password matches
        const passwordCheck = await bcrypt.compare(req.body.password, user.password);
        if (!user || !passwordCheck) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        // Create session to db
        const session = await sessionModel.create({
            userId: user.id
        });

        // Return token to user
        return res.status(200).json({
            token: session._id
        })
    }
    catch (error) {
        res.status(401).send({ error: "Invalid username or password" })
    }
});

//Log out
router.delete('/', verifyToken, async (req, res) => {
    try {
        // Get session by userId from db
        const session = await sessionModel.findOne({userId: req.userId});

        // Check if session existed in db
        if(!session){
            return res.status(404).json({error: "Invalid session"});
        }

        // Delete session from the database
        await sessionModel.deleteOne({_id: session._id.toString()});
        return res.status(204).json();
    }
    catch(e){
        return res.status(400).json({error: e.message});
    }
});

module.exports = router;
