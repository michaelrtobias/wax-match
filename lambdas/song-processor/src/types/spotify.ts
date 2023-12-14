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
