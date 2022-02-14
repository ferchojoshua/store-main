import { url } from "../helpers/Helpers";
import axios from "axios";

const controller = `${url}Productos/`;

export const getProductsAsync = async () => {
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

export const addProductAsync = async (data) => {
  const result = { statusResponse: true, data: [], error: null };
  try {
    await axios.post(controller, data).then((resp) => {
      console.log(resp);
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

export const getProductByIdAsync = async (id) => {
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

export const updateProductAsync = async (data) => {
  const result = { statusResponse: true, data: [], error: null };
  let service = `${controller}UpdateProduct`;
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

export const deleteProductAsync = async (id) => {
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