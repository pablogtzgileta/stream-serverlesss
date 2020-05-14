const connectToDatabase = require('../config/db');
const response = require('../libs/response-lib');

const Video = require('../models/Video');
const Profile = require('../models/Profile');
const User = require('../models/User');

// @route   POST api/videos
// @desc    Create a video
// @access  Private
module.exports.createVideo = async (event, context) => {
    const auth = JSON.parse(event.requestContext.authorizer.user);
    const body = JSON.parse(event.body);
    await connectToDatabase();
    let errors = [];

    const {title, description, videoUrl, thumbnail, category} = body;

    if (!title || !description || !videoUrl || !thumbnail || !category) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    if (errors.length > 0) return response.badRequest({ errors });


    try {
        // Grab user profile
        const profile = await Profile.findOne({
            user: auth.id
        });

        // Create Video
        const newVideo = new Video({
            user: auth.id,
            username: profile.username,
            profile: profile._id,
            videoUrl: body.videoUrl,
            thumbnail: body.thumbnail,
            title: body.title,
            description: body.description,
            category: body.category
        });

        // Save video in database
        const video = await newVideo.save();

        // Save video in profile
        profile.videos.unshift({video: video.id});
        await profile.save();

        return response.success(video);

    } catch (e) {
        return response.errorWithLog({msg: 'Server Error'}, e, event);
    }
};

// @route   GET api/videos
// @desc    Get all videos
// @access  Public
module.exports.getAllVideos = async (event, context) => {
    await connectToDatabase();

    try {
        const videos = await Video.find().sort({date: -1}); // Most recent first
        return response.success(videos);
    } catch (e) {
        return response.errorWithLog({msg: 'Server Error'}, e, event);
    }
};

// @route   GET api/videos/user/:username
// @desc    Get videos by username
// @access  Public
module.exports.getVideosByUsername = async (event, context) => {
    await connectToDatabase();
    const username = event.pathParameters.username;

    try {
        const videos = await Video.find({
            username
        }).populate('user', ['name']).populate('profile', ['username', 'avatar']).sort({date: -1});

        return response.success(videos);
    } catch (e) {
        return response.errorWithLog({msg: 'Server Error'}, e, event);
    }
};

// @route   GET api/videos/category/:cat
// @desc    Get videos by category
// @access  Public
module.exports.getVideosByCategory = async (event, context) => {
    const category = event.pathParameters.category;
    await connectToDatabase();

    try {
        const videos = await Video.find({
            category
        }).populate('user', ['name']).populate('profile', ['username', 'avatar']).sort({date: -1});

        return response.success(videos);
    } catch (e) {
        return response.errorWithLog({msg: 'Server Error'}, e, event);
    }
};

// @route   GET api/videos/:id
// @desc    Get video by Id
// @access  Public
module.exports.getVideoById = async (event, context) => {
    const videoId = event.pathParameters.id;
    await connectToDatabase();
    let errors = [];

    try {
        const video = await Video.findById(videoId).populate('user', ['name']).populate('profile', ['username', 'avatar']);

        if (!video) {
            errors.push({msg: 'Video not found'});
            return response.error(errors);
        }

        return response.success(video);
    } catch (e) {
        return response.errorWithLog({msg: 'Server Error'}, e, event);
    }
};

// @route   GET api/videos/search/:title
// @desc    Get videos by title
// @access  Public
module.exports.getVideoByTitle = async (event, context) => {
    await connectToDatabase();
    const videoTitle = event.pathParameters.title;

    try {

        const title = req.params.title;
        // const categoryFormatted = category.charAt(0).toUpperCase() + category.slice(1);
        const videos = await Video.find({"title": {$regex : `.*${title}.*`, $options: '-i'}}).sort({date: -1});

        return response.success(videos);
    } catch (e) {
        return response.errorWithLog({msg: 'Server Error'}, e, event);
    }
};

// @route   DELETE api/videos/:id
// @desc    Delete a video
// @access  Private
module.exports.deleteVideoById = async (event, context) => {
    const auth = JSON.parse(event.requestContext.authorizer.user);
    await connectToDatabase();
    let errors = [];

    // TODO add :videoid param

    try {
        const video = await Video.findById(req.params.id);

        // Post does not exist
        if (!video) {
            errors.push({msg: 'Video not found'});
            return response.error(errors);
        }

        // Check user
        if (video.user.toString() !== auth.id) {
            errors.push({msg: 'User not authorized'});
            return response.error(errors);
        }

        await video.remove();

        return response.success({msg: 'Video removed'});
    } catch (e) {
        return response.errorWithLog({msg: 'Server Error'}, e, event);
    }
};

