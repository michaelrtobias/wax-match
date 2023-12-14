import { SQSEvent } from "aws-lambda";
import { getSpotifyAuth } from "./get-spotify-auth";
import { spotifyAlbumSearch } from "./spotify-album-search";
import { DiscogsRelease } from "./types";
import { getDiscogsMainRelaseAndVersions } from "./get-discogs-main-release";
import { matchDiscogsAlbumToSpotifyAlbum } from "./match-discogs-to-spotify";
import { getSpotifyAlbumTracks } from "./get-spotify-album-tracks";
exports.handler = async (event: SQSEvent): Promise<void> => {
  console.log("event", event);
  const { body } = event.Records[0];
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
    console.log("albumTracks", albumTracks);

    // write to db
  } catch (e) {
    console.error(e);
  }
};
