import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBug, faCircleCheck } from "@fortawesome/free-solid-svg-icons";

export const url = "https://localhost:7015/api/";

export const simpleMessage = (text, icon) => {
  Swal.fire(text, "", icon);
};

export const toastSuccess = (message) => {
  toast.success(message, {
    position: toast.POSITION.BOTTOM_LEFT,
    icon: () => (
      <FontAwesomeIcon
        icon={faCircleCheck}
        style={{ color: "#357a38", fontSize: 20 }}
      />
    ),
  });
};

export const toastError = (message) => {
  toast.error(message, {
    position: toast.POSITION.BOTTOM_LEFT,
    icon: () => (
      <FontAwesomeIcon
        icon={faBug}
        style={{ color: "#ff5722", fontSize: 20 }}
      />
    ),
  });
};
