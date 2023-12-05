import { SQSEvent } from "aws-lambda";
import { getSpotifyAuth } from "./get-spotify-auth";
import { spotifyAlbumSearch } from "./spotify-album-search";
import { DiscogsRelease } from "./types";
import { getDiscogsMainRelaseAndVersions } from "./get-discogs-main-release";
import { matchDiscogsAlbumToSpotifyAlbum } from "./match-discogs-to-spotify";
import util from "util";
exports.handler = async (event: SQSEvent): Promise<void> => {
  console.log("event", event);
  const { body } = event.Records[0];
  const album = JSON.parse(body) as DiscogsRelease;
  try {
    // get spotify creds
    const { access_token } = await getSpotifyAuth();
    console.log("access token length", access_token.length);
    console.log("spotify auth is done");

    // get extra discogs info
    const { versions, mainRelease, masterRelease } =
      await getDiscogsMainRelaseAndVersions(album);
    console.log("recieved discogs info");

    // search spotify
    const searchResults = await spotifyAlbumSearch(access_token, masterRelease);
    // console.log("searchResults", searchResults);
    console.log(
      util.inspect(searchResults, {
        showHidden: false,
        depth: null,
        colors: true,
      })
    );

    // match discogs release to spotify album to get spotify album id
    matchDiscogsAlbumToSpotifyAlbum(masterRelease, searchResults);
  } catch (e) {
    console.error(e);
  }
};
