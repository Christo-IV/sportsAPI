const Session = require('./models/Session');

exports.verifyToken = async (req, res, next) => {

    // Check Authorization header existence
    if (!req.headers.authorization) {
        return res.status(400).send({'error': 'No authorization header'})
    }

    // Check that Authorization header includes a space
    if (req.headers.authorization.indexOf(' ') === -1) {
        return res.status(400).send({'error': 'Invalid authorization format'})
    }

    // Split Authorization header by space
    const authToken = req.headers.authorization.split(' ')[1];

    // Validate that the provided token conforms to MongoDB id format
    if (!require('mongoose').Types.ObjectId.isValid(authToken)) {
        return res.status(400).send({'error': 'Authorization header does not match MongoDB format'})
    }

    // Find a session with given token
    const session = await Session.findOne({_id: authToken});

    // Check that the session existed
    if (!session) {
        return res.status(401).send({'error': 'Invalid token'})
    }

    // Store the user's id in the req objects
    req.userId = session.userId;
    req.sessionId = session.id;

    return next(); // Pass the execution to the next middleware function
}