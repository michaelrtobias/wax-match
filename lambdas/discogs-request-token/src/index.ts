import axios, {
  AxiosError,
  AxiosHeaderValue,
  AxiosRequestConfig,
  RawAxiosRequestHeaders,
} from "axios";
import { Method, AxiosOauth, AxiosConfig, AxiosResponse } from "./types";
import { Agent } from "http";
const world = "world";
// interface AxiosConfigOverride extends AxiosRequestConfig

exports.handler = async (): Promise<AxiosResponse> => {
  // let requestToken = "23";

  const config: AxiosConfig = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: {
        oauth_consumer_key: process.env.consumer_key,
        oauth_nonce: "groovybaby",
        oauth_signature: process.env.consumer_secret,
        oauth_signature_method: "PLAINTEXT",
        oauth_timestamp: Date.now(),
        oauth_callback: "http://localhost:5173/discogs/auth",
      },
      "User-Agent": "some_user_agent",
    },
  };
  try {
    const { data, status } = await axios.get<AxiosResponse>(
      "https://api.discogs.com/oauth/request_token",
      config
    );
    return data;
  } catch (error) {
    const err = error as AxiosError;
    console.error(err.message as string);
    throw new Error("There was an error retrieving request token");
  }
};
