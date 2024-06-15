import axios from "axios";
const { REACT_APP_PRODURL, REACT_APP_URL } = process.env;

let controller = "";
if (process.env.NODE_ENV === "production") {
  controller = `${REACT_APP_PRODURL}Users/`;
} else {
  controller = `${REACT_APP_URL}Users/`;
}

export const getActiveUsersAsync = async (token) => {
  const result = { statusResponse: true, data: [], error: null };
  let service = `${controller}GetActiveUsers`;
  const authAxios = axios.create({
    baseURL: service,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  try {
    await authAxios.get(service).then((resp) => {
      if (resp.status <= 200 && resp.status >= 299) {
        result.statusResponse = false;
        result.error = resp.status;
      }
      result.data = resp.data;
    });
    result.statusResponse = true;
  } catch (error) {
    result.statusResponse = false;
    result.error = error;
  }
  return result;
};

export const getInactiveUsersAsync = async (token) => {
  const result = { statusResponse: true, data: [], error: null };
  let service = `${controller}GetInactiveUsers`;
  const authAxios = axios.create({
    baseURL: service,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  try {
    await authAxios.get(service).then((resp) => {
      if (resp.status <= 200 && resp.status >= 299) {
        result.statusResponse = false;
        result.error = resp.status;
      }
      result.data = resp.data;
    });
    result.statusResponse = true;
  } catch (error) {
    result.statusResponse = false;
    result.error = error;
  }
  return result;
};

export const getAllUsersAsync = async (token) => {
  const result = { statusResponse: true, data: [], error: null };
  let service = `${controller}GetAllUsers`;
  const authAxios = axios.create({
    baseURL: service,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  try {
    await authAxios.get(service).then((resp) => {
      if (resp.status <= 200 && resp.status >= 299) {
        result.statusResponse = false;
        result.error = resp.status;
      }
      result.data = resp.data;
    });
    result.statusResponse = true;
  } catch (error) {
    result.statusResponse = false;
    result.error = error;
  }
  return result;
};

export const createUserAsync = async (token, data) => {
  const result = { statusResponse: true, error: null, data: [] };
  let service = `${controller}CreateUser`;
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
        result.error = resp.status;
      }
    });
    result.statusResponse = true;
  } catch (error) {
    result.statusResponse = false;
    result.error = error;
  }
  return result;
};

export const updateUserAsync = async (token, data) => {
  const result = { statusResponse: true, data: [], error: null };
  let service = `${controller}UpdateUser`;
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
        result.error = resp.status;
      }
    });
    result.statusResponse = true;
  } catch (error) {
    result.statusResponse = false;
    result.error = error;
  }
  return result;
};

export const deactivateUserAsync = async (token, data) => {
  const result = { statusResponse: true, data: [], error: null };
  let service = `${controller}DeactivateUser/`;
  const authAxios = axios.create({
    baseURL: service,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  try {
    await authAxios.post(service + data).then((resp) => {
      if (resp.status <= 200 && resp.status >= 299) {
        result.statusResponse = false;
        result.error = resp.status;
      }
    });
    result.statusResponse = true;
  } catch (error) {
    result.statusResponse = false;
    result.error = error;
  }
  return result;
};

export const resetPasswordAsync = async (token, id) => {
  const result = { statusResponse: true, data: [], error: null };
  let service = `${controller}ResetPassword/`;
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
        result.error = resp.status;
      }
    });
    result.statusResponse = true;
  } catch (error) {
    result.statusResponse = false;
    result.error = error;
  }
  return result;
};
