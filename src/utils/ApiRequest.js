import axios from "axios";
import Cookies from "js-cookie";

axios.defaults.headers.common = { "X-Requested-With": "XMLHttpRequest" };
// TODO: get baseURL from an environment variable
axios.defaults.baseURL =
  process.env.NODE_ENV !== "production"
    ? "http://api.ligaquiz.test/"
    : "https://api.ligaquiz.pt/";

const token = Cookies.get("BEARER-TOKEN");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default axios;
