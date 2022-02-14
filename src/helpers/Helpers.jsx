import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export const url = "https://localhost:7015/api/";

export const simpleMessage = (text, icon) => {
  Swal.fire(text, "", icon);
};
