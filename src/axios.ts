import axios from "axios";

const instance = axios.create({
  baseURL: "https://test.v5.pryaniky.com",
});



export default instance;