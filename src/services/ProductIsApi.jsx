import { url } from "../helpers/Helpers";
import axios from "axios";

const controller = `${url}ProductIns/`;

export const getFamiliasAsync = async () => {
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