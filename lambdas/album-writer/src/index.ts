import { SQSEvent } from "aws-lambda";

exports.handler = async (event: SQSEvent): Promise<string> => {
  console.log("event", event);
  let { Records } = event;
  const body = Records[0].body;

  try {
    return body;
  } catch (error) {
    let errorMessage = "Failed to save to db";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};
