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
  console.log("spotifyArtistNames", spotifyArtistNames);
  console.log("discogsArtists", discogsArtists);
  for (let i = 0; discogsArtists.length - 1; i++) {
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
    console.log("searching for gold");
    spotifySearchResults.find((album, i) => {
      console.log(`${album.name} - ${i}`, album);
      const spotifyReleaseDate = new Date(album.release_date);
      album.name == masterRelease.title &&
        checkArtists(masterRelease.artists, album.artists) &&
        spotifyReleaseDate.getFullYear() == masterRelease.year;
    });
    console.log("match", spotifySearchResults);
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
