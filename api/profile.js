const connectToDatabase = require('../config/db');
const response = require('../libs/response-lib');

const Profile = require('../models/Profile');
const User = require('../models/User');

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private
module.exports.getOwnProfile = async (event, context) => {
    const auth = JSON.parse(event.requestContext.authorizer.user);
    await connectToDatabase();
    let errors = [];

    try {
        const profile = await Profile.findOne({user: auth.id}).populate('user', ['name', 'avatar']);

        if (!profile) {
            errors.push({msg: 'There is no profile for this user'});
            return response.error(errors);
        }

        return response.success(profile);

    } catch (e) {
        return response.errorWithLog({msg: 'Server Error'}, e, event);
    }
};


// @route   POST api/profile
// @desc    Create user profile
// @access  Private
module.exports.createProfile = async (event, context) => {
    const auth = JSON.parse(event.requestContext.authorizer.user);
    const body = JSON.parse(event.body);

    await connectToDatabase();

    let errors = [];
    const {
        username,
        bio,
        avatar,
        categories,
        facebook,
        twitter,
        instagram
    } = body;

    // Check required fields
    if (!username) {
        errors.push({msg: 'Please fill in all fields'});
    }

    if (errors.length > 0) return response.badRequest({errors});

    // See if username exists
    let reqUsername = await Profile.findOne({username});

    if (reqUsername) {
        errors.push({msg: 'There is no profile for this user'});
        return response.error(errors);
    }

    if (errors.length > 0) return response.badRequest({errors});

    // Build profile object
    const profileFields = {};
    profileFields.user = auth.id;
    if (username) profileFields.username = username;
    if (bio) profileFields.bio = bio;
    if (avatar) profileFields.avatar = avatar;
    if (categories) {
        profileFields.categories = categories.split(',').map(category => category.trim());
    }

    // Build social object
    profileFields.social = {};
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (instagram) profileFields.social.instagram = instagram;

    try {
        let profile = await Profile.findOne({user: auth.id});

        if (profile) {
            // Update
            profile = await Profile.findOneAndUpdate(
                {user: auth.id},
                {$set: profileFields},
                {new: true}
            );

            return response.success(profile);
        }

        // Create
        profile = new Profile(profileFields);

        await profile.save();

        return response.success(profile);

    } catch (e) {
        return response.errorWithLog({msg: 'Server Error'}, e, event);
    }
};

// @route   PATCH api/profile
// @desc    Update user profile
// @access  Private
module.exports.updateProfile = async (event, context) => {
    const auth = JSON.parse(event.requestContext.authorizer.user);
    const body = JSON.parse(event.body);

    await connectToDatabase();

    const {
        bio,
        avatar,
        categories,
        facebook,
        twitter,
        instagram
    } = body;

    // Build profile object
    const profileFields = {};
    profileFields.user = auth.id;
    if (bio) profileFields.bio = bio;
    if (avatar) profileFields.avatar = avatar;
    if (categories) {
        profileFields.categories = categories.split(',').map(category => category.trim());
    }

    // Build social object
    profileFields.social = {};
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (instagram) profileFields.social.instagram = instagram;

    try {
        let profile = await Profile.findOne({user: auth.id});

        if (profile) {
            // Update
            profile = await Profile.findOneAndUpdate(
                {user: auth.id},
                {$set: profileFields},
                {new: true}
            );

            return response.success(profile);
        }

        // Create
        profile = new Profile(profileFields);

        await profile.save();

        return response.success(profile);

    } catch (e) {
        return response.errorWithLog({msg: 'Server Error'}, e, event);
    }
};

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
module.exports.getAllProfiles = async (event, context) => {
    await connectToDatabase();

    try {
        const profiles = await Profile.find()
            .populate('user', ['name', 'avatar']).sort({date: -1});

        return response.success(profiles);
    } catch (e) {
        return response.errorWithLog({msg: 'Server Error'}, e, event);
    }
};

// @route   GET api/profile/user/:id
// @desc    Get profile by user ID
// @access  Public
module.exports.getProfileById = async (event, context) => {
    const userId = event.pathParameters.id;
    await connectToDatabase();
    let errors = [];

    try {
        const profile = await Profile.findOne({
            user: userId
        }).populate('user', ['name', 'avatar']);

        if (!profile) {
            errors.push({msg: 'There is no profile for this user'});
            return response.error(errors);
        }

        return response.success(profile);
    } catch (e) {
        return response.errorWithLog({msg: 'Server Error'}, e, event);
    }
};

// @route   GET api/profile/user/username/:username
// @desc    Get profile by username
// @access  Public
module.exports.getProfileByUsername = async (event, context) => {
    const username = event.pathParameters.username;
    await connectToDatabase();
    let errors = [];

    try {
        const profile = await Profile.findOne({
            username
        }).populate('user', ['name', 'avatar']);

        if (!profile) {
            errors.push({msg: 'There is no profile for this user'});
            return response.error(errors);
        }

        return response.success(profile);
    } catch (e) {
        return response.errorWithLog({msg: 'Server Error'}, e, event);
    }
};
