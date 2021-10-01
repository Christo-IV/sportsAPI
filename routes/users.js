const User = require('../models/User')
const bcrypt = require('bcrypt');

module.exports = async (req, res) => {
    try {

        // Set User model (?)
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
                console.log(resp);
            })
        });

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
}