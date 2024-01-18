import {
  SQSClient,
  SendMessageCommand,
  SendMessageCommandInput,
  SendMessageBatchCommandOutput,
} from "@aws-sdk/client-sqs";

export const sendMessageToAlbumWriterSQS = async (): // releases: release[],
// userId: string
Promise<void> => {
  const client = new SQSClient({ region: "us-east-1" });
  try {
    // for (const release of releases) {
    //   console.log(release);
    const params: SendMessageCommandInput = {
      QueueUrl: process.env.song_writer_queue_url,
      MessageBody: "it worked",
    };
    await client.send(new SendMessageCommand(params));
    // }
  } catch (error) {
    let errorMessage = "Failed to send to SQS";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};
