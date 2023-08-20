import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosResponse,
  AxiosRequestConfig,
} from "axios";

exports.handler = async (): Promise<AxiosResponse> => {
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
  console.log("config: ", config);
  try {
    const { data, status } = await axios.get<AxiosResponse>(
      "https://api.discogs.com/oauth/request_token",
      config
    );

    return data;
  } catch (error) {
    const err = error as AxiosError;
    console.error(err.message as string);
    console.log(err);
    console.log(err);
    console.log(err.config?.headers);
    console.log(err.config?.headers.Authorization);
    throw new Error("There was an error retrieving request token");
  }
};
