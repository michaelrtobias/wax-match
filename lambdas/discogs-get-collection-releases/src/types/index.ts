export interface DiscogsGetCollectionReleases {
  pagination: pagination;
  releases: release[];
}

export type pagination = {
  page: number;
  pages: number;
  per_page: number;
  items: number;
  urls: object;
};
export type release = {
  id: number;
  instance_id: number;
  date_added: string;
  rating: number;
  basic_information: basic_information;
  folder_id: number;
};

export type basic_information = {
  id: number;
  master_id: number;
  master_url: string;
  resource_url: string;
  thumb: string;
  cover_image: string;
  title: string;
  year: number;
  formats: formats[];
  artists: artists[];
  labels: labels[];
  genres: string[];
  styles: string[];
};

export type formats = {
  name: string;
  qty: string;
  description: string[];
};

export type artists = {
  name: string;
  anv: string;
  join: string;
  role: string;
  tracks: string;
  id: number;
  resource_url: string;
};

export type labels = {
  name: string;
  catno: string;
  entity_type: string;
  entity_type_name: string;
  id: number;
  resource_url: string;
};

export type QueryStringParameters = {
  oauth_token: string;
  oauth_token_secret: string;
  discogs_username: string;
  userId: string;
};

export type FolderData = {
  id: number;
  name: string;
  count: number;
  resource_url: string;
};
