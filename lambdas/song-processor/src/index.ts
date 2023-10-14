import { SQSEvent } from "aws-lambda";
import { getSpotifyAuth } from "./get-spotify-auth";
exports.handler = async (event: SQSEvent): Promise<void> => {
  console.log("event", event);
  try {
    const { access_token, token_type } = await getSpotifyAuth();
    console.log("access_token", access_token.length);
    console.log("token_type", token_type.length);
  } catch (e) {
    console.log(e);
  }
};
