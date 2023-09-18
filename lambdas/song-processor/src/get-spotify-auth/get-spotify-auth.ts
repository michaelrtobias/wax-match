import axios, { AxiosRequestConfig } from "axios";
import { SpotifyAuthResponse } from "../types";
export const getSpotifyAuth = async (): Promise<SpotifyAuthResponse> => {
  try {
    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${process.env.spotify_client_id}:${process.env.spotify_client_secret}`
        ).toString("base64")}` as string,
      },
      data: {
        grant_type: "client_credentials",
      },
    };
    const { data: AuthResponse } = await axios.post<SpotifyAuthResponse>(
      `https://accounts.spotify.com/api/token`,
      config
    );
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
