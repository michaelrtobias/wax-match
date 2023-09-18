import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import { releases, FolderData, DiscogsGetCollectionReleases } from "../types";
import { APIGatewayProxyEventQueryStringParameters } from "aws-lambda";
export const getAllDiscogReleases = async (
  queryStringParameters: APIGatewayProxyEventQueryStringParameters
): Promise<releases[]> => {
  const config: AxiosRequestConfig = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `OAuth oauth_consumer_key="${
        process.env.consumer_key
      }",oauth_token="${
        queryStringParameters?.oauth_token
      }",oauth_signature_method="PLAINTEXT",oauth_timestamp="${Date.now()}",oauth_nonce="groovybaby",oauth_signature="${
        process.env.consumer_secret
      }%26${queryStringParameters?.oauth_token_secret}"`,
      "User-Agent": "agent",
    },
  };
  let releases = [] as releases[];
  const { data: folderData } = await axios.get<FolderData>(
    `https://api.discogs.com/users/${queryStringParameters?.discogs_username}/collection/folders/0`,
    config
  );

  const totalReleases: number = folderData?.count;

  let page = 1;

  for (let i = totalReleases; i > 0; i -= 100) {
    const { data } = await axios.get<DiscogsGetCollectionReleases>(
      `https://api.discogs.com/users/${queryStringParameters?.discogs_username}/collection/folders/0/releases?per_page=100&page=${page}`,
      config
    );
    console.log("data: ", data);
    releases = releases.concat(data.releases);
    page += 1;
  }
  console.log("releases", releases);

  return releases;
};
