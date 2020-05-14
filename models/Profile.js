const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    bio: {
        type: String
    },
    avatar: {
        type: String,
        default: 'https://yt3.ggpht.com/a/AGF-l79_o6QngIpSSvxjU7AnZu86z3_7OzCy-wn2Bw=s288-mo-c-c0xffffffff-rj-k-no'
    },
    categories: {
        type: [String]
    },
    subscribers: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            }
        }
    ],
    videos: [
        {
            video: {
                type: Schema.Types.ObjectId,
                ref: 'videos'
            }
        }
    ],
    social: {
        twitter: {
            type: String
        },
        facebook: {
            type: String
        },
        instagram: {
            type: String
        }
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
