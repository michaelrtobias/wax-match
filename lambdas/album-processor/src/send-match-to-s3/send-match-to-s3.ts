import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { MappedAlbum } from "../types";

const client = new S3Client({ region: "us-east-1" });

export const sendMatchToS3 = async (match: MappedAlbum): Promise<void> => {
  try {
    const params: PutObjectCommandInput = {
      Bucket: process.env.album_processor_bucket,
      Key: `matches/${match.discogs.album.id}-${match.spotify.album.id}.json`,
      Body: JSON.stringify(match),
    };
    await client.send(new PutObjectCommand(params));
  } catch (error) {
    let errorMessage = "Failed to send to S3";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};
