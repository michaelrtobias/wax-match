import { AxiosError } from "axios";
import { APIGatewayProxyResult, APIGatewayProxyEvent } from "aws-lambda";
import { getAllDiscogReleases } from "./get-all-discog-releases";
import { sendMessageToSQS } from "./send-message-to-sqs";
import { getAlbumsToSync } from "./get-albums-to-sync/get-albums-to-sync";

type DiscogsSyncInputs = {
  userId: string;
  albumIds: string[];
  oauthToken: string;
  oauthTokenSecret: string;
  discogsUsername: string;
};
exports.handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("event", event);
  let { body } = event;
  const parsedBody: DiscogsSyncInputs =
    typeof body === "string" ? JSON.parse(body) : body;
  console.log(parsedBody);
  const { userId, albumIds, oauthToken, oauthTokenSecret, discogsUsername } =
    parsedBody;
  console.log(1);
  try {
    const releases = await getAllDiscogReleases(
      oauthToken,
      oauthTokenSecret,
      discogsUsername
    );
    console.log(
      "releases",
      releases.map((release) => release.basic_information)
    );
    console.log("user Id", userId);
    const releasesForSync = getAlbumsToSync(albumIds, releases);
    await sendMessageToSQS(releasesForSync, userId);
    let response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST",
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
