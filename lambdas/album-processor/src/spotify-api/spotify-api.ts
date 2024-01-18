import axios, { AxiosRequestConfig } from "axios";
import {
  AlbumSearchResponse,
  AlbumTracksResponse,
  SingleAlbumResponse,
  MultipleAudioFeaturesResponse,
} from "../types";

export const spotifyAPI = async (
  access_token: string,
  url_endpoint: string,
  params?: object
): Promise<
  | AlbumSearchResponse
  | AlbumTracksResponse
  | MultipleAudioFeaturesResponse
  | SingleAlbumResponse
> => {
  try {
    const config: AxiosRequestConfig = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      params: params,
    };
    const { data: Results } = await axios.get<
      | AlbumSearchResponse
      | AlbumTracksResponse
      | MultipleAudioFeaturesResponse
      | SingleAlbumResponse
    >(`https://api.spotify.com/v1/${url_endpoint}`, config);
    return Results;
  } catch (error) {
    let errorMessage = "Failed to make call";
    console.error("Failed to make call", error);
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};
