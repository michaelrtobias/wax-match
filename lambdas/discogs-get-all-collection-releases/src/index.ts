import { AxiosError } from "axios";
import {
  APIGatewayProxyResult,
  APIGatewayProxyEvent,
  APIGatewayProxyEventQueryStringParameters,
} from "aws-lambda";
import { getAllDiscogReleases } from "./get-all-discog-releases";
import { sendMessageToSQS } from "./send-message-to-sqs";
exports.handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("event", event);
  const { queryStringParameters } = event;
  try {
    const releases = await getAllDiscogReleases(
      queryStringParameters as APIGatewayProxyEventQueryStringParameters
    );
    await sendMessageToSQS(releases);
    let response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,GET",
      },
      body: JSON.stringify(releases),
    };

    return response;
  } catch (error) {
    const err = error as AxiosError;
    console.error(err.message as string);
    return {
      statusCode: 500,
      body: JSON.stringify(err.message),
    };
  }
};
