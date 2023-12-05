export interface DiscogsGetCollectionReleases {
  pagination: DiscogsPagination;
  releases: DiscogsRelease[];
}

export type DiscogsPagination = {
  page: number;
  pages: number;
  per_page: number;
  items: number;
  urls: object;
};
export type DiscogsRelease = {
  id: number;
  instance_id: number;
  date_added: string;
  rating: number;
  basic_information: DiscogsBasic_information;
  folder_id: number;
};

export type DiscogsBasic_information = {
  id: number;
  master_id: number;
  master_url: string;
  resource_url: string;
  thumb: string;
  cover_image: string;
  title: string;
  year: number;
  formats: DiscogsFormats[];
  artists: DiscogsArtist[];
  labels: DiscogsLabels[];
  genres: string[];
  styles: string[];
};

export type DiscogsFormats = {
  name: string;
  qty: string;
  description: string[];
};

export type DiscogsLabels = {
  name: string;
  catno: string;
  entity_type: string;
  entity_type_name: string;
  id: number;
  resource_url: string;
};

export interface DiscogsMasterRelease {
  id: number;
  main_release: number;
  most_recent_release: number;
  resource_url: string;
  uri: string;
  versions_url: string;
  main_release_url: string;
  most_recent_release_url: string;
  num_for_sale: number;
  lowest_price: number;
  images: DiscogsImage[];
  genres: string[];
  styles: string[];
  year: number;
  tracklist: DiscogsTrack[];
  artists: DiscogsArtist[];
  title: string;
  data_quality: string;
  videos: DiscogsVideo[];
}

export interface DiscogsMainRelease {
  id: number;
  status: string;
  year: number;
  resource_url: string;
  uri: string;
  artists: DiscogsArtist[];
  artists_sort: string;
  labels: DiscogsLabel[];
  series: [];
  companies: DiscogsCompany[];
  formats: DiscogsFormat[];
  data_quality: string;
  community: DiscogsCommunity;
  format_quantity: number;
  date_added: string;
  date_changed: string;
  num_for_sale: number;
  lowest_price: null;
  master_id: number;
  master_url: string;
  title: string;
  country: string;
  released: string;
  notes: string;
  released_formatted: string;
  identifiers: [];
  videos: DiscogsVideo[];
  genres: string[];
  styles: string[];
  tracklist: DiscogsTrack[];
  extraartists: DiscogsArtist[];
  images: DiscogsImage[];
  thumb: string;
  blocked_from_sale: false;
}

export type DiscogsImage = {
  type: string;
  uri: string;
  resource_url: string;
  uri150: string;
  width: number;
  height: number;
};

export type DiscogsTrack = {
  position: string;
  type_: string;
  title: string;
  duration: string;
};
export type DiscogsArtist = {
  name: string;
  anv: string;
  join: string;
  role: string;
  tracks: string;
  id: number;
  resource_url: string;
};

export type DiscogsCompany = {
  name: string;
  catno: string;
  entity_type: string;
  entity_type_name: string;
  id: number;
  resource_url: string;
};

export type DiscogsVideo = {
  uri: string;
  title: string;
  description: string;
  duration: number;
  embed: boolean;
};

export type DiscogsLabel = {
  name: string;
  catno: string;
  entity_type: string;
  entity_type_name: string;
  id: number;
  resource_url: string;
};

export type DiscogsFormat = {
  name: string;
  qty: string;
  text: string;
  descriptions: string[];
};

export type DiscogsCommunity = {
  have: number;
  want: number;
  rating: { count: number; average: number };
  submitter: DiscogsContributor;
  contributors: DiscogsContributor[];
  data_quality: string;
  status: string;
};

export type DiscogsContributor = {
  username: string;
  resource_url: string;
};

export type DiscogsVersionFilterFacet = {
  title: string;
  id: string;
  values: string[];
  allows_multiple_values: boolean;
};

export type DiscogsVersion = {
  id: number;
  label: string;
  country: string;
  title: string;
  major_formats: string[];
  format: string;
  catno: string;
  released: string;
  status: string;
  resource_url: string;
  thumb: string;
  stats: [Object];
};

export interface DiscogsVersions {
  pagination: DiscogsPagination;
  filters: object;
  filter_facets: DiscogsVersionFilterFacet[];
  versions: DiscogsVersion[];
}

export interface getDiscogsMainRelaseAndVersions {
  masterRelease: DiscogsMasterRelease;
  mainRelease: DiscogsMainRelease;
  versions: DiscogsVersions;
}
