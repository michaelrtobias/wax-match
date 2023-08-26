import axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from "axios";
import { APIGatewayProxyResult, APIGatewayProxyEvent } from "aws-lambda";

type AccessTokenInputs = {
  oauth_token: string;
  oauth_token_secret: string;
  oauth_verifier: string;
};
exports.handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  let { body } = event;
  const parsedBody: AccessTokenInputs =
    typeof body === "string" ? JSON.parse(body) : body;
  const config: AxiosRequestConfig = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `OAuth oauth_consumer_key="${
        process.env.consumer_key
      }",oauth_token="${
        parsedBody?.oauth_token
      }",oauth_signature_method="PLAINTEXT",oauth_timestamp="${Date.now()}",oauth_nonce="groovybaby",oauth_verifier="${
        parsedBody?.oauth_verifier
      }",oauth_signature="${process.env.consumer_secret}%26${
        parsedBody?.oauth_token_secret
      }"`,
      "User-Agent": "agent",
    },
  };
  try {
    const { data } = await axios.post<AxiosResponse>(
      "https://api.discogs.com/oauth/access_token",
      {},
      config
    );

    let response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST",
      },
      body: JSON.stringify(data),
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
