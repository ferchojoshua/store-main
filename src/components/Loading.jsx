import React, { useContext } from "react";

import { Backdrop } from "@mui/material";
import { SyncLoader } from "react-spinners";

import { DataContext } from "../context/DataContext";

const Loading = () => {
  const { isLoading } = useContext(DataContext);
  return (
    <div>
      <Backdrop
        sx={{ color: "#fff", zIndex: 2000 }}
        open={isLoading}
      >
        <SyncLoader size={10} margin={3} color={"#36D7B7"} />
      </Backdrop>
    </div>
  );
};

export default Loading;
