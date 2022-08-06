import React, { useState } from "react";
import { IconButton, Paper } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SmallModal from "../../../components/modals/SmallModal";

export const ReportCaller = ({ icon, text, modalTitle, children }) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <Paper
      elevation={10}
      style={{ textAlign: "center", padding: 20, borderRadius: 20 }}
    >
      <IconButton
        onClick={() => setShowModal(true)}
        sx={{
          border: 1,
          borderColor: "#03a9f4",
          p: 3,
          mb: 1,
        }}
      >
        <FontAwesomeIcon
          icon={icon}
          style={{ fontSize: 60, color: "#2979ff"}}
        />
      </IconButton>
      <hr />
      <h5 style={{ color: "#03a9f4" }}>{text}</h5>

      <SmallModal
        titulo={modalTitle}
        isVisible={showModal}
        setVisible={setShowModal}
      >
        {children}
      </SmallModal>
    </Paper>
  );
};
