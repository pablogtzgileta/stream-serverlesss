const success = body => {
    return buildResponse(200, body);
};

const error = body => {
    return buildResponse(500, body);
};

const errorWithLog = (body, error, event) => {
    console.log("ERROR MESSAGE\n" + error.message);
    console.log("ENVIRONMENT VARIABLES\n" + JSON.stringify(process.env, null, 2));
    console.log("EVENT\n" + JSON.stringify(event, null, 2));
    return buildResponse(500, body);
};

const badRequest = body => {
    return buildResponse(400, body);
};

const unauthorized = body => {
    return buildResponse(403, body);
};

const buildResponse = (statusCode, body) => {
    return {
        statusCode: statusCode,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify(body)
    };
};

module.exports = {
    success,
    error,
    unauthorized,
    errorWithLog,
    badRequest
};
