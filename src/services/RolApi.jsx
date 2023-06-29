import axios from "axios";
const { REACT_APP_PRODURL, REACT_APP_URL } = process.env;

let controller = "";
if (process.env.NODE_ENV === "production") {
  controller = `${REACT_APP_PRODURL}Roles/`;
} else {
  controller = `${REACT_APP_URL}Roles/`;
}

export const getRolesAsync = async (token) => {
  const result = { statusResponse: true, data: [], error: null };
  let service = `${controller}GetRoles`;
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


export const getRolAsync = async (token) => {
  const result = { statusResponse: true, data: [], error: null };
  let service = `${controller}GetRol`;
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

export const createRolAsync = async (token, data) => {
  const result = { statusResponse: true, error: null, data: [] };
  let service = `${controller}CreateRol`;
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

export const updateRolAsync = async (token, data) => {
  const result = { statusResponse: true, error: null, data: [] };
  let service = `${controller}UpdateRol`;
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

export const deleteRolAsync = async (token, roleName) => {
  const result = { statusResponse: true, error: null, data: [] };
  let service = `${controller}DeleteRol/`;
  const authAxios = axios.create({
    baseURL: service,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  try {
    await authAxios.post(service + roleName).then((resp) => {
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
