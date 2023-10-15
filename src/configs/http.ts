import axios from "axios";

const Http = axios.create({
  baseURL: process.env.API_LINK,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})