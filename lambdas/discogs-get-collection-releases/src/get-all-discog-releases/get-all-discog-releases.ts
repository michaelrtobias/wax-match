import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import { release, FolderData, DiscogsGetCollectionReleases } from "../types";
import { APIGatewayProxyEventQueryStringParameters } from "aws-lambda";

const formatResultsWithPagination = (
  releases: release[]
): DiscogsGetCollectionReleases => {
  return {
    releases: releases,
    pagination: {
      page: 1,
      pages: 1,
      per_page: "all",
      items: releases.length,
      urls: {
        last: "",
        next: "",
      },
    },
  };
};
export const getAllDiscogReleases = async (
  queryStringParameters: APIGatewayProxyEventQueryStringParameters
): Promise<DiscogsGetCollectionReleases> => {
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
  let releases = [] as release[];
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
    releases = releases.concat(data.releases);
    page += 1;
  }
  return formatResultsWithPagination(releases);
};
