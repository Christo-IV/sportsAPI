const router = require('express').Router();
const User = require('../models/User');
const Session = require('../models/Session');
const bcrypt = require('bcrypt');
const {verifyToken} = require('../middlewares');

module.exports = router.post('/', async (req, res) => {
    try {

        // Create user
        const user = await new User({
            "email": req.body.email,
            "password": req.body.password
        }).save();

        // Password hashing
        bcrypt.hash(req.body.password, 10, function (err, hash) {
            User.updateOne({_id: user._id}, {
                password: hash
            }, function (err, affected, resp) {
                if (resp) console.log(resp);
            })
        });

        // 201 - User created successfully
        res.status(201).end();
    } catch (e) {

        // 422 - Parameter(s) value(s) too long/short
        if (/is (longer|shorter) than the (maximum|minimum) allowed length/.test(e.message)) {
            return res.status(422).send({error: e.message});
        }

        // 400 - Parameter(s) missing
        if (/User validation failed:/.test(e.message)) {
            return res.status(400).send({error: e.message});
        }

        // 409 - Username already exists
        if (/E11000 duplicate key error collection: .*username/.test(e.message)) {
            return res.status(409).send({error: "Username already exists"});
        }

        // 500 - Unknown server error
        return res.status(500).send({error: e.message});
    }
})

module.exports = router.post('/exercises',verifyToken, async(req, res) => {
    try {

        // Check if request body has exercise ID
        if(!req.body.exercises) {
            return res.status(400).send({error: 'Missing exercise ID'});
        }

        //const session = await Session.findOne({_id: req.sessionId});

        console.log(req.sessionId);

        // 201 - Exercise created successfully
        return res.status(201).end();
    } catch (e) {

        // 500 - Internal server error
        return res.status(500).sent({error: e.message});
    }
})

module.exports = router.get('/current', verifyToken, async(req, res) => {
    try {

        // 200 - OK
        return res.status(200).send("[PH] This should return everything relating to the user?");
    } catch(e) {

        // 500 - Internal server error
        return res.status(500).send({error: e.message});
    }
})