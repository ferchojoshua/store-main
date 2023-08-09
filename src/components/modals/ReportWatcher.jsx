import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import FullScreenModal from "./FullScreenModal";

const ReportWatcher = (props) => {
  const [container, setContainer] = useState(null);
  const newWindow = useRef(window);

  useEffect(() => {
    
    setContainer(<FullScreenModal />);
  }, []);

  useEffect(() => {
    if (container) {
      newWindow.current = window.open(
        "",
        "",
        "width=00,height=400,left=200,top=200"
      );
      newWindow.current.document.body.appendChild(container);
      const curWindow = newWindow.current;
      return () => curWindow.close();
    }
  }, [container]);

  window.onunload = unloadPage;
  function unloadPage() {
    alert("unload event detected!");
  }

  return container && createPortal(props.children, container);
};

export default ReportWatcher;
