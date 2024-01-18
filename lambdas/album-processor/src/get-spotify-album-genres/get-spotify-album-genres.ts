import { spotifyAPI } from "../spotify-api";
import { AlbumObjectSimplified, SingleAlbumResponse, Genres } from "../types";

export const getSpotifyAlbumGenres = async (
  access_token: string,
  album: AlbumObjectSimplified
): Promise<Genres> => {
  try {
    const result = (await spotifyAPI(
      access_token,
      `albums/${album.id}`,
      {}
    )) as SingleAlbumResponse;
    return result.genres;
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
