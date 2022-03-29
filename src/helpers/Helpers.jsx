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

export const oSVersion = () => {
  var OSName = "Unknown OS";
  if (navigator.appVersion.indexOf("Win") != -1) OSName = "WINDOWS";
  if (navigator.appVersion.indexOf("Mac") != -1) OSName = "MACOS";
  if (navigator.appVersion.indexOf("X11") != -1) OSName = "UNIX";
  if (navigator.appVersion.indexOf("Linux") != -1) OSName = "LINUX";
  return OSName;
};

export const navigatorVersion = () => {
  var sBrowser,
    sUsrAg = navigator.userAgent;
  if (sUsrAg.indexOf("Edg") > -1) {
    sBrowser = "Microsoft Edge";
  } else if (sUsrAg.indexOf("Chrome") > -1) {
    sBrowser = "Google Chrome";
  } else if (sUsrAg.indexOf("Safari") > -1) {
    sBrowser = "Apple Safari";
  } else if (sUsrAg.indexOf("Opera") > -1) {
    sBrowser = "Opera";
  } else if (sUsrAg.indexOf("Firefox") > -1) {
    sBrowser = "Mozilla Firefox";
  } else if (sUsrAg.indexOf("MSIE") > -1) {
    sBrowser = "Microsoft Internet Explorer";
  }

  return sBrowser;
};
