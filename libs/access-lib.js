const User = require('../models/User');
const Subscription = require('../models/Subscription');
const Order = require('../models/Order');

const checkIfAdmin = async userId => {
    try {
        let user = await User.findById(userId);

        return user.role === 1;
    } catch (e) {
        return false;
    }
};

const checkIfSameUser = (userId, pathId) => {
    return userId == pathId;
};

const checkIfSameUserSubscription = async (userId, subscriptionId) => {
    try {
        let subscription = await Subscription.findById(subscriptionId);

        return subscription.user.equals(userId);
    } catch (e) {
        return false;
    }
};

const checkIfSameUserOrder = async (userId, orderId) => {
    try {
        let order = await Order.findById(orderId);

        return order.user.equals(userId);
    } catch (e) {
        return false;
    }
};

module.exports = {
    checkIfAdmin,
    checkIfSameUser,
    checkIfSameUserSubscription,
    checkIfSameUserOrder
};
