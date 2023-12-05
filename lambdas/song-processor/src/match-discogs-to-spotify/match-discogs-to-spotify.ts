import {
  DiscogsMasterRelease,
  AlbumObjectSimplified,
  ArtistObjectSimplified,
  DiscogsArtist,
} from "../types";
const checkArtists = (
  discogsArtists: DiscogsArtist[],
  spotifyArtists: ArtistObjectSimplified[]
): boolean => {
  const spotifyArtistNames = spotifyArtists.map((artist) =>
    artist.name.toLowerCase()
  );
  let result;

  for (let i = 0; discogsArtists.length; i++) {
    if (spotifyArtistNames.includes(discogsArtists[i].name.toLowerCase())) {
      result = true;
      break;
    } else {
      result = false;
      continue;
    }
  }
  return result || false;
};

export const matchDiscogsAlbumToSpotifyAlbum = (
  masterRelease: DiscogsMasterRelease,
  spotifySearchResults: AlbumObjectSimplified[]
): string => {
  // on no album found call again for next page
  try {
    spotifySearchResults.find((album) => {
      album.name == masterRelease.title &&
        checkArtists(masterRelease.artists, album.artists);
    });
  } catch (error) {
    let errorMessage = "Failed to find albums";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
  return "spotify api";
};
