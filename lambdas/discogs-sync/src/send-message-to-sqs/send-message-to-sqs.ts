import { release } from "../types";

import {
  SQSClient,
  SendMessageCommand,
  SendMessageCommandInput,
  SendMessageBatchCommandOutput,
} from "@aws-sdk/client-sqs";

export const sendMessageToSQS = async (
  releases: release[],
  userId: string
): Promise<void> => {
  const client = new SQSClient({ region: "us-east-1" });
  try {
    for (const release of releases) {
      console.log(release);
      const params: SendMessageCommandInput = {
        QueueUrl: process.env.song_processor_queue_url,
        MessageBody: JSON.stringify(release),
        MessageAttributes: {
          UserId: {
            DataType: "String",
            StringValue: userId,
          },
        },
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
