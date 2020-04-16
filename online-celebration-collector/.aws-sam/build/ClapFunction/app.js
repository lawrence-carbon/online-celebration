
let response;
const REDIS_ENDPOINT = "redis-19374.c16.us-east-1-3.ec2.cloud.redislabs.com";
const REDIS_PORT = "19374"
const REDIS_PASSWORD = "dIlGS5iob0fDRE1FqPfez93RhHZKkRGp";

const redis = require("redis");
const client = redis.createClient({"host": REDIS_ENDPOINT, "port": REDIS_PORT, "password": REDIS_PASSWORD});

const { promisify } = require("util");


/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
exports.lambdaHandler = async (event, context) => {
    //console.log("EVENT: \n" + JSON.stringify(event, null, 2))

    try {
        client.on("error", function(error) {
          console.error(error);
        });

        body = JSON.parse(event.body);
        const setAsync = promisify(client.set).bind(client);
        return setAsync('from', body.from).then((res) => {return createResponse(200, 'Thanks ' + body.from)}).catch((err) => {console.error(err);return createResponse(500,"Didn't work...")});

    } catch (err) {
        console.error("catch");
        return createResponse(500,err);
    }
};

function createResponse(statusCode, msg){
    return {
        'statusCode': statusCode,
        'body': JSON.stringify({
            message: msg
        })
    };
}