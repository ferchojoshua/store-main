import axios from "axios";
const { REACT_APP_PRODURL, REACT_APP_URL } = process.env;

let baseURL = "";
if (process.env.NODE_ENV === "production") {
  baseURL = `${REACT_APP_PRODURL}CreateLogo/`;
} else {
  baseURL = `${REACT_APP_URL}CreateLogo/`;
}

export const CreateLogoAsync = async (token, data) => {
  const result = { statusResponse: true, data: [], error: null };
  try {
    const resp = await axios.post(baseURL, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json', // Agregar el tipo de contenido si es necesario.............
      },
    });

    if (resp.status >= 200 && resp.status < 300) {
      result.data = resp.data;
    } else {
      result.statusResponse = false;
      result.error = resp.statusText;
    }
  } catch (error) {
    result.statusResponse = false;
    result.error = error.message;
  }
  return result;
};

export const getLogoByStoreIdAsync = async (token, storeId) => {
  const result = { statusResponse: true, data: [], error: null };
  try {
    const resp = await axios.get(`${baseURL}${storeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (resp.status === 200) {
      result.data = resp.data;
    } else {
      result.statusResponse = false;
      result.error = resp.statusText;
    }
  } catch (error) {
    result.statusResponse = false;
    result.error = error.message;
  }
  return result;
};


export const updateLogoAsync = async (token, storeId) => {
  const result = { statusResponse: true, data: [], error: null };
  try {
    const resp = await axios.get(`${baseURL}${storeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (resp.status === 200) {
      result.data = resp.data;
    } else {
      result.statusResponse = false;
      result.error = resp.statusText;
    }
  } catch (error) {
    result.statusResponse = false;
    result.error = error.message;
  }
  return result;
};
