import axios from "axios";
const { REACT_APP_PRODURL, REACT_APP_URL } = process.env;

let controller = "";
if (process.env.NODE_ENV === "production") {
  controller = `${REACT_APP_PRODURL}Account/`;
} else {
  controller = `${REACT_APP_URL}Account/`;
}

export const getToken = () => {
  return localStorage.getItem("token");
};

export const getUser = () => {
  return localStorage.getItem("userName");
};

export const deleteToken = () => {
  return localStorage.removeItem("token");
};

export const deleteUserData = () => {
  return localStorage.removeItem("userName");
};

export const createTokenAsync = async (data) => {
  const result = { statusResponse: true, data: [], error: null };
  let service = `${controller}CreateToken`;

  try {
    await axios.post(service, data).then((resp) => {
      if (resp.status <= 200 && resp.status >= 299) {
        result.statusResponse = false;
        result.error = resp.status;
      } else {
        localStorage.setItem("token", resp.data.token);
        localStorage.setItem(
          "userName",
          `${resp.data.user.firstName} ${resp.data.user.lastName}`
        );
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

export const logOutAsync = async (token) => {
  const result = { statusResponse: true, error: null };
  let service = `${controller}Logout`;
  const authAxios = axios.create({
    baseURL: service,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  try {
    await authAxios.post(service).then((resp) => {
      if (resp.status <= 200 && resp.status >= 299) {
        result.statusResponse = false;
        result.error = resp.status;
      }
    });
    result.statusResponse = true;
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
  } catch (error) {
    result.statusResponse = false;
    result.error = error;
  }
  return result;
};

export const getUserAsync = async (token) => {
  const result = { statusResponse: true, data: [], error: null };
  let service = `${controller}GetUser`;
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

export const changeThemeAsync = async (token) => {
  const result = { statusResponse: true, data: [], error: null };
  let service = `${controller}ChangeTheme`;
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

export const changePasswordAsync = async (data) => {
  const result = { statusResponse: true, data: [], error: null };
  let service = `${controller}ChangePass`;
  const authAxios = axios.create({
    baseURL: service,
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
  });
  try {
    await authAxios.post(service, data).then((resp) => {
      if (resp.status <= 200 && resp.status >= 299) {
        result.statusResponse = false;
        result.error = resp.status;
      }
      result.data = resp.data;
    });
  } catch (error) {
    result.statusResponse = false;
    result.error = error.message;
  }
  return result;
};

export const updateMyAccountAsync = async (token, data) => {
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
      result.data = resp.data;
    });
  } catch (error) {
    result.statusResponse = false;
    result.error = error.message;
  }
  return result;
};
