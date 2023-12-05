import axios from "axios";
import { MasterRelease, release } from "../types";
import { MainRelease, Versions } from "../types/discogs";

export const getDiscogsMainRelaseAndVersions = async (album: release) => {
  // master release
  const { data: masterRelease } = await axios.get<MasterRelease>(
    album.basic_information.master_url
  );

  // main release
  const { data: mainRelease } = await axios.get<MainRelease>(
    masterRelease.main_release_url
  );

  // versions
  const { data: versions } = await axios.get<Versions>(
    masterRelease.versions_url
  );

  return {
    masterRelease,
    mainRelease,
    versions,
  };
};
