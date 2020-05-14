const connectToDatabase = require('../config/db');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const response = require('../libs/response-lib');

// @route   POST api/users
// @desc    Register new user
// @access  Public
module.exports.register = async (event, context) => {
    const body = JSON.parse(event.body);

    await connectToDatabase();

    let errors = [];
    const { name, password, email } = body;

    // Check required fields
    if (!name || !password || !email) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    if (errors.length > 0) return response.error({ errors });

    try {
        let user = await User.findOne({ email });

        if (user) {
            // User already exists
            errors.push({ msg: 'Email is already taken' });
            return response.error({ errors });
        }

        // Create User
        user = new User({
            name,
            email,
            password
        });

        // Encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

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
