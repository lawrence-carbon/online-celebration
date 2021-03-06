
let response;
const REDIS_ENDPOINT = "redis-19374.c16.us-east-1-3.ec2.cloud.redislabs.com";
const REDIS_PORT = "19374"
const REDIS_PASSWORD = "PASSWORD";

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

        const getAsync = promisify(client.get).bind(client);
        return getAsync('test').then((res) => {console.log('ok');return createResponse(200, res)}).catch((err) => {console.log('err');return createResponse(500,err)});

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