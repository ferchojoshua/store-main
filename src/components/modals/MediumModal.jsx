import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const MediumModal = ({ titulo, isVisible, setVisible, children }) => {
  return (
    <div>
    
      <Dialog
        PaperProps={{ style: { borderRadius: 25 } }}
        TransitionComponent={Transition}
        open={isVisible}
        onClose={() => setVisible(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle style={{ alignSelf: "center" }}>{titulo}</DialogTitle>
        <DialogContent>{children}</DialogContent>
      </Dialog>
    </div>
  );
};

export default MediumModal;
