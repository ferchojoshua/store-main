import axios from "axios";
const { REACT_APP_PRODURL, REACT_APP_URL } = process.env;

let controller = "";
if (process.env.NODE_ENV === "production") {
  controller = `${REACT_APP_PRODURL}ProductIns/`;
} else {
  controller = `${REACT_APP_URL}ProductIns/`;
}

export const getEntradasAsync = async (token) => {
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

export const getEntradaByIdAsync = async (token, id) => {
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

export const addEntradaProductoAsync = async (token, data) => {
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

export const putProductInAsync = async (token, data) => {
  const result = { statusResponse: true, data: [], error: null };
  let service = `${controller}PutProductIn`;
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

export const putProductRecalAsync = async (token, data) => {
  const result = { statusResponse: true, data: [], error: null };
  let service = `${controller}PutProductRecal`;
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


export const pagarFacturaAsync = async (token, id) => {
  const result = { statusResponse: true, data: [], error: null };
  let service = `${controller}PagarFactura/`;
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
