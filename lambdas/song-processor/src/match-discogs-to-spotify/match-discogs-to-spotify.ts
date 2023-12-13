import {
  DiscogsMasterRelease,
  AlbumObjectSimplified,
  ArtistObjectSimplified,
  DiscogsArtist,
} from "../types";

const formatArtistList = (
  artistList: DiscogsArtist[] | ArtistObjectSimplified[]
): string[] => artistList.map((artist) => artist.name.toLowerCase());

const checkArtists = (
  discogsArtists: DiscogsArtist[],
  spotifyArtists: ArtistObjectSimplified[]
): boolean => {
  const spotifyArtistNames = formatArtistList(spotifyArtists);
  const discogsArtistNames = formatArtistList(discogsArtists);
  let result = false;

  for (let i = 0; i < discogsArtistNames.length; i++) {
    if (spotifyArtistNames.includes(discogsArtistNames[i])) {
      result = true;
      break;
    }
  }
  return result;
};

export const matchDiscogsAlbumToSpotifyAlbum = (
  masterRelease: DiscogsMasterRelease,
  spotifySearchResults: AlbumObjectSimplified[]
): AlbumObjectSimplified => {
  try {
    const match = spotifySearchResults.find((album, i) => {
      const spotifyReleaseDate = new Date(album.release_date);
      return (
        album.name == masterRelease.title &&
        checkArtists(masterRelease.artists, album.artists) &&
        spotifyReleaseDate.getFullYear() == masterRelease.year
      );
    });
    console.log("match", match);
    return match as AlbumObjectSimplified;
  } catch (error) {
    let errorMessage = "Failed to find albums";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};
