import axios from 'axios';

export function getApiResponse(lat, lon) {
  let params = new URLSearchParams;
  params.set("lat", lat.trim().replace(/^\+/, ""));
  params.set("lon", lon.trim().replace(/^\+/, ""));
  let url = new URL(process.env.API_URL);
  url.pathname = "/api/v1/chsa";
  url.search = params.toString();

  return axios.get(url.toString()).then(function (response) {
    return response.data;
  });
}