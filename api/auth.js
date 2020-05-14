const connectToDatabase = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const response = require('../libs/response-lib');

const User = require('../models/User');

// @route   GET api/auth
// @desc    Get user
// @access  Private
module.exports.getAuth = async (event, context) => {
    const auth = JSON.parse(event.requestContext.authorizer.user);
    await connectToDatabase();

    try {
        const user = await User.findById(auth.id).select('-password');
        return response.success(user);
    } catch (e) {
        return response.errorWithLog({ msg: 'Server Error' }, e, event);
    }
};


// @route   POST api/auth/login
// @desc    Authenticate user & get token - Login
// @access  Public
module.exports.login = async (event, context) => {
    const body = JSON.parse(event.body);

    await connectToDatabase();

    let errors = [];
    const { email, password } = body;

    // Check required fields
    if (!email || !password) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    if (errors.length > 0) return response.badRequest({ errors });

    try {
        // See if user exists
        let user = await User.findOne({ email });

        if (!user) {
            // User doesn't exist
            errors.push({ msg: 'Invalid Credentials' });
            return response.badRequest(errors);
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            // User doesn't exist
            errors.push({ msg: 'Invalid Credentials' });
            return response.badRequest(errors);
        }

        // Return jsonwebtoken
        const payload = {
            user: {
                id: user.id
            }
        };

        // TODO: on production return to 3600 rather than 360000 for it to be an hour
        const token = await jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 360000 },
        );

        return response.success({ token });

    } catch (e) {
        return response.errorWithLog({ msg: 'Server Error' }, e, event);
    }
};

