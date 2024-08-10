import axios from "axios";
const { REACT_APP_PRODURL, REACT_APP_URL } = process.env;

let controller = "";
if (process.env.NODE_ENV === "production") {
  controller = `${REACT_APP_PRODURL}CreateLogo/`;
} else {
  controller = `${REACT_APP_URL}CreateLogo/`;
}

export const CreateLogoAsync = async (token, data) => {
  const result = { statusResponse: true, data: [], error: null };
  let service = `${controller}CreateLogo`;
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

// ---
export const getLogoByStoreIdAsync = async (token, storeId) => {
  const result = { statusResponse: true, data: [], error: null };
  let service = `${controller}GetLogoByStoreId/`;
  // alert(`Token: ${token}, Store ID Selected api: ${storeId}`); 
  const authAxios = axios.create({
    baseURL: service,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  try {
    await authAxios.get(service + storeId).then((resp) => {
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

// export const getLogoByStoreIdAsync = async (token, storeId) => {
//   const result = { statusResponse: true, data: [], error: null };
//   let service = `${controller}GetLogoByStoreId`;
//   const authAxios = axios.create({
//     baseURL: service,
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   try {
//     await authAxios.post(service + storeId).then((resp) => {
//       if (resp.status <= 200 && resp.status >= 299) {
//         result.statusResponse = false;
//         result.error = resp.title;
//       } else {
//         result.statusResponse = true;
//         result.data = resp.data;
//       }
//     });
//   } catch (error) {
//     result.statusR    esponse = false;
//     result.error = error;
//   }

//   return result;
// };

export const UpdateLogoAsync = async (token, data) => {
  const result = { statusResponse: true, data: [], error: null };
  let service = `${controller}UpdateLogo`;
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


  export const AjustesAsync = async (token, data) => {
    const result = {statusResponse: true, data: [], error: null};
    let service = `${controller}AjustesAdd`;
    const authAxios = axios.create({
      baseURL: service,
      headers: { Authorization: `Bearer ${token}`,
      },
    });
    try {
      await authAxios.post(service, data).then((resp) => {
        if (resp.status <= 200 && resp.status >= 300) {
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


  export const AjustesUpdateAsync = async (token, data) => {
    const result = {statusResponse: true, data: [], error: null};
    let service = `${controller}AjustesUpdate`;
    const authAxios = axios.create({
      baseURL: service,
      headers: { Authorization: `Bearer ${token}`,
      },
    });
    try {
      await authAxios.post(service, data).then((resp) => {
        if (resp.status <= 200 && resp.status >= 300) {
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


   export const getListAsync = async (token, data) => {
   const result = { statusResponse: true, data: [], error: null };
   let service = `${controller}AjustesGetList`;
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


export const deleteConfigAsync = async (token, id) => {
  const result = { statusResponse: true, data: [], error: null };
  const authAxios = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  try {
    await authAxios.delete(id).then((resp) => {
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
