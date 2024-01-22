import {
  SQSClient,
  SendMessageCommand,
  SendMessageCommandInput,
  SendMessageBatchCommandOutput,
} from "@aws-sdk/client-sqs";
import { MappedAlbum } from "../types";

export const sendMessageToAlbumWriterSQS = async (
  match: MappedAlbum
): Promise<void> => {
  const client = new SQSClient({ region: "us-east-1" });
  try {
    const params: SendMessageCommandInput = {
      QueueUrl: process.env.album_writer_queue_url,
      MessageBody: JSON.stringify({
        matchS3key: `matches/${match.discogs.album.id}-${match.spotify.album.id}.json`,
      }),
    };
    await client.send(new SendMessageCommand(params));
  } catch (error) {
    let errorMessage = "Failed to send to SQS";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};
