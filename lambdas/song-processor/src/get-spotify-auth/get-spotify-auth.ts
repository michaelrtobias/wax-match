import axios, { AxiosRequestConfig } from "axios";
import { SpotifyAuthResponse } from "../types";
import qs from "qs";
export const getSpotifyAuth = async (): Promise<SpotifyAuthResponse> => {
  try {
    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${process.env.spotify_client_id}:${process.env.spotify_client_secret}`,
          "utf-8"
        ).toString("base64")}`,
      },
    };
    const body = qs.stringify({ grant_type: "client_credentials" });

    const { data: AuthResponse } = await axios.post<SpotifyAuthResponse>(
      "https://accounts.spotify.com/api/token",
      body,
      config
    );
    console.log("post response");
    return AuthResponse;
  } catch (error) {
    let errorMessage = "Failed to authenticate withs spotify";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};
