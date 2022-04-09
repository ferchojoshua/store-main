import { url } from "../helpers/Helpers";
import axios from "axios";

const controller = `${url}Existence/`;


export const getProducExistanceAsync = async (token, productId) => {
    const result = { statusResponse: true, data: [], error: null };
    const authAxios = axios.create({
      baseURL: controller,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    try {
      await authAxios.get(controller + productId).then((resp) => {
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
  