import { release } from "../types";

export const getAlbumsToSync = (
  albumIds: string[],
  discogsAlbums: release[]
): release[] => {
  let results: release[] = [];
  albumIds.forEach((id) => {
    const foundAlbum = discogsAlbums.find(
      (album) => album.id.toString() === id
    );
    if (Object.keys(foundAlbum as release).length > 0) {
      results = results.concat(foundAlbum as release);
    }
  });
  return results;
};
