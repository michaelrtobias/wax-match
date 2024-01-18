import { SQSEvent } from "aws-lambda";
import { getSpotifyAuth } from "./get-spotify-auth";
import { spotifyAlbumSearch } from "./spotify-album-search";
import { DiscogsRelease } from "./types";
import { getDiscogsMainRelaseAndVersions } from "./get-discogs-main-release";
import { matchDiscogsAlbumToSpotifyAlbum } from "./match-discogs-to-spotify";
import { getSpotifyAlbumTracks } from "./get-spotify-album-tracks";
import { getSpotifyAlbumTrackAudioFeatures } from "./get-spotify-album-track-audio-features";
import { getSpotifyAlbumGenres } from "./get-spotify-album-genres";
import { sendMessageToAlbumWriterSQS } from "./send-message-to-album-writer-sqs";
exports.handler = async (event: SQSEvent): Promise<void> => {
  const { body, messageAttributes } = event.Records[0];
  const album = JSON.parse(body) as DiscogsRelease;
  try {
    // get spotify creds
    const { access_token } = await getSpotifyAuth();

    // get extra discogs info
    const { masterRelease } = await getDiscogsMainRelaseAndVersions(album);

    // search spotify for possible albums
    const searchResults = await spotifyAlbumSearch(access_token, masterRelease);

    // match discogs release to spotify album to get spotify album id
    const match = matchDiscogsAlbumToSpotifyAlbum(masterRelease, searchResults);

    // get the tracks from the matched album
    const albumTracks = await getSpotifyAlbumTracks(access_token, match);

    // get the matched album tracks' audio features
    const trackAudioFeatures = await getSpotifyAlbumTrackAudioFeatures(
      access_token,
      albumTracks
    );

    // get the matched album's genres
    const albumGenres = await getSpotifyAlbumGenres(access_token, match);

    // write to db
    await sendMessageToAlbumWriterSQS();
  } catch (e) {
    console.error(e);
    throw e;
  }
};
