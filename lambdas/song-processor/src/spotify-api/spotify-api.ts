import axios, { AxiosRequestConfig } from "axios";

export const spotifyAPI = async (
  access_token: string,
  url_endpoint: string,
  params?: object
): Promise<AlbumSearchResponse> => {
  console.log("url endpoint", url_endpoint);
  try {
    const config: AxiosRequestConfig = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      params: params,
    };
    console.log("params", config.params);
    const { data: SearchResults } = await axios.get<AlbumSearchResponse>(
      `https://api.spotify.com/v1/${url_endpoint}`,
      config
    );
    return SearchResults;
  } catch (error) {
    let errorMessage = "Failed to make call";
    console.log("Failed to make call", error);
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};
