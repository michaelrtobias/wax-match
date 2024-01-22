import { SQSEvent } from "aws-lambda";
import { GetMatchFromS3 } from "./get-match-from-s3";

exports.handler = async (event: SQSEvent): Promise<void> => {
  console.log("event", event);
  let { Records } = event;
  const body = JSON.parse(Records[0].body);
  const { matchS3key } = body;
  try {
    const album = await GetMatchFromS3(matchS3key);
    console.log("MappedAlbum", album);
  } catch (error) {
    let errorMessage = "Failed to save to db";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};
