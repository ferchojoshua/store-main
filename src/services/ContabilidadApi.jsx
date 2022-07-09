import axios from "axios";

const { REACT_APP_PRODURL, REACT_APP_URL } = process.env;

let controller = "";
if (process.env.NODE_ENV === "production") {
  controller = `${REACT_APP_PRODURL}Cont/`;
} else {
  controller = `${REACT_APP_URL}Cont/`;
}

export const getCuentasAsync = async (token) => {
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

export const getAsientosContAsync = async (token) => {
  const result = { statusResponse: true, data: [], error: null };
  let service = `${controller}GetAsientosContables`;
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

export const getCountGroupAsync = async (token) => {
  const result = { statusResponse: true, data: [], error: null };
  let service = `${controller}GetCountGroup`;
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

export const addCountAsync = async (token, data) => {
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

export const deleteCountAsync = async (token, id) => {
  const result = { statusResponse: true, data: [], error: null };

  const authAxios = axios.create({
    baseURL: controller,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  try {
    await authAxios.delete(controller + id).then((resp) => {
      if (resp.status <= 200 && resp.status >= 299) {
        result.statusResponse = false;
        result.error = resp.title;
      } else {
        result.statusResponse = true;
        result.data = resp.data;
      }
    });
  } catch (error) {
    console.log(error);
    result.statusResponse = false;
    result.error = error;
  }
  return result;
};

export const updateCountAsync = async (token, data) => {
  const result = { statusResponse: true, data: [], error: null };
  const authAxios = axios.create({
    baseURL: controller,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  try {
    await authAxios.put(controller, data).then((resp) => {
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
