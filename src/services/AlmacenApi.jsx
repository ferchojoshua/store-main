import { url } from "../helpers/Helpers";
import axios from "axios";

const controller = `${url}Almacens/`;

export const getStoresAsync = async () => {
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

export const addStoreAsync = async (data) => {
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

export const getStoreByIdAsync = async (id) => {
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

export const updateStoreAsync = async (data) => {
  const result = { statusResponse: true, data: [], error: null };
  let service = `${controller}UpdateAlmacen`;
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

export const getRackStoreAsync = async (id) => {
  const result = { statusResponse: true, data: [], error: null };
  let service = `${controller}GetRacksByStore/`;
  try {
    await axios.get(service + id).then((resp) => {
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

export const addRackToStoreAsync = async (data) => {
    const result = { statusResponse: true, data: [], error: null };
    let service = `${controller}AddRacksToStore`;
    try {
      await axios.post(service, data).then((resp) => {
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

  export const getRackByIdAsync = async (id) => {
    const result = { statusResponse: true, data: [], error: null };
    let service = `${controller}GetRackById/`;
    try {
      await axios.get(service + id).then((resp) => {
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

  export const updateRackAsync = async (data) => {
    const result = { statusResponse: true, data: [], error: null };
    let service = `${controller}UpdateRack`;
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
  
  export const deleteRackAsync = async (id) => {
    const result = { statusResponse: true, data: [], error: null };
    let service = `${controller}DeleteRack/`;
    try {
      await axios.delete(service + id).then((resp) => {
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
