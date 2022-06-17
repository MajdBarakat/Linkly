import http from "./httpService";
import config from "../../config.json";

export default async (jwt) => {
  const result = await http
    .get(config.api + "/users/me", { headers: { "x-auth-token": jwt } })
    .catch((err) => alert(err.response.data));

  if (!result) return;

  return result.data;
};
