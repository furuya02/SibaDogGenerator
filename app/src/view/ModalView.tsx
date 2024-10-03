/* eslint-disable jsx-a11y/alt-text */
import { Box, Modal } from "@mui/material";
import { Dispatch } from "react";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function ModalView({
  modalDialog,
  setModalDialog,
  src,
}: {
  modalDialog: boolean;
  setModalDialog: Dispatch<React.SetStateAction<boolean>>;
  src: string;
}) {
  function handleClose() {
    setModalDialog(false);
  }

  return (
    <Modal
      open={modalDialog}
      onClose={() => handleClose()}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <img src={src} width="100%" />
      </Box>
    </Modal>
  );
}
