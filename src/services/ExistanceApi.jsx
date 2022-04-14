import { url } from "../helpers/Helpers";
import axios from "axios";

const controller = `${url}Existence/`;

export const getProducExistanceAsync = async (token, data) => {
  const result = { statusResponse: true, data: [], error: null };
  let service = `${controller}GetExistencesByProduct`;
  const authAxios = axios.create({
    baseURL: service,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  try {
    await authAxios.post(service, data).then((resp) => {
      if (resp.status !== 200) {
        result.statusResponse = false;
        result.error = resp.title;
        if (resp.status === 204) {
          result.statusResponse = false;
          result.error = 204;
        }
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

export const getExistencesByStoreAsync = async (token, data) => {
  const result = { statusResponse: true, data: [], error: null };
  let service = `${controller}GetExistencesByStore`;
  const authAxios = axios.create({
    baseURL: service,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  try {
    await authAxios.post(service, data).then((resp) => {
      if (resp.status !== 200) {
        result.statusResponse = false;
        result.error = resp.title;
        if (resp.status === 204) {
          result.statusResponse = false;
          result.error = 204;
        }
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

export const addProductMoverAsync = async (token, data) => {
  const result = { statusResponse: true, data: [], error: null };
  let service = `${controller}AddProductMover`;
  const authAxios = axios.create({
    baseURL: service,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  try {
    await authAxios.post(service, data).then((resp) => {
      if (resp.status !== 200) {
        result.statusResponse = false;
        result.error = resp.title;
        if (resp.status === 204) {
          result.statusResponse = false;
          result.error = 204;
        }
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
