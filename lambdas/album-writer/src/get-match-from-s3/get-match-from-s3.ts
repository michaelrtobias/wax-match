import {
  S3Client,
  GetObjectCommand,
  GetObjectCommandInput,
  GetObjectCommandOutput,
} from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { MappedAlbum } from "../types";
const client = new S3Client({ region: "us-east-1" });

const parseStreamToString = async (stream: Readable): Promise<string> => {
  return await new Promise((resolve, reject) => {
    let responseDataChunks: Uint8Array[] = [];
    stream.on("data", (chunk) => responseDataChunks.push(chunk));
    stream.on("error", (err) => reject(err));
    stream.on("end", () =>
      resolve(Buffer.concat(responseDataChunks).toString("utf-8"))
    );
  });
};

export const GetMatchFromS3 = async (key: string): Promise<MappedAlbum> => {
  try {
    const params: GetObjectCommandInput = {
      Bucket: process.env.album_processor_bucket,
      Key: key,
    };
    const response = await client.send(new GetObjectCommand(params));
    const body = await parseStreamToString(response.Body as Readable);
    return JSON.parse(body) as MappedAlbum;
  } catch (error) {
    let errorMessage = "Failed to send to S3";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};
