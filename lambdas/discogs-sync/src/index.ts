import { AxiosError } from "axios";
import { APIGatewayProxyResult, APIGatewayProxyEvent } from "aws-lambda";
import { sendMessageToSQS } from "./send-message-to-sqs";
import { release } from "./types";

type DiscogsSyncInputs = {
  userId: string;
  releases: release[];
};
exports.handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("event", event);
  let { body } = event;
  const parsedBody: DiscogsSyncInputs =
    typeof body === "string" ? JSON.parse(body) : body;

  const { userId, releases } = parsedBody;
  try {
    await sendMessageToSQS(releases, userId);
    let response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST",
      },
      body: `${releases.length} releases have been sent to be synced.`,
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
