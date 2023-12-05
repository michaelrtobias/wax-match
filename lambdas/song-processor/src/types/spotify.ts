export interface AlbumSearchResponse {
  albums: PagingObject<AlbumObjectSimplified>;
}

export interface AlbumObjectSimplified extends ContextObject {
  album_group?: "album" | "single" | "compilation" | "appears_on" | undefined;
  album_type: "album" | "single" | "compilation";
  artists: ArtistObjectSimplified[];
  available_markets?: string[] | undefined;
  /**
   * The [Spotify ID](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids) for the album.
   */
  id: string;
  /**
   * The cover art for the album in various sizes, widest first.
   */
  images: ImageObject[];
  /**
   * The name of the album. In case of an album takedown, the value may be an empty string.
   */
  name: string;
  /**
   * The date the album was first released, for example `1981`.
   * Depending on the precision, it might be shown as `1981-12` or `1981-12-15`.
   */
  release_date: string;
  /**
   * The precision with which release_date value is known: `year`, `month`, or `day`.
   */
  release_date_precision: "year" | "month" | "day";
  /**
   * Part of the response when [Track Relinking](https://developer.spotify.com/documentation/general/guides/track-relinking-guide/) is applied,
   * the original track is not available in the given market, and Spotify did not have any tracks to relink it with.
   * The track response will still contain metadata for the original track,
   * and a restrictions object containing the reason why the track is not available: `"restrictions" : {"reason" : "market"}`
   */
  restrictions?: RestrictionsObject | undefined;
  type: "album";
  /**
   * The number of tracks in the album.
   */
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
  /**
   * The object type.
   */
  type: "artist" | "playlist" | "album" | "show" | "episode";
  /**
   * A link to the Web API endpoint providing full details.
   */
  href?: string;
  /**
   * Known external URLs.
   */
  external_urls?: ExternalUrlObject;
  /**
   * The [Spotify URI](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids).
   */
  uri?: string;
}

export interface ArtistObjectSimplified extends ContextObject {
  /**
   * The name of the artist.
   */
  name: string;
  /**
   * The [Spotify ID](https://developer.spotify.com/documentation/web-api/#spotify-uris-and-ids) for the artist.
   */
  id: string;
  type: "artist";
}

interface ImageObject {
  /**
   * The image height in pixels. If unknown: `null` or not returned.
   */
  height?: number | undefined;
  /**
   * The source URL of the image.
   */
  url: string;
  /**
   * The image width in pixels. If unknown: null or not returned.
   */
  width?: number | undefined;
}

interface RestrictionsObject {
  reason: string;
}

interface ExternalUrlObject {
  spotify: string;
}
