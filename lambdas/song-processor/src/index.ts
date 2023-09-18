import { SQSEvent } from "aws-lambda";
import { getSpotifyAuth } from "./get-spotify-auth";
exports.handler = async (event: SQSEvent): Promise<void> => {
  console.log("event", event);
  console.log("I am a lego master");
  // const {} = await getSpotifyAuth();
};
