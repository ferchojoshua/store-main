import React, { useState } from "react";
import { IconButton, Paper } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SmallModal from "../../../components/modals/SmallModal";

export const ReportCaller = ({ icon, text, modalTitle, children }) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <Paper
      elevation={10}
      style={{ textAlign: "center", padding: 15, borderRadius: 20 }}
    >
      <IconButton
        onClick={() => setShowModal(true)}
        sx={{
          border: 1,
          borderColor: "#03a9f4",
          p: 2,
          mb: 1,
        }}
      >
        <FontAwesomeIcon
          icon={icon}
          style={{ color: "#2979ff", width: 50, height: 50 }}
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
