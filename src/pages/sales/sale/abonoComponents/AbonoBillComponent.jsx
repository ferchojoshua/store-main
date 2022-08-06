import React, { useState, useRef } from "react";
import { IconButton } from "@mui/material";
import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
import ReactToPrint from "react-to-print";
import { AbonoBill } from "./AbonoBill";
import { AbonoMultipleBills } from "./AbonoMultipleBills";

export const AbonoBillComponent = ({ data, client, multipleBill }) => {
  const compRef = useRef();

  console.log(multipleBill);

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
          //   display: "none",
        }}
      >
        {multipleBill ? (
          <AbonoMultipleBills data={data} client={client} ref={compRef} />
        ) : (
          <AbonoBill data={data} client={client} ref={compRef} />
        )}
      </div>
    </div>
  );
};
