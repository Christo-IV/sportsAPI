const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const Session = require('../models/Session');
const {verifyToken} = require('../middlewares');

module.exports = router.post('/', async (req, res) => {

    // Validate parameters
    if (typeof req.body.password === 'undefined' || typeof req.body.email === 'undefined') {
        return res.status(400).send({error: 'Missing parameters'})
    }

    // Retrieve user from Mongo by username
    const user = await User.findOne({email: req.body.email}).exec();

    // Validate username and password
    if (!user || !await bcrypt.compare(req.body.password, user.password)) {
        return res.status(401).send({error: 'Invalid credentials'})
    }

    // Create session into DB
    const session = await new Session({
        "userId": user._id
    }).save();

    // 201 - Created
    return res.status(201).send({"token": session._id});
})

// Session deletion
module.exports = router.delete('/', verifyToken, async (req, res) => {
    try {
        await Session.deleteOne({_id: req.sessionId});

        // 204 - No content
        return res.status(204).end()
    } catch (e) {

        // 500 - Internal server error
        return res.status(500).send({error: e.message})
    }
})