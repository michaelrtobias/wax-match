import { release } from "../types";

import {
  SQSClient,
  SendMessageCommand,
  SendMessageCommandInput,
  SendMessageBatchCommandOutput,
} from "@aws-sdk/client-sqs";

export const sendMessageToSQS = async (releases: release[]): Promise<void> => {
  const client = new SQSClient({ region: "us-east-1" });
  try {
    for (const release of releases) {
      const params: SendMessageCommandInput = {
        QueueUrl: process.env.song_processor_queue_url,
        MessageBody: JSON.stringify(release),
      };
      await client.send(new SendMessageCommand(params));
    }
  } catch (error) {
    let errorMessage = "Failed to send to SQS";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};
