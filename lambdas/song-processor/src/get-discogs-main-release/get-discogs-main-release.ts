import axios from "axios";
import {
  DiscogsMasterRelease,
  DiscogsRelease,
  DiscogsMainRelease,
  DiscogsMainRelaseAndVersions,
  DiscogsVersions,
} from "../types";

export const getDiscogsMainRelaseAndVersions = async (
  album: DiscogsRelease
): Promise<DiscogsMainRelaseAndVersions> => {
  // master release
  const { data: masterRelease } = await axios.get<DiscogsMasterRelease>(
    album.basic_information.master_url
  );

  // main release
  const { data: mainRelease } = await axios.get<DiscogsMainRelease>(
    masterRelease.main_release_url
  );

  // versions
  const { data: versions } = await axios.get<DiscogsVersions>(
    masterRelease.versions_url
  );

  return {
    masterRelease,
    mainRelease,
    versions,
  };
};
