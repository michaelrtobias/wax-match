import { spotifyAPI } from "../spotify-api";
import {
  TrackObjectSimplified,
  SpotifyGetTracksAudioFeaturesParams,
  MultipleAudioFeaturesResponse,
} from "../types";

const formatIds = (tracks: TrackObjectSimplified[]): string => {
  const ids = tracks.map((track) => track.id);
  return ids.join(",");
};
export const getSpotifyAlbumTrackAudioFeatures = async (
  access_token: string,
  tracks: TrackObjectSimplified[]
): Promise<MultipleAudioFeaturesResponse> => {
  try {
    const results = (await spotifyAPI(access_token, "audio-features", {
      ids: formatIds(tracks),
    } as SpotifyGetTracksAudioFeaturesParams)) as MultipleAudioFeaturesResponse;

    return results as MultipleAudioFeaturesResponse;
  } catch (error) {
    let errorMessage = `Failed to tracks audio features for album`;
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};
