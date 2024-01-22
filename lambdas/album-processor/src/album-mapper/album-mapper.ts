import {
  AlbumObjectSimplified,
  DiscogsRelease,
  MultipleAudioFeaturesResponse,
  Genres,
  MappedAlbum,
} from "../types";

export const albumMapper = (
  discogsRelease: DiscogsRelease,
  spotifyAlbum: AlbumObjectSimplified,
  spotifyTracks: MultipleAudioFeaturesResponse,
  spotifyGenres: Genres
): MappedAlbum => ({
  discogs: { album: discogsRelease },
  spotify: {
    album: spotifyAlbum,
    tracks: spotifyTracks,
    genres: spotifyGenres,
  },
});
