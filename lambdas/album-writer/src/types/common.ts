import { DiscogsRelease } from "./discogs";
import {
  AlbumObjectSimplified,
  MultipleAudioFeaturesResponse,
  Genres,
} from "./spotify";

export interface MappedAlbum {
  discogs: MappedDiscogs;
  spotify: MappedSpotify;
}

type MappedDiscogs = {
  album: DiscogsRelease;
};

type MappedSpotify = {
  album: AlbumObjectSimplified;
  tracks: MultipleAudioFeaturesResponse;
  genres: Genres;
};
