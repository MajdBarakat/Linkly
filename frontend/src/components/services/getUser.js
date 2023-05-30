import http from "./httpService";

export default async (jwt) => {
  const result = await http
    .get(process.env.REACT_APP_API + "/users/me", { headers: { "x-auth-token": jwt } })
    .catch((err) => {
      alert(err.response.data)
      localStorage.removeItem('jwt')
      window.location.href= '/login'
    });

  if (!result) throw new Error("Server Error!");

  return result.data;
};