import { url } from "../helpers/Helpers";
import axios from "axios";

const controller = `${url}Sales`;

export const getSalesAsync = async (token) => {
  const result = { statusResponse: true, data: [], error: null };
  const authAxios = axios.create({
    baseURL: controller,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  try {
    await authAxios.get(controller).then((resp) => {
      if (resp.status <= 200 && resp.status >= 299) {
        result.statusResponse = false;
        result.error = resp.title;
      } else {
        result.statusResponse = true;
        result.data = resp.data;
      }
    });
  } catch (error) {
    result.statusResponse = false;
    result.error = error;
  }
  return result;
};

export const addSaleAsync = async (token, data) => {
    const result = { statusResponse: true, data: [], error: null };
    const authAxios = axios.create({
      baseURL: controller,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    try {
      await authAxios.post(controller, data).then((resp) => {
        if (resp.status <= 200 && resp.status >= 299) {
          result.statusResponse = false;
          result.error = resp.title;
        } else {
          result.statusResponse = true;
          result.data = resp.data;
        }
      });
    } catch (error) {
      result.statusResponse = false;
      result.error = error;
    }
    return result;
  };