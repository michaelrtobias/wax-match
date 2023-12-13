import { SQSEvent } from "aws-lambda";
import { getSpotifyAuth } from "./get-spotify-auth";
import { spotifyAlbumSearch } from "./spotify-album-search";
import { DiscogsRelease } from "./types";
import { getDiscogsMainRelaseAndVersions } from "./get-discogs-main-release";
import { matchDiscogsAlbumToSpotifyAlbum } from "./match-discogs-to-spotify";
exports.handler = async (event: SQSEvent): Promise<void> => {
  console.log("event", event);
  const { body } = event.Records[0];
  const album = JSON.parse(body) as DiscogsRelease;
  try {
    // get spotify creds
    const { access_token } = await getSpotifyAuth();
    // get extra discogs info
    const { masterRelease } = await getDiscogsMainRelaseAndVersions(album);

    // search spotify
    const searchResults = await spotifyAlbumSearch(access_token, masterRelease);

    // match discogs release to spotify album to get spotify album id
    matchDiscogsAlbumToSpotifyAlbum(masterRelease, searchResults);

    // write to db
  } catch (e) {
    console.error(e);
  }
};
