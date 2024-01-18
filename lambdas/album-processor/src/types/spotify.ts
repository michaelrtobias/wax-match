export interface AlbumSearchResponse {
  albums: PagingObject<AlbumObjectSimplified>;
}

export interface AlbumObjectSimplified extends ContextObject {
  album_group?: "album" | "single" | "compilation" | "appears_on" | undefined;
  album_type: "album" | "single" | "compilation";
  artists: ArtistObjectSimplified[];
  available_markets?: string[] | undefined;
  id: string;
  images: ImageObject[];
  name: string;
  release_date: string;
  release_date_precision: "year" | "month" | "day";
  restrictions?: RestrictionsObject | undefined;
  type: "album";
  total_tracks: number;
}

interface PagingObject<T> {
  href: string;
  items: T[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
}

interface ContextObject {
  type: "artist" | "playlist" | "album" | "show" | "episode";
  href?: string;
  external_urls?: ExternalUrlObject;
  uri?: string;
}

export interface ArtistObjectSimplified extends ContextObject {
  name: string;
  id: string;
  type: "artist";
}

export interface SingleAlbumResponse extends AlbumObjectFull {}

export interface AlbumObjectFull extends AlbumObjectSimplified {
  /**
   * The copyright statements of the album.
   */
  copyrights: CopyrightObject[];
  /**
   * Known external IDs for the album.
   */
  external_ids: ExternalIdObject;
  /**
   * A list of the genres used to classify the album.
   * For example: `"Prog Rock"` , `"Post-Grunge"`. (If not yet classified, the array is empty.)
   */
  genres: Genres;
  /**
   * The label for the album.
   */
  label: string;
  /**
   * The popularity of the album. The value will be between `0` and `100`, with `100` being the most popular.
   * The popularity is calculated from the popularity of the album’s individual tracks;
   */
  popularity: number;
  /**
   * The tracks of the album.
   */
  tracks: PagingObject<TrackObjectSimplified>;
}

export type Genres = string[];
interface CopyrightObject {
  text: string;
  type: "C" | "P";
}

interface ExternalIdObject {
  isrc?: string | undefined;
  ean?: string | undefined;
  upc?: string | undefined;
}

interface ImageObject {
  height?: number | undefined;
  url: string;
  width?: number | undefined;
}

interface RestrictionsObject {
  reason: string;
}

interface ExternalUrlObject {
  spotify: string;
}

export interface AlbumTracksResponse
  extends PagingObject<TrackObjectSimplified> {}

export interface TrackObjectSimplified {
  artists: ArtistObjectSimplified[];
  available_markets?: string[] | undefined;
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: ExternalUrlObject;
  href: string;
  id: string;
  is_playable?: boolean | undefined;
  linked_from?: TrackLinkObject | undefined;
  restrictions?: RestrictionsObject | undefined;
  name: string;
  preview_url: string | null;
  track_number: number;
  type: "track";
  uri: string;
}

interface TrackLinkObject {
  external_urls: ExternalUrlObject;
  href: string;
  id: string;
  type: "track";
  uri: string;
}

export interface SpotifyAPIParamsBase {
  market?: string;
  limit?: string;
  offset?: string;
}

export interface SpotifySearchParams extends SpotifyAPIParamsBase {
  q: string;
  type:
    | "album"
    | "artist"
    | "playlist"
    | "track"
    | "show"
    | "episode"
    | "audiobook";
}
export interface SpotifyGetTracksAudioFeaturesParams {
  ids: string;
}

export interface MultipleAudioFeaturesResponse {
  audio_features: AudioFeaturesObject[];
}

interface AudioFeaturesObject {
  acousticness: number;
  analysis_url: string;
  danceability: number;
  duration_ms: number;
  energy: number;
  id: string;
  instrumentalness: number;
  key: number;
  liveness: number;
  loudness: number;
  mode: number;
  speechiness: number;
  tempo: number;
  time_signature: number;
  track_href: string;
  type: "audio_features";
  uri: string;
  valence: number;
}
