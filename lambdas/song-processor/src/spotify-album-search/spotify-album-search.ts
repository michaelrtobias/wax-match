import { DiscogsMasterRelease, AlbumObjectSimplified } from "../types";
import { spotifyAPI } from "../spotify-api";

const formatSearchQuery = (masterRelease: DiscogsMasterRelease): string =>
  encodeURIComponent(
    `album:${masterRelease.title} artist:${masterRelease.artists[0].name} year:${masterRelease.year}`
  );

type spotifyAlbumSearchParams = {
  q: string;
  type: "album";
  limit: string;
  offset: string;
};

const calculateOffset = (limit: number, page: number) => limit * page;
export const spotifyAlbumSearch = async (
  access_token: string,
  masterRelease: DiscogsMasterRelease
): Promise<AlbumObjectSimplified[]> => {
  try {
    let SearchResults = [];
    let page = 0;
    let limit = 50;
    let totalItems = 0;
    while (page < 3) {
      const results = await spotifyAPI(access_token, "search", {
        q: formatSearchQuery(masterRelease),
        type: "album",
        limit: limit.toString(),
        offset: calculateOffset(limit, page).toString(),
      } as spotifyAlbumSearchParams);
      totalItems = results.albums.total;
      SearchResults.push(...results.albums.items);
      page += 1;
      if (totalItems - limit * page <= 0) {
        break;
      } else {
        continue;
      }
    }
    return SearchResults;
  } catch (error) {
    let errorMessage = "Failed to find albums";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};
