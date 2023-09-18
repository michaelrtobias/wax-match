import { releases } from "../types";

import {
  SQSClient,
  SendMessageCommand,
  SendMessageCommandInput,
} from "@aws-sdk/client-sqs";

export const sendMessageToSQS = async (releases: releases[]): Promise<void> => {
  try {
    releases.forEach(async (release) => {
      const client = new SQSClient({ region: "us-east-1" });
      const params: SendMessageCommandInput = {
        QueueUrl: process.env.song_processor_queue_url,
        MessageBody: JSON.stringify(release),
      };
      await client.send(new SendMessageCommand(params));
    });
  } catch (error) {
    let errorMessage = "Failed to send to SQS";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};
