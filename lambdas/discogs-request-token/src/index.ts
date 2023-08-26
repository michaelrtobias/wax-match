import axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from "axios";
import { APIGatewayProxyResult } from "aws-lambda";

exports.handler = async (): Promise<APIGatewayProxyResult> => {
  const config: AxiosRequestConfig = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `OAuth oauth_consumer_key="${
        process.env.consumer_key
      }",oauth_signature_method="PLAINTEXT",oauth_timestamp="${Date.now()}",oauth_nonce="groovybaby",oauth_callback="http%3A%2F%2Flocalhost%3A5173%2Fdashboard",oauth_signature="${
        process.env.consumer_secret
      }%26"`,
      "User-Agent": "agent",
    },
  };

  try {
    const { data } = await axios.get<AxiosResponse>(
      "https://api.discogs.com/oauth/request_token",
      config
    );

    let response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,GET",
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
