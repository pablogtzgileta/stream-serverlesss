const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    notifications: [
        {
            title: {
                type: String,
                required: true
            },
            notificationType: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    subscriptions: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'
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

module.exports = User = mongoose.model('user', UserSchema);
