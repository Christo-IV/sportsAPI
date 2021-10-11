const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const Account = require('../models/Account');
const {verifyToken} = require('../middlewares');

module.exports = router.post('/', async (req, res) => {
    try {

        // Create user
        const user = await new User({
            "name": req.body.name,
            "username": req.body.username,
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

        // Create bank account
        await new Account({
            "userId": user._id,
            "name": "Main",
            "balance": 10000,
            "currency": "EUR",
            "number": Math.random().toString(36).substr(2, 9)
        }).save();

        // 201 - Created successfully
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

module.exports = router.get('/current', verifyToken, async(req, res) => {
    try {

        // Get accounts
        const accounts = await Account.find({userId: req.userId});

        // 200 - OK
        return res.status(200).send(accounts);
    } catch(e) {

        // 500 - Internal server error
        return res.status(500).send({error: e.message});
    }
})