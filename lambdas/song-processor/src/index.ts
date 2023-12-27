import { SQSEvent } from "aws-lambda";
import { getSpotifyAuth } from "./get-spotify-auth";
import { spotifyAlbumSearch } from "./spotify-album-search";
import { DiscogsRelease } from "./types";
import { getDiscogsMainRelaseAndVersions } from "./get-discogs-main-release";
import { matchDiscogsAlbumToSpotifyAlbum } from "./match-discogs-to-spotify";
import { getSpotifyAlbumTracks } from "./get-spotify-album-tracks";
import { getSpotifyAlbumTrackAudioFeatures } from "./get-spotify-album-track-audio-features";
import { getSpotifyAlbumGenres } from "./get-spotify-album-genres";
exports.handler = async (event: SQSEvent): Promise<void> => {
  console.log("event", event);
  const { body, messageAttributes } = event.Records[0];
  const album = JSON.parse(body) as DiscogsRelease;
  console.log("userId", messageAttributes);
  console.log("userId");
  try {
    // get spotify creds
    const { access_token } = await getSpotifyAuth();
    console.log(1);

    // get extra discogs info
    const { masterRelease } = await getDiscogsMainRelaseAndVersions(album);
    console.log(2);

    // search spotify for possible albums
    const searchResults = await spotifyAlbumSearch(access_token, masterRelease);
    console.log(3);

    // match discogs release to spotify album to get spotify album id
    const match = matchDiscogsAlbumToSpotifyAlbum(masterRelease, searchResults);
    console.log(4);
    console.log("match", match);

    // get the tracks from the matched album
    console.log(5);
    const albumTracks = await getSpotifyAlbumTracks(access_token, match);
    console.log(6);
    // get the matched album tracks' audio features
    const trackAudioFeatures = await getSpotifyAlbumTrackAudioFeatures(
      access_token,
      albumTracks
    );
    console.log(7);

    // get the matched album's genres
    const albumGenres = await getSpotifyAlbumGenres(access_token, match);

    // write to db
  } catch (e) {
    console.error(e);
  }
};
