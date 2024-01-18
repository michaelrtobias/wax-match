import axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from "axios";
import {
  APIGatewayProxyResult,
  APIGatewayProxyEvent,
  APIGatewayProxyEventQueryStringParameters,
} from "aws-lambda";
import { getAllDiscogReleases } from "./get-all-discog-releases";
exports.handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const { queryStringParameters } = event;

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
  try {
    let results;
    if (queryStringParameters?.per_page === "all") {
      const releases = await getAllDiscogReleases(
        queryStringParameters as APIGatewayProxyEventQueryStringParameters
      );
      results = releases;
    } else {
      const { data } = await axios.get<AxiosResponse>(
        `https://api.discogs.com/users/${queryStringParameters?.discogs_username}/collection/folders/0/releases?per_page=${queryStringParameters?.per_page}&page=${queryStringParameters?.page}`,
        config
      );
      results = data;
    }

    let response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,GET",
      },
      body: JSON.stringify(results),
    };
    return response;
  } catch (error) {
    const err = error as AxiosError;
    console.error(err.message as string);
    return {
      statusCode: 500,
      body: JSON.stringify(err.message),
    };
  }
};
