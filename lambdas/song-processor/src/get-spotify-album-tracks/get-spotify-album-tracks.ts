import { spotifyAPI } from "../spotify-api";
import {
  AlbumObjectSimplified,
  AlbumTracksResponse,
  TrackObjectSimplified,
  SpotifyAPIParamsBase,
} from "../types";

const calculateOffset = (limit: number, page: number) => limit * page;

export const getSpotifyAlbumTracks = async (
  access_token: string,
  album: AlbumObjectSimplified
): Promise<TrackObjectSimplified[]> => {
  try {
    let AlbumTracks: TrackObjectSimplified[] = [];
    let page = 0;
    let limit = 50;
    let totalItems = 0;
    while (page < 4) {
      const results = (await spotifyAPI(
        access_token,
        `albums/${album.id}/tracks`,
        {
          limit: limit.toString(),
          offset: calculateOffset(limit, page).toString(),
        } as SpotifyAPIParamsBase
      )) as AlbumTracksResponse;
      totalItems = results.total;
      AlbumTracks.push(...results.items);
      page += 1;
      if (totalItems - limit * page <= 0) {
        break;
      } else {
        continue;
      }
    }
    return AlbumTracks as TrackObjectSimplified[];
  } catch (error) {
    let errorMessage = `Failed to tracks for album ${album.name}`;
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};
