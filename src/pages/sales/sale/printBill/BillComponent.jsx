import React, { useRef } from "react";
import { IconButton } from "@mui/material";
import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
import ReactToPrint from "react-to-print";
import { Bill } from "./Bill";

export const BillComponent = ({ data, setShowModal }) => {
  const compRef = useRef();

  return (
    <div
      style={{
        textAlign: "center",
      }}
    >
      <hr />
      <ReactToPrint
        trigger={() => {
          return (
            <IconButton variant="outlined">
              <PrintRoundedIcon
                style={{ fontSize: 70, color: "#2979ff", width: 70 }}
              />
            </IconButton>
          );
        }}
        content={() => compRef.current}
      />

      <div
        style={{
          width: 300,
          display: "none",
        }}
      >
        <Bill data={data} ref={compRef} />
      </div>
    </div>
  );
};