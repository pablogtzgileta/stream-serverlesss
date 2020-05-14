const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

// Policy helper function
const generatePolicy = (userId, effect, resource, context) => {
    return {
        principalId: userId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: effect,
                    Resource: resource,
                },
            ],
        },
        context,
    };
};

module.exports.verifyToken = (event, context, callback) => {

    // check header or url parameters or post parameters for token
    const token = event.authorizationToken;

    if (!token) return callback(null, 'Unauthorized');

    // verifies secret and checks exp
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return callback(null, 'Unauthorized');

        const authorizerContext = { user: JSON.stringify(decoded.user) };

        const methodArnSplitted = event.methodArn.split('/').slice(0, 2).join('/') + '/*';

        // if everything is good, save to request for use in other routes
        return callback(null, generatePolicy(decoded.id, 'Allow', methodArnSplitted, authorizerContext))
    });

    return callback(null, 'Unauthorized');

};
