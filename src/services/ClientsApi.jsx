import { url } from "../helpers/Helpers";
import axios from "axios";

const controller = `${url}Clients/`;

export const getClientsAsync = async (token) => {
  const result = { statusResponse: true, data: [], error: null };
  const authAxios = axios.create({
    baseURL: controller,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  try {
    await authAxios.get(controller).then((resp) => {
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

export const getClientByIdAsync = async (token, id) => {
  const result = { statusResponse: true, data: [], error: null };
  const authAxios = axios.create({
    baseURL: controller,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  try {
    await authAxios.get(controller + id).then((resp) => {
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

export const addClientAsync = async (token, data) => {
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

export const updateClientAsync = async (token, data) => {
  const result = { statusResponse: true, data: [], error: null };
  let service = `${controller}UpdateClient`;
  const authAxios = axios.create({
    baseURL: service,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  try {
    await authAxios.post(service, data).then((resp) => {
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

export const deleteClientAsync = async (token, id) => {
  const result = { statusResponse: true, data: [], error: null };
  let service = `${controller}DeleteClient/`;
  const authAxios = axios.create({
    baseURL: service,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  try {
    await authAxios.post(service + id).then((resp) => {
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
