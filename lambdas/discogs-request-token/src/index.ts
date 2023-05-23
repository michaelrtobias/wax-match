import { faker } from "@faker-js/faker";
import axios from "axios";
const world = "world";

exports.handler = async (): Promise<string> => {
  try {
    const requestToken = await axios.get(
      "https://api.discogs.com/oauth/request_token"
    );
    return `${faker.internet.userName()} something with a request token`;
  } catch (error) {
    throw new Error(`Error retrieving acces token: ${error.message}`);
  }
};
