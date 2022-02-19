import { url } from "../helpers/Helpers";
import axios from "axios";

const controller = `${url}Providers/`;

export const getprovidersAsync = async () => {
  const result = { statusResponse: true, data: [], error: null };
  try {
    await axios.get(controller).then((resp) => {
      if (resp.status !== 200) {
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

export const addProviderAsync = async (data) => {
  const result = { statusResponse: true, data: [], error: null };
  try {
    await axios.post(controller, data).then((resp) => {
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

export const getProviderByIdAsync = async (id) => {
  const result = { statusResponse: true, data: [], error: null };
  try {
    await axios.get(controller + id).then((resp) => {
      if (resp.status !== 200) {
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

export const updateProviderAsync = async (data) => {
  const result = { statusResponse: true, data: [], error: null };
  let service = `${controller}UpdateProvider`;
  try {
    await axios.put(service, data).then((resp) => {
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

export const deleteProviderAsync = async (id) => {
  const result = { statusResponse: true, data: [], error: null };
  try {
    await axios.delete(controller + id).then((resp) => {
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
