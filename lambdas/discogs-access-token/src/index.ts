import { faker } from "@faker-js/faker";

exports.handler = async (): Promise<string> => {
  return `${faker.internet.userName()} something with an access token`;
};
