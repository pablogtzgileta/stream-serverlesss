const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VideoSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'profile'
    },
    videoUrl: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    likes: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            }
        }
    ],
    dislikes: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            }
        }
    ],
    comments: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            },
            text: {
                type: String,
                required: true
            },
            username: {
                type: String
            },
            likes: [
                {
                    user: {
                        type: Schema.Types.ObjectId,
                        ref: 'users'
                    }
                }
            ],
            name: {
                type: String
            },
            avatar: {
                type: String
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Video = mongoose.model('video', VideoSchema);
